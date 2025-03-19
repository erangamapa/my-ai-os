import {
    elizaLogger,
    Action,
    ActionExample,
    HandlerCallback,
    IAgentRuntime,
    Memory,
    State,
    generateImage,
    ModelClass,
    ModelProviderName,
} from "@elizaos/core";
import fs from "fs";
import path from "path";
import { validateNBAMoneyLineBettingConfig } from "../environment";
import { extractTeamData } from "../referenceData";
import crypto from "crypto";

// Helper functions for image handling (copied from image-generation plugin)
async function validateCloudinaryConfig(
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
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
    });

    return true;
}

async function uploadToCloudinary(
    filePath: string,
    filename: string
): Promise<string> {
    try {
        elizaLogger.log(`Uploading image to Cloudinary: ${filename}`);
        const { v2: cloudinary } = await import("cloudinary");
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

function saveBase64Image(base64Data: string, filename: string): string {
    // Create generatedImages directory if it doesn't exist
    const imageDir = path.join(process.cwd(), "generatedImages");
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    // Remove the data:image/png;base64 prefix if it exists
    const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, "");

    // Create a buffer from the base64 string
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Create full file path
    const filepath = path.join(imageDir, `${filename}.png`);

    // Save the file
    fs.writeFileSync(filepath, imageBuffer);

    return filepath;
}

async function saveHeuristImage(
    imageUrl: string,
    filename: string
): Promise<string> {
    const imageDir = path.join(process.cwd(), "generatedImages");
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    // Fetch image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    // Create full file path
    const filepath = path.join(imageDir, `${filename}.png`);

    // Save the file
    fs.writeFileSync(filepath, imageBuffer);

    return filepath;
}

export const generateNBABetslipImage: Action = {
    name: "GENERATE_NBA_BETSLIP",
    similes: ["NBA_BETSLIP", "BETSLIP_IMAGE", "BET_RECEIPT"],
    description:
        "Generate an image of an NBA betslip based on the previous bet information.",
    suppressInitialMessage: true,
    validate: async (runtime: IAgentRuntime) => {
        await validateNBAMoneyLineBettingConfig(runtime);
        const cloudinaryConfigValid = await validateCloudinaryConfig(runtime);

        // Check if any image generation API is available
        const anthropicApiKeyOk = !!runtime.getSetting("ANTHROPIC_API_KEY");
        const nineteenAiApiKeyOk = !!runtime.getSetting("NINETEEN_AI_API_KEY");
        const togetherApiKeyOk = !!runtime.getSetting("TOGETHER_API_KEY");
        const heuristApiKeyOk = !!runtime.getSetting("HEURIST_API_KEY");
        const falApiKeyOk = !!runtime.getSetting("FAL_API_KEY");
        const openAiApiKeyOk = !!runtime.getSetting("OPENAI_API_KEY");
        const veniceApiKeyOk = !!runtime.getSetting("VENICE_API_KEY");

        return (
            cloudinaryConfigValid &&
            (anthropicApiKeyOk ||
                togetherApiKeyOk ||
                heuristApiKeyOk ||
                falApiKeyOk ||
                openAiApiKeyOk ||
                veniceApiKeyOk ||
                nineteenAiApiKeyOk)
        );
    },
    handler: async (
        runtime: IAgentRuntime,
        message: Memory,
        state: State,
        options: {
            width?: number;
            height?: number;
        },
        callback: HandlerCallback
    ) => {
        elizaLogger.log("Received request to generate NBA betslip image");

        // Compose state to get previous messages
        state = (await runtime.composeState(message)) as State;

        // Define the expected state structure
        interface ConversationState extends State {
            conversation: {
                memories: Array<{
                    action?: string;
                    user: string;
                    content: { text: string };
                }>;
            };
        }

        // Cast state to the expected type
        const typedState = state as ConversationState;

        // Find the last PLACE_NBA_BET action in the conversation
        const lastBetMessage = typedState.conversation.memories
            .filter(
                (mem) =>
                    mem.action === "PLACE_NBA_BET" &&
                    mem.user === runtime.agentId
            )
            .pop();

        if (!lastBetMessage) {
            callback({
                text: "I couldn't find any previous NBA bets in our conversation. Please place a bet first.",
            });
            return false;
        }

        // Extract bet information from the last bet message
        const betText = lastBetMessage.content.text;
        elizaLogger.log("Found previous bet message:", betText);

        // Extract team data from the bet message
        const { teamName, eventName } = extractTeamData(betText);

        // Extract stake amount using regex
        const stakeMatch = betText.match(/\$(\d+)/);
        const stake = stakeMatch ? stakeMatch[1] : "unknown amount";

        // Parse event name to get both teams
        const teams = eventName.split(" v ");

        // Determine which team is being bet on and which is the opponent
        const bettingOn = teamName;
        const opponent =
            teams.find((team) => team !== bettingOn) || "opponent team";

        // Format date as Month Day, Year
        const betDate = new Date().toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });

        // Create prompt for the betslip image
        const betslipPrompt = `A professional sports betting slip for an NBA game between ${bettingOn} vs ${opponent}. The bet is on ${bettingOn} for $${stake}. The bet slip should include both team logos, the date (${betDate}), bet amount, and have the look of an official sportsbook receipt with a watermark or logo. Use realistic odds and betting slip formatting. Make it look authentic and professional.`;

        elizaLogger.log("Generated betslip prompt:", betslipPrompt);

        // Set the imageModelProvider to TOGETHER if TOGETHER_API_KEY is available
        const originalImageModelProvider = runtime.imageModelProvider;
        if (runtime.getSetting("TOGETHER_API_KEY")) {
            elizaLogger.log("Using Together AI for image generation");
            runtime.imageModelProvider = ModelProviderName.TOGETHER;
        }

        try {
            // Generate the betslip image
            const images = await generateImage(
                {
                    prompt: betslipPrompt,
                    width: options.width || 1024,
                    height: options.height || 1024,
                },
                runtime
            );

            if (images.success && images.data && images.data.length > 0) {
                elizaLogger.log("Betslip image generation successful");

                const image = images.data[0];
                const filename = `nba_betslip_${Date.now()}`;

                // Save the image and get filepath
                const filepath = image.startsWith("http")
                    ? await saveHeuristImage(image, filename)
                    : saveBase64Image(image, filename);

                // Upload to Cloudinary
                const cloudinaryUrl = await uploadToCloudinary(
                    filepath,
                    filename
                );

                // Prepare description and text for the attachment
                const description = `NBA Betslip: ${bettingOn} vs ${opponent}`;
                const responseText = `Here's your betslip for the $${stake} bet on ${bettingOn} in the game against ${opponent}. Good luck!`;

                // Send the response with the image
                callback(
                    {
                        text: responseText,
                        attachments: [
                            {
                                id: crypto.randomUUID(),
                                url: cloudinaryUrl,
                                title: "NBA Betslip",
                                source: "nbaBetting",
                                description: description,
                                text: responseText,
                                contentType: "image/png",
                            },
                        ],
                    },
                    [
                        {
                            attachment: cloudinaryUrl,
                            name: `${filename}.png`,
                        },
                    ]
                );

                // Optionally delete the local file after uploading to Cloudinary
                try {
                    fs.unlinkSync(filepath);
                    elizaLogger.log(`Deleted local file: ${filepath}`);
                } catch (error) {
                    elizaLogger.error(
                        `Failed to delete local file: ${filepath}`,
                        error
                    );
                }

                return true;
            } else {
                elizaLogger.error(
                    "Betslip image generation failed or returned no data"
                );
                callback({
                    text: "I'm sorry, I couldn't generate the betslip image. Please try again later.",
                });
                return false;
            }
        } catch (error) {
            elizaLogger.error("Error generating betslip image:", error);
            callback({
                text: "I encountered an error while generating your betslip image. Please try again later.",
            });
            return false;
        } finally {
            // Restore the original imageModelProvider
            runtime.imageModelProvider = originalImageModelProvider;
        }
    },
    examples: [
        [
            {
                user: "{{user1}}",
                content: { text: "Show me my bet receipt" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here's your betslip image.",
                    action: "GENERATE_NBA_BETSLIP",
                },
            },
        ],
        [
            {
                user: "{{user1}}",
                content: { text: "Generate a betslip for my last bet" },
            },
            {
                user: "{{agentName}}",
                content: {
                    text: "Here's the betslip for your last bet.",
                    action: "GENERATE_NBA_BETSLIP",
                },
            },
        ],
    ],
} as Action;
