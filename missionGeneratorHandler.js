const {app} = require('./droneServer.js');
const missionGenerator = require("./missionGenerator");

module.exports.init = function initMissionsGeneratorPaths() {
app.post("/api/v1/drone/missionGeneratorPolygonZigZagOverfly",(req,res)=>{
    if(req.body.jsonpolygon!=null){
        try {
            const polygon = JSON.parse(req.body.jsonpolygon);
            res.json(missionGenerator.createZigZagRoute(polygon));

        }catch (e) {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');

        }
    }else{
        res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
    }
})
}