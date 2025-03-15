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
import { getNBAMoneyLineBettingMarketsExamples } from "../examples";
import { createNBABettingService } from "../services";

export const getNBAMoneyLineMarketsAction: Action = {
    name: "NBA_MONEY_LINE_MARKETS",
    similes: ["BASKETBALL", "NBA", "BETTING", "SPORTS"],
    description: "Get the NBA Moneyline betting markets.",
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

        try {
            const marketsData = await nbaService.getNBAMoneyLineMarkets();
            const formattedData = marketsData.events
                .map((event) => event.name)
                .join(",");
            elizaLogger.success(`Successfully fetched NBA Moneyline markets`);
            if (callback) {
                callback({
                    text: `Here are the current NBA Moneyline betting markets: ${formattedData}`,
                });
                return true;
            }
        } catch (error: any) {
            elizaLogger.error("Error in NBA plugin handler:", error);
            callback({
                text: `Error fetching NBA Moneyline markets: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: getNBAMoneyLineBettingMarketsExamples as ActionExample[][],
} as Action;
