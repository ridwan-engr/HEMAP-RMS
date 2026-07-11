export function joinDashboard(socket) {

    socket.join("dashboard");

}

export function leaveDashboard(socket) {

    socket.leave("dashboard");

}

export function joinSiteRoom(socket, siteId) {

    socket.join(

        `site:${siteId}`

    );

}

export function leaveSiteRoom(socket, siteId) {

    socket.leave(

        `site:${siteId}`

    );

}

export default {

    joinDashboard,

    leaveDashboard,

    joinSiteRoom,

    leaveSiteRoom

};