const session = require("sessionlib/session");
const drone = require("./drone");
const {app} = require('./droneServer.js');

module.exports.init = function initDronePaths() {


    app.post('/api/v1/drone/mission/createMission', (req, res) => {

        if (req.body.session != null && req.body.name != null) {
            if (req.body.name.toString().length < 4 && req.body.name.toString().length > 49) {
                res.send(`{"success":false,"error":"String too long"}`);
                return;
            }
            session.validateSession(req.body.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.body.session);
                    session.getUserUUID(req.body.session.toString(), (uuid) => {

                        if (uuid) {

                            drone.addDroneMission(uuid, req.body.name.toString(), req.body.data).then(missionUUID => {
                                res.send(JSON.stringify({
                                    success: true,
                                    uuid: missionUUID
                                }));
                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');
                        }
                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });

    app.get('/api/v1/drone/mission/listMissions', (req, res) => {

        if (req.query.session != null) {
            session.validateSession(req.query.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.query.session);
                    session.getUserUUID(req.query.session.toString(), (uuid) => {
                        if (uuid) {


                            drone.getAllUserMissions(uuid).then(results => {

                                res.send(JSON.stringify({
                                    success: true,
                                    missions: results
                                }));

                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');

                        }

                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });


    app.get('/api/v1/drone/mission/getMissionData', (req, res) => {

        if (req.query.session != null && req.query.missionUUID != null) {
            session.validateSession(req.query.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.query.session);
                    session.getUserUUID(req.query.session.toString(), (uuid) => {
                        if (uuid) {


                            drone.getDroneMissionData(uuid, req.query.missionUUID.toString()).then(results => {

                                res.send(JSON.stringify({
                                    success: true,
                                    mission: results
                                }));

                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');

                        }

                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });

    app.get('/api/v1/drone/mission/deleteDroneMission', (req, res) => {

        if (req.query.session != null && req.query.missionUUID != null) {
            session.validateSession(req.query.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.query.session);
                    session.getUserUUID(req.query.session.toString(), (uuid) => {
                        if (uuid) {


                            drone.deleteMission(uuid, req.query.missionUUID.toString()).then(results => {
                                if (results) {
                                    res.send(JSON.stringify({
                                        success: true
                                    }));
                                } else {
                                    res.send(JSON.stringify({
                                        success: false
                                    }));
                                }


                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');

                        }

                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });

    app.post('/api/v1/drone/mission/saveMissionData', (req, res) => {

        if (req.body.session != null && req.body.missionUUID != null && req.body.data != null) {
            session.validateSession(req.body.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.body.session);
                    session.getUserUUID(req.body.session.toString(), (uuid) => {
                        if (uuid) {

                            console.log(typeof req.body.data);
                            drone.saveMissionData(uuid, req.body.missionUUID.toString(), req.body.data).then(results => {

                                res.send(JSON.stringify({
                                    success: true
                                }));

                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');

                        }

                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });

    app.post('/api/v1/drone/mission/renameDroneMission', (req, res) => {

        if (req.body.session != null && req.body.newMissionName != null && req.body.missionUUID != null) {
            if (req.body.newMissionName.toString().length < 4 && req.body.newMissionName.toString().length > 49) {
                res.send(`{"success":false,"error":"String too long"}`);
                return;
            }
            session.validateSession(req.body.session.toString(), (isValid) => {
                if (isValid) {
                    session.reactivateSession(req.body.session);
                    session.getUserUUID(req.body.session.toString(), (uuid) => {
                        if (uuid) {


                            drone.renameMission(uuid, req.body.missionUUID.toString(), req.body.newMissionName.toString()).then(results => {

                                res.send(JSON.stringify({
                                    success: true
                                }));

                            });


                        } else {
                            res.send('{\"error\":\"No valid account!\",\"errorcode\":\"006\"}');

                        }

                    });

                } else {
                    res.send('{\"error\":\"No valid session!\",\"errorcode\":\"006\"}');

                }
            });
        } else {
            res.send('{\"error\":\"No valid inputs!\",\"errorcode\":\"002\"}');
        }

    });

    /**
     * Create a new mission
     */
    app.post('/api/v2/drone/missions', (req, res) => {

        if (req.body.name != null) {
            if (req.body.name.toString().length < 4 && req.body.name.toString().length > 49) {
                res.status(400).json({success: false, error: "String too long"});
                return;
            }

            session.transformSecurelySessionToUserUUID(res, req).then(uuid => {
                if (uuid != null) {
                    drone.addDroneMission(uuid, req.body.name.toString(), req.body.data).then(missionUUID => {
                        res.status(201).json({
                            uuid: missionUUID
                        });
                    });
                }
            });


        } else {
            res.status(400).json({error: "No valid inputs!", errorcode: "002"});
        }

    });

    app.get('/api/v2/drone/missions', (req, res) => {

        session.transformSecurelySessionToUserUUID(res, req).then((uuid) => {
            if (uuid != null) {
                drone.getAllUserMissions(uuid).then(results => {

                    res.status(200).send(JSON.stringify({
                        missions: results
                    }));

                });

            }
        });


    });


    app.get('/api/v2/drone/missions/:mission', (req, res) => {

        session.transformSecurelySessionToUserUUID(req, req).then(uuid => {
            if (uuid != null) {
                drone.getDroneMissionData(uuid, req.params.mission).then(results => {

                    if (results != null) {
                        res.status(200).json({
                            mission: results
                        });

                    } else {
                        res.status(404).end();
                    }


                });

            }
        });


    });

    app.delete('/api/v2/drone/missions/:mission', (req, res) => {


        session.transformSecurelySessionToUserUUID(res, req).then(uuid => {
            if (uuid != null) {

                drone.deleteMission(uuid, req.params.mission).then(results => {
                    if (results) {
                        res.status(204).end();
                    } else {
                        res.status(404).json({error: "Content not found", errorcode: "015"});
                    }

                });
            }
        });


    });

    app.put('/api/v2/drone/missions/:mission', (req, res) => {

        session.transformSecurelySessionToUserUUID(res, req).then(uuid => {
            if (uuid != null) {
                drone.saveMissionData(uuid, req.params.mission, req.body.data).then(results => {

                    res.status(204).end();
                });

            }
        });


    });

    app.patch('/api/v2/drone/missions/:mission', (req, res) => {

        if (req.body.newMissionName != null) {
            if (req.body.newMissionName.toString().length < 4 && req.body.newMissionName.toString().length > 49) {
                res.status(400).json({success: false, error: "String too long"});
                return;
            }


            session.transformSecurelySessionToUserUUID(req, req).then(uuid => {
                if(uuid!=null) {
                    drone.renameMission(uuid, req.params.mission.toString(), req.body.newMissionName.toString()).then(results => {

                        res.status(204).end();
                    });
                }
            });


        } else {
            res.status(400).json({error: "No valid inputs!", errorcode: "002"});
        }

    });


};
