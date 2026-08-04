import fs from "fs/promises";
import path from "path";
import ExcelJS from "exceljs";

const REPORT_DIRECTORY = path.resolve(
    "storage",
    "reports"
);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

async function ensureDirectory() {

    await fs.mkdir(REPORT_DIRECTORY, {
        recursive: true
    });

}

function addTitle(sheet, title) {

    sheet.mergeCells("A1:B1");

    const cell = sheet.getCell("A1");

    cell.value = title;

    cell.font = {
        bold: true,
        size: 18
    };

}

function addObject(sheet, data = {}) {

    sheet.columns = [

        {
            header: "Parameter",
            key: "parameter",
            width: 35
        },

        {
            header: "Value",
            key: "value",
            width: 30
        }

    ];

    Object.entries(data).forEach(([key, value]) => {

        if (
            value !== null &&
            typeof value !== "object"
        ) {

            sheet.addRow({

                parameter: key,

                value

            });

        }

    });

}

function addArray(sheet, rows = []) {

    if (!rows.length) {

        sheet.addRow({
            message: "No Data"
        });

        return;

    }

    sheet.columns = Object.keys(rows[0]).map(key => ({

        header: key,

        key,

        width: 25

    }));

    rows.forEach(row => {

        sheet.addRow(row);

    });

}

/*
|--------------------------------------------------------------------------
| Generate Excel Report
|--------------------------------------------------------------------------
*/

export async function generateExcel(

    reportData

) {

    await ensureDirectory();

    const workbook = new ExcelJS.Workbook();

    workbook.creator = "HEMAP RMS";

    workbook.created = new Date();

    /*
    |--------------------------------------------------------------------------
    | Executive Summary
    |--------------------------------------------------------------------------
    */

    let sheet = workbook.addWorksheet(
        "Executive Summary"
    );

    addTitle(
        sheet,
        "Executive Summary"
    );

    addObject(
        sheet,
        reportData.dashboard
    );

    /*
    |--------------------------------------------------------------------------
    | KPIs
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "KPIs"
    );

    addTitle(
        sheet,
        "KPIs"
    );

    addObject(
        sheet,
        reportData.kpis
    );

    /*
    |--------------------------------------------------------------------------
    | Energy
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Energy"
    );

    addTitle(
        sheet,
        "Energy Statistics"
    );

    addObject(
        sheet,
        reportData.energy
    );

    /*
    |--------------------------------------------------------------------------
    | Battery
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Battery"
    );

    addTitle(
        sheet,
        "Battery Statistics"
    );

    addObject(
        sheet,
        reportData.battery
    );

    /*
    |--------------------------------------------------------------------------
    | Solar
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Solar"
    );

    addTitle(
        sheet,
        "Solar Statistics"
    );

    addObject(
        sheet,
        reportData.solar
    );

    /*
    |--------------------------------------------------------------------------
    | Grid
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Grid"
    );

    addTitle(
        sheet,
        "Grid Statistics"
    );

    addObject(
        sheet,
        reportData.grid
    );

    /*
    |--------------------------------------------------------------------------
    | Generator
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Generator"
    );

    addTitle(
        sheet,
        "Generator Statistics"
    );

    addObject(
        sheet,
        reportData.generator
    );

    /*
    |--------------------------------------------------------------------------
    | Reliability
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Reliability"
    );

    addTitle(
        sheet,
        "Reliability"
    );

    addObject(
        sheet,
        reportData.reliability
    );

    /*
    |--------------------------------------------------------------------------
    | Forecast
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Forecast"
    );

    addTitle(
        sheet,
        "Forecast"
    );

    addObject(
        sheet,
        reportData.forecast
    );

    /*
    |--------------------------------------------------------------------------
    | Optimization
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Optimization"
    );

    addTitle(
        sheet,
        "Optimization"
    );

    addObject(
        sheet,
        reportData.optimization
    );

    /*
    |--------------------------------------------------------------------------
    | Weather
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Weather"
    );

    addTitle(
        sheet,
        "Weather"
    );

    addObject(
        sheet,
        reportData.weather
    );

    /*
    |--------------------------------------------------------------------------
    | Alarms
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Alarms"
    );

    addTitle(
        sheet,
        "Active Alarms"
    );

    addArray(
        sheet,
        reportData.alarms?.records ?? []
    );

    /*
    |--------------------------------------------------------------------------
    | AI Insights
    |--------------------------------------------------------------------------
    */

    sheet = workbook.addWorksheet(
        "Insights"
    );

    addTitle(
        sheet,
        "AI Insights"
    );

    const insights =
        reportData.insights ?? [];

    if (Array.isArray(insights)) {

        insights.forEach(item => {

            sheet.addRow({

                Insight: item

            });

        });

    }

    /*
    |--------------------------------------------------------------------------
    | Charts (Future)
    |--------------------------------------------------------------------------
    */

    workbook.addWorksheet(
        "Charts"
    );

    /*
    |--------------------------------------------------------------------------
    | Save
    |--------------------------------------------------------------------------
    */

    const filename =
        `report-${Date.now()}.xlsx`;

    const filePath = path.join(
        REPORT_DIRECTORY,
        filename
    );

    await workbook.xlsx.writeFile(
        filePath
    );

    return {

        filename,

        filePath

    };

}

export default {

    generateExcel

};