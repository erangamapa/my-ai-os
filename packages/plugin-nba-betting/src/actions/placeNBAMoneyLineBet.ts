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
import { createNBABettingService } from "../services";
import { placeNBABetExamples } from "../examples";

const teamNameMap: { [key: string]: string } = {
    Hawks: "Atlanta Hawks",
    Celtics: "Boston Celtics",
    Nets: "Brooklyn Nets",
    Hornets: "Charlotte Hornets",
    Bulls: "Chicago Bulls",
    Cavaliers: "Cleveland Cavaliers",
    Mavericks: "Dallas Mavericks",
    Nuggets: "Denver Nuggets",
    Pistons: "Detroit Pistons",
    Warriors: "Golden State Warriors",
    Rockets: "Houston Rockets",
    Pacers: "Indiana Pacers",
    Clippers: "LA Clippers",
    Lakers: "Los Angeles Lakers",
    Grizzlies: "Memphis Grizzlies",
    Heat: "Miami Heat",
    Bucks: "Milwaukee Bucks",
    Timberwolves: "Minnesota Timberwolves",
    Pelicans: "New Orleans Pelicans",
    Knicks: "New York Knicks",
    Thunder: "Oklahoma City Thunder",
    Magic: "Orlando Magic",
    ["76ers"]: "Philadelphia 76ers",
    Suns: "Phoenix Suns",
    TrailBlazers: "Portland Trail Blazers",
    Kings: "Sacramento Kings",
    Spurs: "San Antonio Spurs",
    Raptors: "Toronto Raptors",
    Jazz: "Utah Jazz",
    Wizards: "Washington Wizards",
};

const eventNameMap: { [key: string]: string } = {
    "Hawks vs Hornets": "Atlanta Hawks v Charlotte Hornets",
    "Celtics vs Nets": "Boston Celtics v Brooklyn Nets",
    "Bulls vs Cavaliers": "Chicago Bulls v Cleveland Cavaliers",
    "Mavericks vs Nuggets": "Dallas Mavericks v Denver Nuggets",
    "Pistons vs Warriors": "Detroit Pistons v Golden State Warriors",
    "Rockets vs Pacers": "Houston Rockets v Indiana Pacers",
    "Clippers vs Lakers": "LA Clippers v Los Angeles Lakers",
    "Grizzlies vs Heat": "Memphis Grizzlies v Miami Heat",
    "Bucks vs Timberwolves": "Milwaukee Bucks v Minnesota Timberwolves",
    "Pelicans vs Knicks": "New Orleans Pelicans v New York Knicks",
    "Thunder vs Magic": "Oklahoma City Thunder v Orlando Magic",
    "76ers vs Suns": "Philadelphia 76ers v Phoenix Suns",
    "TrailBlazers vs Kings": "Portland Trail Blazers v Sacramento Kings",
    "Spurs vs Raptors": "San Antonio Spurs v Toronto Raptors",
    "Jazz vs Wizards": "Utah Jazz v Washington Wizards",
    // Add more event mappings as needed
};

export const placeNBAMoneyLineBet: Action = {
    name: "PLACE_NBA_BET",
    similes: ["BASKETBALL", "NBA", "BETTING", "SPORTS"],
    description: "Place a bet on an NBA game.",
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
        const stakeMatch = text.match(/(\d+)\$/);
        const teamMatch = text.match(/on (\w+)/);
        const eventMatch = text.match(/in (.+) game/);

        if (!stakeMatch || !teamMatch || !eventMatch) {
            callback({
                text: "Invalid bet format. Please provide stake, team, and event name.",
            });
            return false;
        }

        const stake = parseInt(stakeMatch[1], 10);
        const team = teamMatch[1];
        const event = eventMatch[1];

        const fullTeamName = teamNameMap[team];
        const fullEventName = eventNameMap[event];

        if (!fullTeamName || !fullEventName) {
            callback({
                text: "Invalid team or event name.",
            });
            return false;
        }

        try {
            await nbaService.placeBet(fullEventName, `${stake}`, fullTeamName);
            elizaLogger.success(`Successfully placed bet on ${fullEventName}`);
            callback({
                text: `Successfully placed a bet of $${stake} on ${fullTeamName} in the ${fullEventName} game.`,
            });
            return true;
        } catch (error: any) {
            elizaLogger.error("Error in NBA plugin handler:", error);
            callback({
                text: `Error placing bet: ${error.message}`,
                content: { error: error.message },
            });
            return false;
        }
    },
    examples: placeNBABetExamples as ActionExample[][],
};
