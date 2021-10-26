const uuid = require('uuid');
const axios = require('axios');

const drone = {

    addDroneMission: function (user, name, data) {
        return new Promise((resolve => {
            const droneMission = global.database.collection("droneMission");
            const missionUUID = uuid.v4();

            droneMission.insertOne({
                uuid: missionUUID,
                name: name,
                user: user,
                data: (data !== undefined ? data : {})
            }).then(() => {
                resolve(missionUUID);
            });

        }));


    },
    getAllUserMissions: function (user) {
        return new Promise((resolve, reject) => {

            const droneMission = global.database.collection("droneMission");
            const cursor = droneMission.find({user: user}).project({_id: 0, uuid: 1, name: 1, user: 1});
            cursor.toArray().then(missions => {
                resolve(missions);
            });

        });
    },


    getDroneMissionData: function (user, missionUUID) {


        return new Promise((resolve, reject) => {


            const droneMission = global.database.collection("droneMission");
            droneMission.findOne({
                user: user,
                uuid: missionUUID
            },{projection:{_id:0}}).then((mission) => {
                if (mission !== null) {
                    resolve(mission);
                } else {
                    axios("http://account:3000/api/v1/account/isUserAdmin?uuid=" + user).then(parsed => {
                        if (parsed.data.isAdmin) {
                            droneMission.findOne({
                                uuid: missionUUID
                            },{projection:{_id:0}}).then((adminMission) => {
                                if (adminMission !== null) {
                                    resolve(adminMission);
                                } else {
                                    resolve(undefined);
                                }

                            });
                        } else {
                            resolve(undefined);
                        }

                    });

                }
            });
        });
    },
    saveMissionData: function (user, missionUUID, data) {
        return new Promise((resolve, reject) => {
            const droneMission = global.database.collection("droneMission");
            droneMission.updateOne({user: user, uuid: missionUUID}, {$set: {data: data}}).then((res) => {
                if (res.matchedCount === 0) {
                    axios("http://account:3000/api/v1/account/isUserAdmin?uuid=" + user).then(parsed => {
                        if (parsed.data.isAdmin) {
                            droneMission.updateOne({uuid: missionUUID}, {$set: {data: data}}).then(() => {
                                resolve(true);
                            });
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(true);
                }
            });

        });
    },
    deleteMission: function (user, missionUUID) {
        return new Promise((resolve, reject) => {
            this.getDroneMissionData(user, missionUUID).then(check => {
                if (check!=null) {
                    const droneMission = global.database.collection("droneMission");
                    droneMission.deleteOne({uuid: missionUUID}).then(() => {
                        resolve(true);
                    });

                } else {
                    resolve(false);

                }
            });
        });

    },

    renameMission: function (user, missionUUID, newName) {
        return new Promise((resolve, reject) => {

            const droneMission = global.database.collection("droneMission");
            droneMission.updateOne({user: user, uuid: missionUUID}, {$set: {name: newName}}).then((res) => {
                if (res.matchedCount === 0) {
                    axios("http://account:3000/api/v1/account/isUserAdmin?uuid=" + user).then(parsed => {
                        if (parsed.data.isAdmin) {
                            droneMission.updateOne({uuid: missionUUID}, {$set: {name: newName}}).then((res) => {
                                resolve(true);
                            });
                        } else {
                            resolve(false);
                        }
                    });
                } else {
                    resolve(true);
                }
            });


        });

    }

};

module.exports = drone;


