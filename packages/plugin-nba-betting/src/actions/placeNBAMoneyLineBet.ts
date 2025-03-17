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
import {
    getNBAMoneyLineBettingMarketsExamples,
    placeNBABetExamples,
} from "../examples";
import { createNBABettingService } from "../services";
import { extractEventName } from "../utils/extractEventName";
import { extractTeamName } from "../utils/extractTeamName";
import { extractStake } from "../utils/extractStake";

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

        const eventName = extractEventName(text);
        const teamName = extractTeamName(text);
        const stake = extractStake(text);

        elizaLogger.success(`========= data =========`);
        elizaLogger.success(eventName);
        elizaLogger.success(teamName);
        elizaLogger.success(stake);
        elizaLogger.success(`========= end =========`);

        try {
            await nbaService.placeBet(eventName, `${stake}`, teamName);
            elizaLogger.success(`Successfully placed bet on ${teamName}`);

            // Create a URL to a bet tracking page (example URL)
            const url = `https://stg.cb.com/share/en/bets/647ce9ec-0119-4159-8a41-650b01fff05c`;

            callback({
                text: `Successfully placed a bet of $${stake} on ${teamName} in the ${eventName} game`,
                url,
            });
            return true;
        } catch (error: any) {
            elizaLogger.error("Error in NBA plugin handler:", error);
            callback({
                text: `Failed to place bet`,
            });
            return false;
        }
    },
    examples: placeNBABetExamples as ActionExample[][],
} as Action;
