import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
} from "@elizaos/core";
import { validateNBAMoneyLineBettingConfig } from "../environment";
import { placeNBABetExamples } from "../examples";
import { createNBABettingService } from "../services";
import { Side } from "../types";
import { extractStake } from "../utils/extractStake";
import { sanitizeMarketResponse } from "../utils/sanitizeMarketResponse";
import { extractTeamData } from "../referenceData";

export const placeNBAMoneyLineBet: Action = {
    name: "PLACE_NBA_BET",
    similes: ["BASKETBALL", "NBA", "BETTING", "SPORTS"],
    description: "Place the NBA Moneyline bet.",
    suppressInitialMessage: true,
    validate: async (runtime: IAgentRuntime) => {
        await validateNBAMoneyLineBettingConfig(runtime);
        return true;
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        _options: { [key: string]: unknown },
        callback: HandlerCallback
    ) => {
        const config = await validateNBAMoneyLineBettingConfig(runtime);
        const nbaService = createNBABettingService(config.CB_API_KEY);
        const text = message.content.text;

        const { eventName, teamName } = extractTeamData(message.content.text);
        const stake = extractStake(text);

        elizaLogger.success(`========= Data from text input =========`);
        elizaLogger.success(eventName);
        elizaLogger.success(teamName);
        elizaLogger.success(stake);
        elizaLogger.success(`========= end =========`);

        try {
            const rawMarketsData = await nbaService.getNBAMoneyLineMarkets();
            const marketsData = sanitizeMarketResponse(rawMarketsData);

            // Find the event that matches the eventName
            const matchingEvent = marketsData.events.find(
                (event) => event.name.toLowerCase() === eventName.toLowerCase()
            );

            if (!matchingEvent) {
                callback({
                    text: `I could not find such game. Can you try again with a different game ?`,
                });
                return true;
            }

            // Get the eventId from the matching event
            const eventId = matchingEvent.id.toString();

            // Determine if the teamName is the home or away team
            const isHomeTeam =
                matchingEvent.home.name.toLowerCase() ===
                teamName.toLowerCase();
            const isAwayTeam =
                matchingEvent.away.name.toLowerCase() ===
                teamName.toLowerCase();

            if (!isHomeTeam && !isAwayTeam) {
                callback({
                    text: `I could not find such team for this game. Can you correct the team name and try again ?`,
                });
                return true;
            }

            // Get the moneyline market data
            const moneylineMarket =
                matchingEvent.markets["basketball.moneyline"];
            if (!moneylineMarket) {
                callback({
                    text: `I could not find such market for this game. Can you try again with a different market or a game ?`,
                });
                return true;
            }

            // Get the selections from the submarkets
            const submarketKey = "period=ot&period=ft"; // This seems to be the standard key from examples
            const selections =
                moneylineMarket.submarkets[submarketKey]?.selections;

            if (!selections || selections.length === 0) {
                callback({
                    text: `I could not find any odds for this market. Can you try again with a different market or a game ?`,
                });
                return true;
            }

            // Find the selection for the team
            const outcome = isHomeTeam ? "home" : "away";
            const selection = selections.find((s) => s.outcome === outcome);

            if (!selection) {
                callback({
                    text: `I could not find specific odds you requested for this market. Can you try again with a different market or a game ?`,
                });
                return true;
            }

            // Extract the side and price
            const side = selection.side as Side; // The side should be "BACK" based on examples
            const price = selection.price.toString();

            elizaLogger.success(
                `========= Data passed in to place bet =========`
            );
            elizaLogger.success(eventId);
            elizaLogger.success(stake);
            elizaLogger.success(outcome);
            elizaLogger.success(price);
            elizaLogger.success(`========= end =========`);

            const data = await nbaService.placeBet(
                eventId,
                `${stake}`,
                outcome as Side,
                price
            );
            elizaLogger.success(
                `========== Returned value from placeBet ============`
            );
            elizaLogger.success(JSON.stringify(data));
            elizaLogger.success(`Successfully placed bet on ${teamName}`);

            // Create a URL to a bet tracking page (example URL)
            const url = `https://stg.cb.com/share/en/bets/647ce9ec-0119-4159-8a41-650b01fff05c`;
            if (data.status === "ACCEPTED") {
                callback({
                    text: `Successfully placed a bet of $${stake} on ${teamName} in the ${eventName} game`,
                    url,
                });
                return true;
            }

            elizaLogger.error("Error in NBA plugin handler:");
            callback({
                text: `Sorry. I am unable to place the bet. Please try again later.`,
            });
            return false;
        } catch (error: any) {
            elizaLogger.error("Error in NBA plugin handler:", error);
            callback({
                text: `Sorry. I am unable to place the bet. Please try again later.`,
            });
            return false;
        }
    },
    examples: placeNBABetExamples as ActionExample[][],
} as Action;
