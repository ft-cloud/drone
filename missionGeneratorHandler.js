const {app} = require('./droneServer.js');
const missionGenerator = require("./missionGenerator");

module.exports.init = function initMissionsGeneratorPaths() {
app.post("/api/v1/drone/missionGeneratorPolygonZigZagOverfly",(req,res)=>{
    if(req.body.jsonpolygon!=null){
        try {
            const polygon = req.body.jsonpolygon;
            res.json({route:missionGenerator.createZigZagRoute(polygon),success:true});

        }catch (e) {
            res.send('{\"error\":\"Felix hat einen Fehler in seinem Routenplaner gemacht!\",\"errorcode\":\"002\"}');
console.log(e);
        }
    }else{
        res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
    }
})
}