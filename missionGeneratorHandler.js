const {app} = require('./droneServer.js');
const missionGenerator = require("./missionGenerator");

module.exports.init = function initMissionsGeneratorPaths() {
    app.post("/api/v1/drone/missionGeneratorPolygonZigZagOverfly", (req, res) => {
        if (req.body.jsonpolygon != null) {
                const polygon = req.body.jsonpolygon;

                missionGenerator.createZigZagRoute(polygon).then(route => {
                    res.json({route: route, success: true});
                });

        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }
    });
};