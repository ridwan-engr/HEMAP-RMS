import mongoose from "mongoose";

/*
|--------------------------------------------------------------------------
| Dispatch Schedule
|--------------------------------------------------------------------------
*/

const dispatchSchema = new mongoose.Schema(
{
    time: {
        type: Number,
        required: true
    },

    timestamp: Date,

    load: {
        type: Number,
        default: 0
    },

    solarUsed: {
        type: Number,
        default: 0
    },

    generatorPower: {
        type: Number,
        default: 0
    },

    gridImport: {
        type: Number,
        default: 0
    },

    gridExport: {
        type: Number,
        default: 0
    },

    batteryCharge: {
        type: Number,
        default: 0
    },

    batteryDischarge: {
        type: Number,
        default: 0
    },

    batterySOC: {
        type: Number,
        default: 0
    },

    generatorStatus: {
        type: Boolean,
        default: false
    }
},
{
    _id:false
});



/*
|--------------------------------------------------------------------------
| Energy Summary
|--------------------------------------------------------------------------
*/

const energySchema = new mongoose.Schema(
{

    load:Number,

    solar:Number,

    generator:Number,

    gridImport:Number,

    gridExport:Number,

    batteryCharge:Number,

    batteryDischarge:Number,

    renewableFraction:Number

},
{
    _id:false
});



/*
|--------------------------------------------------------------------------
| Economics
|--------------------------------------------------------------------------
*/

const economicsSchema = new mongoose.Schema(
{

    gridCost:Number,

    dieselCost:Number,

    batteryCost:Number,

    carbonCost:Number,

    exportRevenue:Number,

    operatingCost:Number,

    totalCost:Number,

    dieselLitres:Number

},
{
    _id:false
});



/*
|--------------------------------------------------------------------------
| Emissions
|--------------------------------------------------------------------------
*/

const emissionSchema = new mongoose.Schema(
{

    co2:Number,

    diesel:Number

},
{
    _id:false
});



/*
|--------------------------------------------------------------------------
| Reliability
|--------------------------------------------------------------------------
*/

const reliabilitySchema = new mongoose.Schema(
{

    ens:Number,

    eens:Number,

    lolp:Number,

    lole:Number,

    saidi:Number,

    saifi:Number,

    availability:Number,

    reliabilityIndex:Number

},
{
    _id:false
});



/*
|--------------------------------------------------------------------------
| Objectives
|--------------------------------------------------------------------------
*/

const objectiveSchema = new mongoose.Schema(
{

    totalCost:Number,

    gridCost:Number,

    dieselCost:Number,

    batteryCost:Number,

    carbonCost:Number,

    exportRevenue:Number,

    renewablePenalty:Number

},
{
    _id:false
});

/*
|--------------------------------------------------------------------------
| Solver
|--------------------------------------------------------------------------
*/

const solverSchema = new mongoose.Schema(
{
    name: {
        type: String,
        default: "highs"
    },

    status: {
        type: String,
        default: "UNKNOWN"
    },

    terminationCondition: String,

    solveTime: {
        type: Number,
        default: 0
    },

    iterations: {
        type: Number,
        default: 0
    },

    mipGap: {
        type: Number,
        default: 0
    },

    objectiveValue: {
        type: Number,
        default: 0
    }
},
{
    _id:false
});


/*
|--------------------------------------------------------------------------
| Optimization Inputs
|--------------------------------------------------------------------------
*/

const inputSchema = new mongoose.Schema(
{

    telemetry: {
        type: mongoose.Schema.Types.Mixed,
        default:[]
    },

    forecast: {
        type: mongoose.Schema.Types.Mixed,
        default:[]
    },

    tariff: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    },

    constraints: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    },

    objectives: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    },

    solver: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    },

    metadata: {
        type: mongoose.Schema.Types.Mixed,
        default:{}
    }

},
{
    _id:false
});


/*
|--------------------------------------------------------------------------
| Optimization Outputs
|--------------------------------------------------------------------------
*/

const outputSchema = new mongoose.Schema(
{

    dispatch: {
        type:[mongoose.Schema.Types.Mixed],
        default:[]
    },

    energy:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },

    economics:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },

    emissions:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },

    reliability:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },

    objectives:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    },

    solver:{
        type:mongoose.Schema.Types.Mixed,
        default:{}
    }

},
{
    _id:false
});


/*
|--------------------------------------------------------------------------
| Error Information
|--------------------------------------------------------------------------
*/

const errorSchema = new mongoose.Schema(
{

    message:String,

    stack:String,

    timestamp:Date

},
{
    _id:false
});


/*
|--------------------------------------------------------------------------
| Optimization Run
|--------------------------------------------------------------------------
*/

const optimizationRunSchema = new mongoose.Schema(
{

    site:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Site",
        required:true,
        index:true
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    requestId:{
        type:String,
        index:true
    },

    scenario:{
        type:String,
        enum:[
            "NORMAL",
            "GRID_OUTAGE",
            "PEAK_TARIFF",
            "LOW_SOLAR",
            "HIGH_LOAD",
            "CUSTOM"
        ],
        default:"NORMAL"
    },

    runType:{
        type:String,
        enum:[
            "MANUAL",
            "AUTO",
            "SCHEDULED"
        ],
        default:"MANUAL"
    },

    optimizationPeriod:{
        type:String,
        enum:[
            "HOURLY",
            "DAILY",
            "WEEKLY",
            "MONTHLY"
        ],
        default:"DAILY"
    },

    startDate:Date,

    endDate:Date,

    status:{
        type:String,
        enum:[
            "PENDING",
            "RUNNING",
            "COMPLETED",
            "FAILED",
            "CANCELLED"
        ],
        default:"PENDING",
        index:true
    },

    startedAt:Date,

    completedAt:Date,

    failedAt:Date,

    executionTime:{
        type:Number,
        default:0
    },

    inputs:inputSchema,

    outputs:outputSchema,

    rawSolverResponse:{
        type:mongoose.Schema.Types.Mixed
    },

    dispatchSchedule:[dispatchSchema],

    energy:energySchema,

    economics:economicsSchema,

    emissions:emissionSchema,

    reliability:reliabilitySchema,

    objectives:objectiveSchema,

    solver:solverSchema,

    error:errorSchema

},
{
    timestamps:true
});

/*
|--------------------------------------------------------------------------
| Indexes
|--------------------------------------------------------------------------
*/

optimizationRunSchema.index({
    site: 1,
    createdAt: -1
});

optimizationRunSchema.index({
    status: 1,
    createdAt: -1
});

optimizationRunSchema.index({
    scenario: 1,
    createdAt: -1
});

optimizationRunSchema.index({
    optimizationPeriod: 1
});

optimizationRunSchema.index({
    createdBy: 1
});

optimizationRunSchema.index({
    requestId: 1
});

optimizationRunSchema.index({
    "solver.status": 1
});

optimizationRunSchema.index({
    completedAt: -1
});


/*
|--------------------------------------------------------------------------
| Virtual Duration
|--------------------------------------------------------------------------
*/

optimizationRunSchema.virtual("durationSeconds").get(function () {

    if (!this.executionTime) {

        return 0;

    }

    return Number((this.executionTime / 1000).toFixed(2));

});


/*
|--------------------------------------------------------------------------
| Virtual Success
|--------------------------------------------------------------------------
*/

optimizationRunSchema.virtual("successful").get(function () {

    return this.status === "COMPLETED";

});


/*
|--------------------------------------------------------------------------
| Pre Save
|--------------------------------------------------------------------------
*/

optimizationRunSchema.pre("save", function (next) {

    if (
        this.status === "COMPLETED" &&
        !this.completedAt
    ) {

        this.completedAt = new Date();

    }

    if (
        this.status === "FAILED" &&
        !this.failedAt
    ) {

        this.failedAt = new Date();

    }

    next();

});


/*
|--------------------------------------------------------------------------
| Instance Methods
|--------------------------------------------------------------------------
*/

optimizationRunSchema.methods.markRunning = function () {

    this.status = "RUNNING";

    this.startedAt = new Date();

    return this.save();

};


optimizationRunSchema.methods.markCompleted = function (

    result,

    executionTime = 0

) {

    this.status = "COMPLETED";

    this.completedAt = new Date();

    this.executionTime = executionTime;

    this.outputs = result;

    this.dispatchSchedule = result.dispatch || [];

    this.energy = result.energy || {};

    this.economics = result.economics || {};

    this.emissions = result.emissions || {};

    this.reliability = result.reliability || {};

    this.objectives = result.objectives || {};

    this.solver = result.solver || {};

    return this.save();

};


optimizationRunSchema.methods.markFailed = function (

    error

) {

    this.status = "FAILED";

    this.failedAt = new Date();

    this.error = {

        message: error.message,

        stack: error.stack,

        timestamp: new Date()

    };

    return this.save();

};


/*
|--------------------------------------------------------------------------
| Static Methods
|--------------------------------------------------------------------------
*/

optimizationRunSchema.statics.latestForSite = function (

    siteId

) {

    return this.findOne({

        site: siteId

    })

    .sort({

        createdAt: -1

    });

};


optimizationRunSchema.statics.history = function (

    siteId,

    limit = 20

) {

    return this.find({

        site: siteId

    })

    .sort({

        createdAt: -1

    })

    .limit(limit);

};


/*
|--------------------------------------------------------------------------
| JSON Options
|--------------------------------------------------------------------------
*/

optimizationRunSchema.set("toJSON", {

    virtuals: true

});

optimizationRunSchema.set("toObject", {

    virtuals: true

});


/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

const OptimizationRun = mongoose.model(

    "OptimizationRun",

    optimizationRunSchema

);

export default OptimizationRun;