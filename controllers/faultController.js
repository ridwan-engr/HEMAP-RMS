import asyncHandler from "../utils/asyncHandler.js";
import * as faultService from "../services/faults/faultService.js";

/*
|--------------------------------------------------------------------------
| Fault List
|--------------------------------------------------------------------------
*/

export const getFaults = asyncHandler(async (req, res) => {
    const faults = await faultService.getFaults(req.query);

    return res.status(200).json({
        success: true,
        message: "Faults retrieved successfully.",
        data: faults
    });
});

/*
|--------------------------------------------------------------------------
| Fault Details
|--------------------------------------------------------------------------
*/

export const getFaultById = asyncHandler(async (req, res) => {
    const fault = await faultService.getFaultById(req.params.faultId);

    return res.status(200).json({
        success: true,
        message: "Fault retrieved successfully.",
        data: fault
    });
});

/*
|--------------------------------------------------------------------------
| Create Fault
|--------------------------------------------------------------------------
*/

export const createFault = asyncHandler(async (req, res) => {
    const fault = await faultService.createFault(req.body, req.user);

    return res.status(201).json({
        success: true,
        message: "Fault created successfully.",
        data: fault
    });
});

/*
|--------------------------------------------------------------------------
| Update Fault
|--------------------------------------------------------------------------
*/

export const updateFault = asyncHandler(async (req, res) => {
    const fault = await faultService.updateFault(
        req.params.faultId,
        req.body,
        req.user
    );

    return res.status(200).json({
        success: true,
        message: "Fault updated successfully.",
        data: fault
    });
});

/*
|--------------------------------------------------------------------------
| Resolve Fault
|--------------------------------------------------------------------------
*/

export const resolveFault = asyncHandler(async (req, res) => {
    const fault = await faultService.resolveFault(
        req.params.faultId,
        req.body,
        req.user
    );

    return res.status(200).json({
        success: true,
        message: "Fault resolved successfully.",
        data: fault
    });
});

/*
|--------------------------------------------------------------------------
| Delete Fault
|--------------------------------------------------------------------------
*/

export const deleteFault = asyncHandler(async (req, res) => {
    await faultService.deleteFault(req.params.faultId);

    return res.status(200).json({
        success: true,
        message: "Fault deleted successfully."
    });
});

export default {

    getFaults,

    getFaultById,

    createFault,

    updateFault,

    resolveFault,

    deleteFault

};