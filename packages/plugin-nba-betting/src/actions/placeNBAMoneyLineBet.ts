import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateImage,
} from "@elizaos/core";
import { validateNBAMoneyLineBettingConfig } from "../environment";
import { placeNBABetExamples } from "../examples";
import { createNBABettingService } from "../services";
import { Side } from "../types";
import { extractStake } from "../utils/extractStake";
import { sanitizeMarketResponse } from "../utils/sanitizeMarketResponse";
import { extractTeamData } from "../referenceData";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

export async function validateCloudinaryConfig(
    runtime: IAgentRuntime
): Promise<boolean> {
    const cloudName = runtime.getSetting("CLOUDINARY_CLOUD_NAME");
    const apiKey = runtime.getSetting("CLOUDINARY_API_KEY");
    const apiSecret = runtime.getSetting("CLOUDINARY_API_SECRET");

    if (!cloudName || !apiKey || !apiSecret) {
        elizaLogger.error(
            "Missing Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
        );
        return false;
    }

    // Configure Cloudinary
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    return true;
}

export async function uploadToCloudinary(
    filePath: string,
    filename: string
): Promise<string> {
    try {
        elizaLogger.log(`Uploading image to Cloudinary: ${filename}`);
        const result = await cloudinary.uploader.upload(filePath, {
            public_id: filename,
            overwrite: true,
            resource_type: "image",
        });

        elizaLogger.log(`Cloudinary upload successful: ${result.secure_url}`);
        return result.secure_url;
    } catch (error) {
        elizaLogger.error(`Cloudinary upload failed: ${error}`);
        throw error;
    }
}

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
            //const url = `https://stg.cb.com/share/en/bets/647ce9ec-0119-4159-8a41-650b01fff05c`;
            const status = data.status;
            if (status === "ACCEPTED" || status === "PENDING_ACCEPTANCE") {
                const cloudinaryConfigValid =
                    await validateCloudinaryConfig(runtime);
                if (!cloudinaryConfigValid) {
                    callback({
                        text:
                            status === "ACCEPTED"
                                ? `Successfully placed a bet of $${stake} on ${teamName} in the ${eventName} game. However failed to generate betslip`
                                : `Bet is pending for acceptance with $${stake} on ${teamName} in the ${eventName} game. Waiting for acceptance. However failed to generate betslip`,
                    });
                    return false;
                }
                const images = await generateImage(
                    {
                        width: 800,
                        height: 576,
                        prompt: "Create an image of a Lakers and Bulls game with their logos in the background",
                    },
                    runtime
                );
                const cloudinaryUrl =
                    await saveGeneratedImageAndUploadToCloudinary(images);
                callback({
                    text:
                        status === "ACCEPTED"
                            ? `Successfully placed a bet of $${stake} on ${teamName} in the ${eventName} game`
                            : `Bet is pending for acceptance with $${stake} on ${teamName} in the ${eventName} game. Waiting for acceptance`,
                    attachments: [
                        {
                            id: crypto.randomUUID(),
                            url: cloudinaryUrl,
                            title: "Betslip",
                            source: "imageGeneration",
                            description: "Lakers vs Bulls game",
                            text: "Betting for Lakers vs Bulls",
                            contentType: "image/png",
                        },
                    ],
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

// Define the missing function locally
export async function saveGeneratedImageAndUploadToCloudinary(imageResult: {
    success: boolean;
    data?: string[];
    error?: any;
}): Promise<string> {
    if (
        !imageResult.success ||
        !imageResult.data ||
        imageResult.data.length === 0
    ) {
        throw new Error("Failed to generate image");
    }

    const image = imageResult.data[0];
    // Save the image and get filepath
    const filename = `generated_${Date.now()}`;

    // Choose save function based on image data format
    const filepath = image.startsWith("http")
        ? await saveHeuristImage(image, filename)
        : saveBase64Image(image, filename);

    // Upload to Cloudinary
    const cloudinaryUrl = await uploadToCloudinary(filepath, filename);

    // Optionally delete the local file after uploading to Cloudinary
    try {
        fs.unlinkSync(filepath);
        elizaLogger.log(`Deleted local file: ${filepath}`);
    } catch (error) {
        elizaLogger.error(`Failed to delete local file: ${filepath}`, error);
    }

    return cloudinaryUrl;
}

// Define helper functions
export function saveBase64Image(base64Data: string, filename: string): string {
    // Remove header from base64 string if it exists
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Create directory if it doesn't exist
    const dir = "./tmp";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    // Save file
    const filepath = `${dir}/${filename}.png`;
    fs.writeFileSync(filepath, base64Image, { encoding: "base64" });
    elizaLogger.log(`Saved base64 image to: ${filepath}`);

    return filepath;
}

export async function saveHeuristImage(
    imageUrl: string,
    filename: string
): Promise<string> {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Create directory if it doesn't exist
    const dir = "./tmp";
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    const filepath = `${dir}/${filename}.png`;
    fs.writeFileSync(filepath, buffer);
    elizaLogger.log(`Saved image from URL to: ${filepath}`);

    return filepath;
}
