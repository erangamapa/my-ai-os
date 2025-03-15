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
    Celtics: "BOS Celtics",
    Nets: "Brooklyn Nets",
    Hornets: "Charlotte Hornets",
    Bulls: "CHI Bulls",
    Cavaliers: "Cleveland Cavaliers",
    Mavericks: "Dallas Mavericks",
    Nuggets: "Denver Nuggets",
    Pistons: "Detroit Pistons",
    Warriors: "Golden State Warriors",
    Rockets: "Houston Rockets",
    Pacers: "Indiana Pacers",
    Clippers: "LA Clippers",
    Lakers: "LAL Lakers",
    Grizzlies: "Memphis Grizzlies",
    Heat: "Miami Heat",
    Bucks: "MIL Bucks",
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
    "Hawks vs Warriors": "Atlanta Hawks v Golden State Warriors",
    "Hawks vs Clippers": "Atlanta Hawks v LA Clippers",
    "Hawks vs 76ers": "Atlanta Hawks v Philadelphia 76ers",
    "Celtics vs Nets": "BOS Celtics v Brooklyn Nets",
    "Celtics vs Thunder": "BOS Celtics v Oklahoma City Thunder",
    "Nets vs Hawks": "Brooklyn Nets v Atlanta Hawks",
    "Nets vs Celtics": "Brooklyn Nets v BOS Celtics",
    "Nets vs Mavericks": "Brooklyn Nets v Dallas Mavericks",
    "Nets vs Clippers": "Brooklyn Nets v LA Clippers",
    "Nets vs Raptors": "Brooklyn Nets v Toronto Raptors",
    "Bulls vs Nets": "CHI Bulls v Brooklyn Nets",
    "Bulls vs Mavericks": "CHI Bulls v Dallas Mavericks",
    "Bulls vs Lakers": "CHI Bulls v LAL Lakers",
    "Hornets vs Hawks": "Charlotte Hornets v Atlanta Hawks",
    "Hornets vs Knicks": "Charlotte Hornets v New York Knicks",
    "Hornets vs Magic": "Charlotte Hornets v Orlando Magic",
    "Hornets vs Jazz": "Charlotte Hornets v Utah Jazz",
    "Cavaliers vs Clippers": "Cleveland Cavaliers v LA Clippers",
    "Cavaliers vs Magic": "Cleveland Cavaliers v Orlando Magic",
    "Cavaliers vs Spurs": "Cleveland Cavaliers v San Antonio Spurs",
    "Mavericks vs Nets": "Dallas Mavericks v Brooklyn Nets",
    "Mavericks vs Pistons": "Dallas Mavericks v Detroit Pistons",
    "Mavericks vs 76ers": "Dallas Mavericks v Philadelphia 76ers",
    "Nuggets vs Bulls": "Denver Nuggets v CHI Bulls",
    "Nuggets vs Lakers": "Denver Nuggets v LAL Lakers",
    "Nuggets vs Bucks": "Denver Nuggets v MIL Bucks",
    "Nuggets vs Timberwolves": "Denver Nuggets v Minnesota Timberwolves",
    "Nuggets vs Jazz": "Denver Nuggets v Utah Jazz",
    "Nuggets vs Wizards": "Denver Nuggets v Washington Wizards",
    "Pistons vs Cavaliers": "Detroit Pistons v Cleveland Cavaliers",
    "Pistons vs Pelicans": "Detroit Pistons v New Orleans Pelicans",
    "Pistons vs Thunder": "Detroit Pistons v Oklahoma City Thunder",
    "Pistons vs Spurs": "Detroit Pistons v San Antonio Spurs",
    "Pistons vs Wizards": "Detroit Pistons v Washington Wizards",
    "Warriors vs Nuggets": "Golden State Warriors v Denver Nuggets",
    "Warriors vs Bucks": "Golden State Warriors v MIL Bucks",
    "Warriors vs Knicks": "Golden State Warriors v New York Knicks",
    "Warriors vs Kings": "Golden State Warriors v Sacramento Kings",
    "Warriors vs Raptors": "Golden State Warriors v Toronto Raptors",
    "Rockets vs Hawks": "Houston Rockets v Atlanta Hawks",
    "Rockets vs Bulls": "Houston Rockets v CHI Bulls",
    "Rockets vs Mavericks": "Houston Rockets v Dallas Mavericks",
    "Rockets vs Nuggets": "Houston Rockets v Denver Nuggets",
    "Rockets vs 76ers": "Houston Rockets v Philadelphia 76ers",
    "Rockets vs Suns": "Houston Rockets v Phoenix Suns",
    "Pacers vs Nets": "Indiana Pacers v Brooklyn Nets",
    "Pacers vs Mavericks": "Indiana Pacers v Dallas Mavericks",
    "Pacers vs Lakers": "Indiana Pacers v LAL Lakers",
    "Pacers vs Timberwolves": "Indiana Pacers v Minnesota Timberwolves",
    "Pacers vs Kings": "Indiana Pacers v Sacramento Kings",
    "Clippers vs Hornets": "LA Clippers v Charlotte Hornets",
    "Clippers vs Cavaliers": "LA Clippers v Cleveland Cavaliers",
    "Clippers vs Grizzlies": "LA Clippers v Memphis Grizzlies",
    "Clippers vs Thunder": "LA Clippers v Oklahoma City Thunder",
    "Lakers vs Bulls": "LAL Lakers v CHI Bulls",
    "Lakers vs Nuggets": "LAL Lakers v Denver Nuggets",
    "Lakers vs Rockets": "LAL Lakers v Houston Rockets",
    "Lakers vs Bucks": "LAL Lakers v MIL Bucks",
    "Lakers vs Suns": "LAL Lakers v Phoenix Suns",
    "Lakers vs Spurs": "LAL Lakers v San Antonio Spurs",
    "Bucks vs Hawks": "MIL Bucks v Atlanta Hawks",
    "Bucks vs Pacers": "MIL Bucks v Indiana Pacers",
    "Bucks vs Lakers": "MIL Bucks v LAL Lakers",
    "Bucks vs Knicks": "MIL Bucks v New York Knicks",
    "Bucks vs Thunder": "MIL Bucks v Oklahoma City Thunder",
    "Grizzlies vs Celtics": "Memphis Grizzlies v BOS Celtics",
    "Grizzlies vs Cavaliers": "Memphis Grizzlies v Cleveland Cavaliers",
    "Grizzlies vs Lakers": "Memphis Grizzlies v LAL Lakers",
    "Grizzlies vs Heat": "Memphis Grizzlies v Miami Heat",
    "Grizzlies vs Jazz": "Memphis Grizzlies v Utah Jazz",
    "Heat vs Hawks": "Miami Heat v Atlanta Hawks",
    "Heat vs Celtics": "Miami Heat v BOS Celtics",
    "Heat vs Hornets": "Miami Heat v Charlotte Hornets",
    "Heat vs Pistons": "Miami Heat v Detroit Pistons",
    "Heat vs Warriors": "Miami Heat v Golden State Warriors",
    "Heat vs Rockets": "Miami Heat v Houston Rockets",
    "Heat vs Clippers": "Miami Heat v LA Clippers",
    "Timberwolves vs Pistons": "Minnesota Timberwolves v Detroit Pistons",
    "Timberwolves vs Pacers": "Minnesota Timberwolves v Indiana Pacers",
    "Timberwolves vs Pelicans": "Minnesota Timberwolves v New Orleans Pelicans",
    "Timberwolves vs Magic": "Minnesota Timberwolves v Orlando Magic",
    "Timberwolves vs Suns": "Minnesota Timberwolves v Phoenix Suns",
    "Timberwolves vs Jazz": "Minnesota Timberwolves v Utah Jazz",
    "Pelicans vs Hornets": "New Orleans Pelicans v Charlotte Hornets",
    "Pelicans vs Pistons": "New Orleans Pelicans v Detroit Pistons",
    "Pelicans vs Warriors": "New Orleans Pelicans v Golden State Warriors",
    "Pelicans vs Magic": "New Orleans Pelicans v Orlando Magic",
    "Pelicans vs 76ers": "New Orleans Pelicans v Philadelphia 76ers",
    "Knicks vs Mavericks": "New York Knicks v Dallas Mavericks",
    "Knicks vs Clippers": "New York Knicks v LA Clippers",
    "Knicks vs Heat": "New York Knicks v Miami Heat",
    "Knicks vs TrailBlazers": "New York Knicks v Portland Trail Blazers",
    "Knicks vs Wizards": "New York Knicks v Washington Wizards",
    "Thunder vs Bulls": "Oklahoma City Thunder v CHI Bulls",
    "Thunder vs Hornets": "Oklahoma City Thunder v Charlotte Hornets",
    "Thunder vs Pacers": "Oklahoma City Thunder v Indiana Pacers",
    "Thunder vs Grizzlies": "Oklahoma City Thunder v Memphis Grizzlies",
    "Thunder vs 76ers": "Oklahoma City Thunder v Philadelphia 76ers",
    "Magic vs Mavericks": "Orlando Magic v Dallas Mavericks",
    "Magic vs Rockets": "Orlando Magic v Houston Rockets",
    "Magic vs Clippers": "Orlando Magic v LA Clippers",
    "Magic vs Lakers": "Orlando Magic v LAL Lakers",
    "Magic vs Kings": "Orlando Magic v Sacramento Kings",
    "76ers vs Pacers": "Philadelphia 76ers v Indiana Pacers",
    "76ers vs Heat": "Philadelphia 76ers v Miami Heat",
    "76ers vs Raptors": "Philadelphia 76ers v Toronto Raptors",
    "76ers vs Wizards": "Philadelphia 76ers v Washington Wizards",
    "Suns vs Celtics": "Phoenix Suns v BOS Celtics",
    "Suns vs Bulls": "Phoenix Suns v CHI Bulls",
    "Suns vs Cavaliers": "Phoenix Suns v Cleveland Cavaliers",
    "Suns vs Rockets": "Phoenix Suns v Houston Rockets",
    "Suns vs Bucks": "Phoenix Suns v MIL Bucks",
    "Suns vs Kings": "Phoenix Suns v Sacramento Kings",
    "Suns vs Raptors": "Phoenix Suns v Toronto Raptors",
    "TrailBlazers vs Celtics": "Portland Trail Blazers v BOS Celtics",
    "TrailBlazers vs Cavaliers": "Portland Trail Blazers v Cleveland Cavaliers",
    "TrailBlazers vs Nuggets": "Portland Trail Blazers v Denver Nuggets",
    "TrailBlazers vs Grizzlies": "Portland Trail Blazers v Memphis Grizzlies",
    "TrailBlazers vs Knicks": "Portland Trail Blazers v New York Knicks",
    "TrailBlazers vs Raptors": "Portland Trail Blazers v Toronto Raptors",
    "TrailBlazers vs Wizards": "Portland Trail Blazers v Washington Wizards",
    "Kings vs Celtics": "Sacramento Kings v BOS Celtics",
    "Kings vs Bulls": "Sacramento Kings v CHI Bulls",
    "Kings vs Cavaliers": "Sacramento Kings v Cleveland Cavaliers",
    "Kings vs Bucks": "Sacramento Kings v MIL Bucks",
    "Kings vs Grizzlies": "Sacramento Kings v Memphis Grizzlies",
    "Kings vs Thunder": "Sacramento Kings v Oklahoma City Thunder",
    "Kings vs TrailBlazers": "Sacramento Kings v Portland Trail Blazers",
    "Spurs vs Celtics": "San Antonio Spurs v BOS Celtics",
    "Spurs vs Hornets": "San Antonio Spurs v Charlotte Hornets",
    "Spurs vs Mavericks": "San Antonio Spurs v Dallas Mavericks",
    "Spurs vs Warriors": "San Antonio Spurs v Golden State Warriors",
    "Spurs vs Pelicans": "San Antonio Spurs v New Orleans Pelicans",
    "Spurs vs Knicks": "San Antonio Spurs v New York Knicks",
    "Spurs vs 76ers": "San Antonio Spurs v Philadelphia 76ers",
    "Raptors vs Hornets": "Toronto Raptors v Charlotte Hornets",
    "Raptors vs 76ers": "Toronto Raptors v Philadelphia 76ers",
    "Raptors vs Spurs": "Toronto Raptors v San Antonio Spurs",
    "Jazz vs Celtics": "Utah Jazz v BOS Celtics",
    "Jazz vs Bulls": "Utah Jazz v CHI Bulls",
    "Jazz vs Cavaliers": "Utah Jazz v Cleveland Cavaliers",
    "Jazz vs Rockets": "Utah Jazz v Houston Rockets",
    "Jazz vs Grizzlies": "Utah Jazz v Memphis Grizzlies",
    "Jazz vs Raptors": "Utah Jazz v Toronto Raptors",
    "Jazz vs Wizards": "Utah Jazz v Washington Wizards",
    "Wizards vs Nets": "Washington Wizards v Brooklyn Nets",
    "Wizards vs Pacers": "Washington Wizards v Indiana Pacers",
    "Wizards vs Heat": "Washington Wizards v Miami Heat",
    "Wizards vs Magic": "Washington Wizards v Orlando Magic",
    "Wizards vs Raptors": "Washington Wizards v Toronto Raptors",
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
