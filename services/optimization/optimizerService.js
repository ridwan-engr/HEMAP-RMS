/*
|--------------------------------------------------------------------------
| HEMAP Optimization Service
|--------------------------------------------------------------------------
|
| Coordinates the optimization workflow.
|
| Flow:
|   OptimizationRun
|          │
|          ▼
| optimizationBuilder
|          │
|          ▼
|     FastAPI Solver
|          │
|          ▼
|   resultFormatter
|          │
|          ▼
| MongoDB
|
*/

import OptimizationRun from "../../models/OptimizationRun.js";

import logger from "../../utils/logger.js";

import { buildOptimizationPayload } from "./optimizationBuilder.js";

import * as pyomoClient from "./pyomoClient.js";

import * as resultFormatter from "./resultFormatter.js";


/*
|--------------------------------------------------------------------------
| Retry FastAPI Solver
|--------------------------------------------------------------------------
*/

async function solveWithRetry(payload, retries = 2) {

    let lastError;

    for (let attempt = 1; attempt <= retries + 1; attempt++) {

        try {

            logger.info(`Calling FastAPI (Attempt ${attempt})`);

            return await pyomoClient.solve(payload);

        }

        catch (error) {

            lastError = error;

            logger.warn(
                `Optimization attempt ${attempt} failed: ${error.message}`
            );

            if (attempt <= retries) {

                await new Promise(resolve =>
                    setTimeout(resolve, 1000)
                );

            }

        }

    }

    throw lastError;

}


/*
|--------------------------------------------------------------------------
| Run Optimization
|--------------------------------------------------------------------------
*/

export async function runOptimization(
    optimizationId,
    options = {}
) {

    const optimization =
        await OptimizationRun.findById(optimizationId);

    if (!optimization) {

        throw new Error("Optimization not found.");

    }

    const startedAt = Date.now();

    try {

        logger.info(

            `Starting optimization ${optimizationId}`

        );

        optimization.status = "RUNNING";

        optimization.startedAt = new Date();

        await optimization.save();

        io.to(siteId).emit(

            "optimizationStarted",

            {

                optimizationId

            }

        );

        optimizationCompleted


        /*
        |--------------------------------------------------------------------------
        | Build Payload
        |--------------------------------------------------------------------------
        */

        logger.info(
            "Building optimization payload..."
        );

        const payload =
            await buildOptimizationPayload({

                siteId: optimization.site,

                startDate: optimization.startDate,

                endDate: optimization.endDate,

                scenario:
                    optimization.scenario || "NORMAL",

                userId:
                    optimization.createdBy || null,

                requestId:
                    optimization._id.toString(),

                options

            });


        optimization.inputs = payload;

        await optimization.save();


        /*
        |--------------------------------------------------------------------------
        | Call FastAPI
        |--------------------------------------------------------------------------
        */

        logger.info(
            "Sending payload to FastAPI..."
        );

        const solverResponse =
            await solveWithRetry(payload);


        /*
        |--------------------------------------------------------------------------
        | Format Response
        |--------------------------------------------------------------------------
        */

        logger.info(
            "Formatting optimization results..."
        );

        const result =
            resultFormatter.format(
                solverResponse
            );


        /*
        |--------------------------------------------------------------------------
        | Runtime
        |--------------------------------------------------------------------------
        */

        const executionTime =
            Date.now() - startedAt;


        /*
        |--------------------------------------------------------------------------
        | Save Results
        |--------------------------------------------------------------------------
        */

        optimization.status = "COMPLETED";

        optimization.executionTime = executionTime;

        optimization.completedAt = new Date();

        optimization.rawSolverResponse = solverResponse;

        optimization.outputs = result;

        optimization.dispatchSchedule =
            result.dispatch;

        optimization.energy =
            result.energy;

        optimization.economics =
            result.economics;

        optimization.emissions =
            result.emissions;

        optimization.reliability =
            result.reliability;

        optimization.objectives =
            result.objectives;

        optimization.solver =
            result.solver;

        await optimization.save();


        logger.info(
            `Optimization ${optimizationId} completed successfully in ${executionTime} ms`
        );

        return {

            success: true,

            optimization,

            result

        };

    }

    catch (error) {

        logger.error(error);

        optimization.status = "FAILED";

        optimization.failedAt = new Date();

        optimization.error = {

            message: error.message,

            stack: error.stack,

            timestamp: new Date()

        };

        await optimization.save();

        throw error;

    }

}

export default {

    runOptimization

};