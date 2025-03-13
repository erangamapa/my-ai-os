import { ActionExample } from "@elizaos/core";

export const getNBAMoneyLineBettingMarketsExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you show me the NBA Moneyline betting markets?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Sure! Here are the current NBA Moneyline betting markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I need the latest NBA Moneyline odds.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "No problem! Here are the latest NBA Moneyline odds:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What are the Moneyline bets for today's NBA games?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the Moneyline bets for today's NBA games:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you provide the NBA Moneyline markets?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Of course! Here are the NBA Moneyline markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Show me the NBA Moneyline betting options.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the NBA Moneyline betting options:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Can you list the NBA Moneyline markets for me?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Sure! Here are the current NBA Moneyline markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Thanks! Can you also provide the odds for these markets?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Absolutely! Here are the odds for the listed NBA Moneyline markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "I'm looking for the NBA Moneyline betting markets.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the NBA Moneyline betting markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Great! Can you also show me the latest odds?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Sure! Here are the latest odds for the NBA Moneyline markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Thank you!",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "You're welcome! If you need any more information, feel free to ask.",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "What types of betting markets are available?",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "We offer various NBA betting markets including Moneyline, Point Spread, and Over/Under. Would you like to see the current Moneyline markets?",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Yes, please show me the Moneyline markets.",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Here are the current NBA Moneyline betting markets:",
                action: "NBA_MONEY_LINE_MARKETS",
            },
        },
    ],
];
