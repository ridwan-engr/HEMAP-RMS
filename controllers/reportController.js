import asyncHandler from "../utils/asyncHandler.js";

import * as reportService from "../services/reports/reportService.js";

/*
|--------------------------------------------------------------------------
| Generate Report
|--------------------------------------------------------------------------
*/

export const generateReport = asyncHandler(async (req, res) => {

    const report = await reportService.generateReport(

        req.body,

        req.user

    );

    return res.status(201).json({

        success: true,

        message: "Report generated successfully.",

        data: report

    });

});

/*
|--------------------------------------------------------------------------
| Get Reports
|--------------------------------------------------------------------------
*/

export const getReports = asyncHandler(async (req, res) => {

    const reports = await reportService.getReports(

        req.query

    );

    return res.status(200).json({

        success: true,

        message: "Reports retrieved successfully.",

        data: reports

    });

});

/*
|--------------------------------------------------------------------------
| Get Report
|--------------------------------------------------------------------------
*/

export const getReportById = asyncHandler(async (req, res) => {

    const report = await reportService.getReportById(

        req.params.reportId

    );

    return res.status(200).json({

        success: true,

        message: "Report retrieved successfully.",

        data: report

    });

});

/*
|--------------------------------------------------------------------------
| Download Report
|--------------------------------------------------------------------------
*/

export const downloadReport = asyncHandler(async (req, res) => {

    const filePath = await reportService.downloadReport(

        req.params.reportId,

        req.query.format

    );

    return res.download(filePath);

});

/*
|--------------------------------------------------------------------------
| Delete Report
|--------------------------------------------------------------------------
*/

export const deleteReport = asyncHandler(async (req, res) => {

    await reportService.deleteReport(

        req.params.reportId

    );

    return res.status(200).json({

        success: true,

        message: "Report deleted successfully."

    });

});

export default {

    generateReport,

    getReports,

    getReportById,

    downloadReport,

    deleteReport

};