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

export const placeNBABetExamples: ActionExample[][] = [
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet of 10$ for Clippers in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $10 on LA Clippers in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 250$ on Mavericks for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $250 on Dallas Mavericks in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 50$ on Heat in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $50 on Miami Heat in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 100$ wager on Spurs for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $100 on San Antonio Spurs in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 75$ on Clippers in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $75 on LA Clippers in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 200$ on Mavericks for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $200 on Dallas Mavericks in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet of 150$ for Heat in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $150 on Miami Heat in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 300$ on Spurs for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $300 on San Antonio Spurs in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 25$ on Clippers in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $25 on LA Clippers in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 500$ wager on Mavericks for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $500 on Dallas Mavericks in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet of 50$ for Lakers in Lakers vs Celtics game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $50 on Los Angeles Lakers in the Los Angeles Lakers v Boston Celtics game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 100$ on Celtics for Lakers vs Celtics game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $100 on Boston Celtics in the Los Angeles Lakers v Boston Celtics game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 75$ on Warriors in Warriors vs Nets game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $75 on Golden State Warriors in the Golden State Warriors v Brooklyn Nets game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 200$ wager on Nets for Warriors vs Nets game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $200 on Brooklyn Nets in the Golden State Warriors v Brooklyn Nets game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 150$ on Bucks in Bucks vs Suns game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $150 on Milwaukee Bucks in the Milwaukee Bucks v Phoenix Suns game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 300$ on Suns for Bucks vs Suns game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $300 on Phoenix Suns in the Milwaukee Bucks v Phoenix Suns game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet of 75$ for Lakers in Lakers vs Celtics game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $75 on Los Angeles Lakers in the Los Angeles Lakers v Boston Celtics game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 200$ on Celtics for Lakers vs Celtics game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $200 on Boston Celtics in the Los Angeles Lakers v Boston Celtics game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 100$ on Warriors in Warriors vs Nets game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $100 on Golden State Warriors in the Golden State Warriors v Brooklyn Nets game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 250$ wager on Nets for Warriors vs Nets game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $250 on Brooklyn Nets in the Golden State Warriors v Brooklyn Nets game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet of 100$ for Bulls in Bulls vs Cavaliers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Error placing bet: Invalid team or event name.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 200$ on Rockets for Rockets vs Pacers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Error placing bet: Invalid team or event name.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 150$ on Jazz in Jazz vs Wizards game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Error placing bet: Invalid team or event name.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 300$ wager on Hornets for Hornets vs Hawks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Error placing bet: Invalid team or event name.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 50$ on Knicks in Knicks vs Pelicans game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Error placing bet: Invalid team or event name.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a bet for Clippers in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Please provide the stake amount for the bet.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Bet 10$",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $10 on LA Clippers in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 250$ on Mavericks",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Please provide the event name for the bet.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $250 on Dallas Mavericks in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Bet 50$ on Heat",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Please provide the event name for the bet.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $50 on Miami Heat in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Place a 100$ wager",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Please provide the team and event name for the bet.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "on Spurs for Spurs vs Mavericks game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $100 on San Antonio Spurs in the San Antonio Spurs v Dallas Mavericks game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
    [
        {
            user: "{{user1}}",
            content: {
                text: "Wager 75$",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Please provide the team and event name for the bet.",
            },
        },
        {
            user: "{{user1}}",
            content: {
                text: "on Clippers in Heat vs Clippers game",
            },
        },
        {
            user: "{{agent}}",
            content: {
                text: "Successfully placed a bet of $75 on LA Clippers in the Miami Heat v LA Clippers game.",
                action: "PLACE_NBA_BET",
            },
        },
    ],
];
