import Installation from "../../models/Installation.js";
import Site from "../../models/Site.js";
import Device from "../../models/Device.js";
import Battery from "../../models/Battery.js";
import Generator from "../../models/Generator.js";
import Solar from "../../models/Solar.js";
import Grid from "../../models/Grid.js";

export async function getDashboardStatistics() {

    const [

        installations,

        sites,

        devices,

        batteries,

        generators,

        solar,

        grids

    ] = await Promise.all([

        Installation.countDocuments(),

        Site.countDocuments(),

        Device.countDocuments(),

        Battery.countDocuments(),

        Generator.countDocuments(),

        Solar.countDocuments(),

        Grid.countDocuments()

    ]);

    return {

        installations,

        sites,

        devices,

        batteries,

        generators,

        solar,

        grids

    };

}

export default {

    getDashboardStatistics

};