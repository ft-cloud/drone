import {app} from "./droneServer.js";

import {MissionGenerator} from "./missionGenerator.js";

export function initMissionsGeneratorPaths() {
    app.post("/api/v1/drone/missionGeneratorPolygonZigZagOverfly", (req, res) => {
        if (req.body.jsonpolygon != null) {
                const polygon = req.body.jsonpolygon;
            try {
                MissionGenerator.createZigZagRoute(polygon).then(route => {
                    res.json({route: route, success: true});
                });

            }catch (e) {
                console.error(e);
            }

        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }
    });
};