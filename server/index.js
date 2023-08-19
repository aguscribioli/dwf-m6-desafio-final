"use strict";
exports.__esModule = true;
var express = require("express");
var database_1 = require("./database");
var nanoid_1 = require("nanoid");
var cors = require("cors");
var path = require("path");
var app = express();
app.use(cors());
app.use(express.json());
var port = 3000;
var usersCollection = database_1.firestore.collection('users');
var roomsCollection = database_1.firestore.collection('rooms');
app.post('/sign-in', function (req, res) {
    // const dni = req.body.dni;
    var dni = req.body.dni;
    usersCollection.where('dni', '==', dni).get().then(function (searchResponse) {
        if (searchResponse.empty) {
            usersCollection.add({
                dni: dni
            }).then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.post('/sign-up', function (req, res) {
    // const dni = req.body.dni;
    var dni = req.body.dni;
    usersCollection.where('dni', '==', dni).get().then(function (searchResponse) {
        if (searchResponse.empty) {
            usersCollection.add({
                dni: dni
            }).then(function (newUserRef) {
                res.json({
                    id: newUserRef.id,
                    "new": true
                });
            });
        }
        else {
            res.json({
                id: searchResponse.docs[0].id
            });
        }
    });
});
app.post('/rooms', function (req, res) {
    var userId = req.body.userId;
    var userDni = req.body.userDni;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var roomRef_1 = database_1.rtdb.ref('rooms/' + (0, nanoid_1.nanoid)());
            roomRef_1.set({
                owner: userId,
                currentGame: {
                    playerOne: {
                        dni: userDni,
                        id: userId,
                        online: true,
                        readyToPlay: false,
                        currentChoice: ''
                    },
                    playerTwo: {
                        dni: '',
                        id: '',
                        online: false,
                        readyToPlay: false,
                        currentChoice: ''
                    },
                    currentResult: ""
                },
                historyScore: {
                    playerOne: 0,
                    playerTwo: 0
                }
            }).then(function () {
                var roomPrivateId = roomRef_1.key;
                var roomPublicId = Math.floor((Math.random() * (9999 - 1000 + 1)) + 1000);
                roomsCollection.doc(roomPublicId.toString()).set({
                    rtdbRoomId: roomPrivateId
                }).then(function () {
                    res.json({
                        id: roomPublicId.toString(),
                        roomPrivateId: roomPrivateId.toString()
                    });
                });
            });
        }
        else {
            res.status(401).json({
                message: 'El usuario no existe.'
            });
        }
        ;
    });
});
app.get('/rooms/:roomId', function (req, res) {
    var userId = req.query.userId;
    var userDni = req.query.userDni;
    var roomId = req.params.roomId;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            roomsCollection.doc(roomId).get().then(function (snap) {
                var data = snap.data();
                if (data) {
                    var rtdbRoomRef_1 = database_1.rtdb.ref('rooms/' + data.rtdbRoomId);
                    rtdbRoomRef_1.get().then(function (snap) {
                        var roomData = snap.val();
                        var playerOneId = roomData.currentGame.playerOne.id;
                        var playerTwoId = roomData.currentGame.playerTwo.id;
                        if (playerTwoId == '' || userId == playerOneId || userId == playerTwoId) {
                            if (userDni == roomData.currentGame.playerOne.dni) {
                                rtdbRoomRef_1.child('currentGame').child('playerOne').update({
                                    online: true
                                });
                            }
                            else {
                                rtdbRoomRef_1.child('currentGame').child('playerTwo').update({
                                    dni: userDni,
                                    id: userId,
                                    online: true
                                });
                            }
                            res.json(data);
                        }
                        else {
                            res.status(401).json({
                                error: true,
                                message: 'La sala está llena. Por favor, generá otro código.'
                            });
                        }
                    });
                }
                else {
                    res.status(401).json({
                        error: true,
                        message: 'El usuario no existe.'
                    });
                }
            });
        }
        ;
    });
});
app.patch('/rooms/status', function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    var player = req.body.player;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var data = { player: player, status: true };
            var rtdbRoomRef = database_1.rtdb.ref('rooms/' + roomId);
            rtdbRoomRef.child('currentGame').child(player).update({
                readyToPlay: true
            });
            res.json(data);
        }
        else {
            res.status(401).json({
                error: true,
                message: 'El usuario no existe.'
            });
        }
    });
});
app.patch('/rooms/choice', function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    var player = req.body.player;
    var choice = req.body.choice;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var data = { player: player, choice: choice };
            var rtdbRoomRef = database_1.rtdb.ref('rooms/' + roomId);
            rtdbRoomRef.child('currentGame').child(player).update({
                choice: choice
            });
            res.json(data);
        }
        else {
            res.status(401).json({
                error: true,
                message: 'El usuario no existe.'
            });
        }
    });
});
app.patch('/rooms/history', function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    var result = req.body.result;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var rtdbRoomRef_2 = database_1.rtdb.ref('rooms/' + roomId);
            var currentHistory_1;
            rtdbRoomRef_2.get().then(function (snap) {
                if (snap.exists) {
                    currentHistory_1 = snap.val().historyScore;
                    if (result == 'playerOne') {
                        currentHistory_1.playerOne = currentHistory_1.playerOne + 1;
                        rtdbRoomRef_2.child('historyScore').update({
                            playerOne: currentHistory_1.playerOne,
                            result: 'playerOne'
                        });
                    }
                    else if (result == 'playerTwo') {
                        currentHistory_1.playerTwo = currentHistory_1.playerTwo + 1;
                        rtdbRoomRef_2.child('historyScore').update({
                            playerTwo: currentHistory_1.playerTwo,
                            result: 'playerTwo'
                        });
                    }
                    else {
                        rtdbRoomRef_2.child('historyScore').update({
                            result: 'empate'
                        });
                    }
                    res.json(currentHistory_1);
                }
            });
        }
        else {
            res.status(401).json({
                message: 'El usuario no existe.'
            });
        }
    });
});
app.patch('/rooms/logout', function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    var player = req.body.player;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var data = { player: player, currentChoice: '', online: false, readyToPlay: false };
            var rtdbRoomRef = database_1.rtdb.ref('rooms/' + roomId);
            rtdbRoomRef.child('currentGame').child(player).update({
                online: false,
                readyToPlay: false,
                currentChoice: ''
            });
            res.json(data);
        }
        else {
            res.status(401).json({
                message: 'El usuario no existe.'
            });
        }
    });
});
app.patch('/rooms/reset', function (req, res) {
    var userId = req.body.userId;
    var roomId = req.body.roomId;
    var player = req.body.player;
    var choice = req.body.choice;
    usersCollection.doc(userId.toString()).get().then(function (doc) {
        if (doc.exists) {
            var data = { player: player, choice: choice };
            var rtdbRoomRef = database_1.rtdb.ref('rooms/' + roomId);
            rtdbRoomRef.child('currentGame').child(player).update({
                readyToPlay: false,
                currentChoice: ''
            });
            rtdbRoomRef.child('historyScore').update({
                currentResult: ''
            });
            res.json(data);
        }
        else {
            res.status(401).json({
                message: 'El usuario no existe.'
            });
        }
    });
});
app.use(express.static(path.join(__dirname, "../dist")));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.listen(port, function () {
    console.log("Iniciado en http://localhost:".concat(port));
});
