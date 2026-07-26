/*
|--------------------------------------------------------------------------
| HEMAP Optimization Service
|--------------------------------------------------------------------------
|
| Responsible for:
| • Collecting optimization data
| • Building optimization payload
| • Calling FastAPI Optimization Service
| • Formatting solver response
| • Persisting optimization results
|
*/

import OptimizationRun from "../../models/OptimizationRun.js";

import logger from "../../utils/logger.js";

import * as telemetryCollector from "./telemetryCollector.js";
import * as forecastCollector from "./forecastCollector.js";
import * as tariffCollector from "./tariffCollector.js";

import * as constraintBuilder from "./constraintBuilder.js";
import * as objectiveBuilder from "./objectiveBuilder.js";

import * as dataFormatter from "./dataFormatter.js";

import * as pyomoClient from "./pyomoClient.js";

import * as resultFormatter from "./resultFormatter.js";

/*
|--------------------------------------------------------------------------
| Retry Helper
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
    
) 

{

    const optimization = await OptimizationRun.findById(
        
        optimizationId
    
    );

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

        /*
        --------------------------------------------------------------
        Collect Telemetry
        --------------------------------------------------------------
        */

        logger.info("Collecting telemetry...");

        const telemetry =
            await telemetryCollector.collect(
                optimization.site,
                optimization.startDate,
                optimization.endDate
            );

        /*
        --------------------------------------------------------------
        Forecast
        --------------------------------------------------------------
        */

        logger.info("Collecting forecast...");

        const forecast =

            await forecastCollector.collect(

                optimization.site,

                optimization.startDate,

                optimization.endDate
            );

        /*
        --------------------------------------------------------------
        Tariff
        --------------------------------------------------------------
        */

        logger.info("Collecting tariff...");

        const tariff =

            await tariffCollector.collect(

                optimization.site

            );

        /*
        --------------------------------------------------------------
        Constraints
        --------------------------------------------------------------
        */

        logger.info("Building constraints...");

        const constraints =

            constraintBuilder.build(

                options.constraints ?? {}

            );

        /*
        --------------------------------------------------------------
        Objectives
        --------------------------------------------------------------
        */

        logger.info("Building objectives...");

        const objectives =

            objectiveBuilder.build(

                options.objectives ?? {}

            );

        /*
        --------------------------------------------------------------
        Build Payload
        --------------------------------------------------------------
        */

        logger.info("Formatting payload...");

        const payload =

            dataFormatter.format({

                optimization,

                telemetry,

                forecast,

                tariff,

                constraints,

                objectives,

                solver:

                    options.solver ?? {}

            });

        optimization.inputs = payload;

        await optimization.save();

        /*
        --------------------------------------------------------------
        Run FastAPI Optimization
        --------------------------------------------------------------
        */

        logger.info("Sending payload to FastAPI...");

        const solverResponse =

            await solveWithRetry(payload);

        /*
        --------------------------------------------------------------
        Format Result
        --------------------------------------------------------------
        */

        logger.info("Formatting optimization result...");

        const result =

            resultFormatter.format(

                solverResponse

            );

        /*
        --------------------------------------------------------------
        Runtime
        --------------------------------------------------------------
        */

        const executionTime =

            Date.now() - startedAt;

        /*
        --------------------------------------------------------------
        Save Result
        --------------------------------------------------------------
        */

        optimization.executionTime =

            executionTime;

        optimization.completedAt =

            new Date();

        optimization.status =

            "COMPLETED";

        optimization.rawSolverResponse =

            solverResponse;

        optimization.outputs =

            result;

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

            `Optimization ${optimizationId} completed successfully in ${executionTime} ms.`

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