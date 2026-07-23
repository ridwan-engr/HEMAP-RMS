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
| Run Optimization
|--------------------------------------------------------------------------
*/

export async function runOptimization(

    optimizationId,

    options

) {

    const optimization = await OptimizationRun.findById(

        optimizationId

    );

    if (!optimization)

        throw new Error(

            "Optimization not found."

        );

    try {

        optimization.status = "RUNNING";

        await optimization.save();

        /*
        -------------------------------------------------------------
        Collect Data
        -------------------------------------------------------------
        */

        const telemetry = await telemetryCollector.collect(

            optimization.site,

            optimization.startDate,

            optimization.endDate

        );

        const forecast = await forecastCollector.collect(

            optimization.site,

            optimization.startDate,

            optimization.endDate

        );

        const tariff = await tariffCollector.collect(

            optimization.site

        );

        /*
        -------------------------------------------------------------
        Build Model
        -------------------------------------------------------------
        */

        const constraints =

            constraintBuilder.build(

                options.constraints

            );

        const objectives =

            objectiveBuilder.build(

                options.objectives

            );

        /*
        -------------------------------------------------------------
        Prepare JSON
        -------------------------------------------------------------
        */

        const payload =

            dataFormatter.format({

                optimization,

                telemetry,

                forecast,

                tariff,

                constraints,

                objectives,

                solver: options.solver

            });

        /*
        -------------------------------------------------------------
        Run Python
        -------------------------------------------------------------
        */

        const solverResult =

            await pyomoClient.solve(

                payload

            );

        /*
        -------------------------------------------------------------
        Parse Result
        -------------------------------------------------------------
        */

        const result =

            resultFormatter.format(

                solverResult

            );

        /*
        -------------------------------------------------------------
        Save
        -------------------------------------------------------------
        */

        optimization.inputs = payload;

        optimization.dispatchSchedule =

            result.dispatch;

        optimization.objectives =

            result.objectives;

        optimization.reliability =

            result.reliability;

        optimization.solver =

            result.solver;

        optimization.status =

            "COMPLETED";

        await optimization.save();

        logger.success(

            `Optimization ${optimizationId} completed.`

        );

        return optimization;

    }

    catch (error) {

        optimization.status = "FAILED";

        optimization.errorMessage =

            error.message;

        await optimization.save();

        logger.error(error);

        throw error;

    }

}