import fs from "fs/promises";
import path from "path";

import Report from "../../models/Report.js";
import User from "../../models/User.js";
import { env } from "../../config/env.js";

import * as dashboardService from "../dashboard/dashboardService.js";
import * as statisticsService from "../analytics/statisticsService.js";
import * as forecastService from "../analytics/forecastService.js";
import * as optimizationService from "../analytics/optimizationService.js";
import * as reliabilityService from "../analytics/reliabilityService.js";
import * as insightsService from "../analytics/insightsService.js";
import * as chartService from "../analytics/chartService.js";

import * as alarmService from "../alarm/alarmService.js";
import * as weatherService from "../weather/weatherService.js";

import pdfService from "./pdfService.js";
import excelService from "./excelService.js";

import {

    emitReport,

    emitNotification

} from "../../websocket/eventEmitters.js";

const REPORT_DIRECTORY = path.resolve(
    "storage",
    "reports"
);

/*
|--------------------------------------------------------------------------
| Build Complete Report Dataset
|--------------------------------------------------------------------------
*/

export async function buildReport(filters = {}) {

    const siteId = filters.siteId || null;

    const safe = async (fn, fallback = null) => {

        try {

            return await fn();

        }

        catch (err) {

            console.error(err.message);

            return fallback;

        }

    };

    return {

        generatedAt: new Date(),

        filters,

        dashboard: await safe(
            () => dashboardService.getDashboard(filters),
            {}
        ),

        statistics: await safe(
            () => statisticsService.getDashboardStatistics(filters),
            {}
        ),

        energy: await safe(
            () => statisticsService.getEnergyStatistics(filters),
            {}
        ),

        battery: await safe(
            () => statisticsService.getBatteryStatistics(filters),
            {}
        ),

        solar: await safe(
            () => statisticsService.getSolarStatistics(filters),
            {}
        ),

        generator: await safe(
            () => statisticsService.getGeneratorStatistics(filters),
            {}
        ),

        grid: await safe(
            () => statisticsService.getGridStatistics(filters),
            {}
        ),

        kpis: await safe(
            () => statisticsService.getKPIs(filters),
            {}
        ),

        locations: await safe(
            () => statisticsService.getSiteLocations(),
            []
        ),

        forecast: siteId
            ? await safe(
                () => forecastService.getForecastDashboard(siteId),
                {}
            )
            : {},

        optimization: siteId
            ? await safe(
                () => optimizationService.getOptimizationDashboard(siteId),
                {}
            )
            : {},

        reliability: await safe(
            () => reliabilityService.getDashboardReliability(filters),
            {}
        ),

        insights: await safe(
            () => insightsService.generateInsights(filters),
            {}
        ),

        charts: await safe(
            () => chartService.getDashboardCharts(filters),
            {}
        ),

        alarms: await safe(
            () => alarmService.getAlarmSummary(filters),
            {}
        ),

        weather: siteId
            ? await safe(
                () => weatherService.getLatestWeather(siteId),
                {}
            )
            : {}

    };

}

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export async function generateReport(
    filters = {},
    user
) {

    // Build the dataset ONCE
    const reportData = await buildReport(filters);

    // Ensure report directory exists
    await fs.mkdir(REPORT_DIRECTORY, {
        recursive: true
    });

    /*
    |--------------------------------------------------------------------------
    | JSON
    |--------------------------------------------------------------------------
    */

    const jsonFilename = `report-${Date.now()}.json`;

    const jsonPath = path.join(
        REPORT_DIRECTORY,
        jsonFilename
    );

    await fs.writeFile(
        jsonPath,
        JSON.stringify(reportData, null, 4),
        "utf8"
    );

    /*
    |--------------------------------------------------------------------------
    | PDF
    |--------------------------------------------------------------------------
    */

    const pdf = await pdfService.generatePDF(
        reportData,
        user
    );

    /*
    |--------------------------------------------------------------------------
    | Excel
    |--------------------------------------------------------------------------
    */

    const excel = await excelService.generateExcel(
        reportData
    );

    /*
    |--------------------------------------------------------------------------
    | Database Record
    |--------------------------------------------------------------------------
    */

    const summary = {

        totalSolarEnergy:

            reportData.energy?.totalSolarEnergy ?? 0,

        totalGridEnergy:

            reportData.energy?.totalGridEnergy ?? 0,

        totalGeneratorEnergy:

            reportData.energy?.totalGeneratorEnergy ?? 0,

        batteryEfficiency:

            reportData.battery?.efficiency ?? 0,

        renewableFraction:

            reportData.kpis?.renewablePercentage ?? 0,

        generatorRuntime:

            reportData.generator?.runtime ?? 0,

        alarms:

            reportData.alarms?.total ?? 0,

        saidi:

            reportData.reliability?.kpis?.saidi ?? 0,

        saifi:

            reportData.reliability?.kpis?.saifi ?? 0,

        ens:

            reportData.reliability?.kpis?.ens ?? 0,

        lolp:

            reportData.reliability?.kpis?.lolp ?? 0,

        resilience:

            reportData.reliability?.kpis?.resilience ?? 0

    };

    const report = await Report.create({

        site: filters.siteId,

        generatedBy: user._id,

        reportType:

            filters.reportType ?? "CUSTOM",

        periodStart:

            filters.periodStart ?? new Date(),

        periodEnd:

            filters.periodEnd ?? new Date(),

        summary,

        filePath: pdf.path,

        status: "COMPLETED"

    });

    /*
|--------------------------------------------------------------------------
| Realtime Report
|--------------------------------------------------------------------------
*/

    emitReport(

        user._id,

        {

            reportId: report._id,

            siteId: filters.siteId,

            type: report.type,

            period: report.period,

            generatedAt: report.generatedAt,

            formats: report.format

        }

    );

    emitNotification(

        user._id,

        {

            type: "REPORT",

            priority: "NORMAL",

            title: "Report Generated",

            message:

                `${report.type} report is ready.`,

            reportId: report._id,

            timestamp: new Date()

        }

    );

    return getReportById(report._id);

}


/*
|--------------------------------------------------------------------------
| Reports
|--------------------------------------------------------------------------
*/

export async function getReports(filters = {}) {

    const query = {};

    if (filters.type)
        query.type = filters.type;

    if (filters.status)
        query.status = filters.status;

    if (filters.siteId)
        query.site = filters.siteId;

    if (filters.generatedBy)

        query.generatedBy = filters.generatedBy;

        if (filters.startDate || filters.endDate) {

        query.generatedAt = {};

        if (filters.startDate)
            query.generatedAt.$gte =
                new Date(filters.startDate);

        if (filters.endDate)
            query.generatedAt.$lte =
                new Date(filters.endDate);

    }

    return Report.find(query)

        .populate(

            "generatedBy",

            "firstName lastName email"

        )

        .populate("site")

        .sort({

            generatedAt: -1

        });


}


/*
|--------------------------------------------------------------------------
| Report
|--------------------------------------------------------------------------
*/

export async function getReportById(id) {

    const report = await Report.findById(id)

        .populate(
            "generatedBy",
            "firstName lastName email"
        )

        .populate("site");

    if (!report) {

        throw new Error(

            "Report not found."

        );

    }

    return report;

}

/*
|--------------------------------------------------------------------------
| Download
|--------------------------------------------------------------------------
*/

export async function downloadReport(
    id,
    format = "pdf"
) {

    const report = await getReportById(id);

    let filename;

    switch (format.toLowerCase()) {

        case "json":

            filename = report.jsonFilename;

            break;

        case "excel":

            filename = report.excelFilename;

            break;

        default:

            filename = report.pdfFilename;

    }

    const filePath = path.join(

        REPORT_DIRECTORY,

        filename
    );

    try {

        await fs.access(filePath);

    } catch {

        throw new Error(
            "Report file not found."
        );

    }

    return {

        filename:

            path.basename(report.filePath),

        path:

            report.filePath

    };



}


/*
|--------------------------------------------------------------------------
| Delete
|--------------------------------------------------------------------------
*/

export async function deleteReport(id) {

    const report = await getReportById(id);

    const files = [

        report.jsonFilename,

        report.pdfFilename,

        report.excelFilename

    ];

    for (const file of files) {

        if (!file) continue;

        try {

            await fs.unlink(
                path.join(
                    REPORT_DIRECTORY,
                    file
                )
            );

        }

        catch {

            // Ignore missing files

        }

    }

    await report.deleteOne();

    return true;

}

/*
|--------------------------------------------------------------------------
| Generate Daily Reports
|--------------------------------------------------------------------------
*/

export async function generateDailyReports(siteId) {

    const systemUser = await User.findOne({

        email: env.SYSTEM_EMAIL

    });

    if (!systemUser) {

        throw new Error(

            "System user not found."

        );

    }

    const now = new Date();

    const start = new Date(now);

    start.setHours(0,0,0,0);

    const end = new Date(now);

    end.setHours(23,59,59,999);

    return generateReport(

        {

            siteId,

            reportType: "DAILY",

            periodStart: start,

            periodEnd: end

        },

        systemUser

    );

}

export default {

    buildReport,

    generateReport,

    generateDailyReports,

    getReports,

    getReportById,

    downloadReport,

    deleteReport

};