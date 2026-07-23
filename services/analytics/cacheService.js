import Analytics from "../../models/Analytics.js";

/*
|--------------------------------------------------------------------------
| Get Cached Analytics
|--------------------------------------------------------------------------
*/

export async function getCachedAnalytics({

    site,

    period,

    startDate,

    endDate

}) {

    return Analytics.findOne({

        site,

        period,

        startDate,

        endDate

    })

    .populate("site", "name siteCode")

    .lean();

}

/*
|--------------------------------------------------------------------------
| Save Analytics
|--------------------------------------------------------------------------
*/

export async function saveAnalytics(data) {

    return Analytics.create(data);

}

/*
|--------------------------------------------------------------------------
| Update Analytics
|--------------------------------------------------------------------------
*/

export async function updateAnalytics(id, data) {

    return Analytics.findByIdAndUpdate(

        id,

        data,

        {

            new: true,

            runValidators: true

        }

    );

}

/*
|--------------------------------------------------------------------------
| Delete Cached Analytics
|--------------------------------------------------------------------------
*/

export async function deleteAnalytics({

    site,

    period,

    startDate,

    endDate

}) {

    return Analytics.deleteMany({

        site,

        period,

        startDate,

        endDate

    });

}

/*
|--------------------------------------------------------------------------
| Get Latest Analytics
|--------------------------------------------------------------------------
*/

export async function getLatestAnalytics(site) {

    return Analytics.findOne({

        site

    })

    .sort({

        generatedAt: -1

    })

    .lean();

}

/*
|--------------------------------------------------------------------------
| Get Analytics History
|--------------------------------------------------------------------------
*/

export async function getAnalyticsHistory(

    site,

    limit = 50

) {

    return Analytics.find({

        site

    })

    .sort({

        generatedAt: -1

    })

    .limit(limit)

    .lean();

}

/*
|--------------------------------------------------------------------------
| Cleanup Old Analytics
|--------------------------------------------------------------------------
|
| Removes records older than the specified number of days.
|
*/

export async function cleanupAnalytics(

    retentionDays = 365

) {

    const cutoff = new Date();

    cutoff.setDate(

        cutoff.getDate() - retentionDays

    );

    return Analytics.deleteMany({

        generatedAt: {

            $lt: cutoff

        }

    });

}

export default {

    getCachedAnalytics,

    saveAnalytics,

    updateAnalytics,

    deleteAnalytics,

    getLatestAnalytics,

    getAnalyticsHistory,

    cleanupAnalytics

};