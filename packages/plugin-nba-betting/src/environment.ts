import { IAgentRuntime } from "@elizaos/core";
import { z } from "zod";

export const nbaBettingEnvSchema = z.object({
    CB_API_KEY: z.string().min(1, "CB API key is required"),
});

export type nbaBettingConfig = z.infer<typeof nbaBettingEnvSchema>;

export async function validateNBAMoneyLineBettingConfig(
    runtime: IAgentRuntime
): Promise<nbaBettingConfig> {
    try {
        const config = {
            CB_API_KEY: runtime.getSetting("CB_API_KEY"),
        };
        console.log("config: ", config);
        return nbaBettingEnvSchema.parse(config);
    } catch (error) {
        console.log("error::::", error);
        if (error instanceof z.ZodError) {
            const errorMessages = error.errors
                .map((err) => `${err.path.join(".")}: ${err.message}`)
                .join("\n");
            throw new Error(
                `CB API configuration validation failed:\n${errorMessages}`
            );
        }
        throw error;
    }
}
