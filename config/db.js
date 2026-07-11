import mongoose from "mongoose";
import { env } from "./env.js";
import logger from "../utils/logger.js";

export async function connectDatabase() {

    try {

        await mongoose.connect(env.mongodbUri, {
            autoIndex: env.nodeEnv !== "production"
        });

        logger.success("MongoDB connected successfully.");

        mongoose.connection.on("connected", () => {
            logger.success("MongoDB connection established.");
        });

        mongoose.connection.on("disconnected", () => {
            logger.warn("MongoDB disconnected.");
        });

        mongoose.connection.on("reconnected", () => {
            logger.success("MongoDB reconnected.");
        });

        mongoose.connection.on("error", (error) => {
            logger.error({
                message: "MongoDB runtime error",
                name: error.name,
                error: error.message,
                stack: error.stack
            });
        });

    } catch (error) {

        logger.error({
            message: "Failed to connect to MongoDB.",
            name: error.name,
            error: error.message,
            stack: error.stack
        });

        process.exit(1);

    }

}