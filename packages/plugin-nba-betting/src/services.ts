import { NBAMoneyLineMarketsResponse } from "./types";

const BASE_URL = "https://sports-api-stg.cb.com";

export const createNBABettingService = (apiKey: string) => {
    const getNBAMoneyLineMarkets =
        async (): Promise<NBAMoneyLineMarketsResponse> => {
            if (!apiKey) {
                throw new Error("Invalid parameters");
            }

            try {
                const url = `${BASE_URL}/pub/v2/odds/competitions/basketball-usa-nba?markets=basketball.moneyline`;
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "X-API-Key": apiKey,
                    },
                });
                if (!response.ok) {
                    const error = await response.json();
                    throw new Error(error?.message || response.statusText);
                }

                const data = await response.json();
                return data;
            } catch (error: any) {
                console.error("CB API Error:", error.message);
                throw error;
            }
        };

    return { getNBAMoneyLineMarkets };
};
