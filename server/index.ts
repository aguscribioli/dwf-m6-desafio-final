import * as express from "express";
import { firestore , rtdb } from "./database";
import { nanoid } from 'nanoid';
import * as cors from "cors";
import * as path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
const port = 3000;

const usersCollection = firestore.collection('users');
const roomsCollection = firestore.collection('rooms');

app.post('/sign-in', (req, res) => {
  // const dni = req.body.dni;
  const { dni } = req.body;

  usersCollection.where('dni', '==', dni).get().then((searchResponse) => {
    if (searchResponse.empty) {
      usersCollection.add({
        dni
      }).then((newUserRef) => {
        res.json({
          id: newUserRef.id,
          new: true,
        })
      })
    } else {
      res.json({
        id: searchResponse.docs[0].id,
      })
    }
  })
});

app.post('/sign-up', (req, res) => {
  // const dni = req.body.dni;
  const { dni } = req.body;

  usersCollection.where('dni', '==', dni).get().then((searchResponse) => {
    if (searchResponse.empty) {
      usersCollection.add({
        dni
      }).then((newUserRef) => {
        res.json({
          id: newUserRef.id,
          new: true,
        })
      })
    } else {
      res.json({
        id: searchResponse.docs[0].id,
      })
    }
  })
});

app.post('/rooms', (req, res) => {
  const { userId } = req.body;
  const { userDni } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      const roomRef = rtdb.ref('rooms/' + nanoid());

      roomRef.set({
        owner: userId,
        currentGame: {
          playerOne: {
            dni: userDni,
            id: userId,
            online: true,
            readyToPlay: false,
            currentChoice: '',
          },
          playerTwo: {
            dni: '',
            id: '',
            online: false,
            readyToPlay: false,
            currentChoice: '',
          },
          currentResult: "",
        },
        historyScore: {
          playerOne: 0,
          playerTwo: 0,
        }
      }).then(() => {
        const roomPrivateId = roomRef.key;
        const roomPublicId = Math.floor((Math.random() * (9999 - 1000 + 1)) + 1000);

        roomsCollection.doc(roomPublicId.toString()).set({
          rtdbRoomId: roomPrivateId,
        }).then(() => {
          res.json({
            id: roomPublicId.toString(),
            roomPrivateId: roomPrivateId.toString(),
          });
        });
      });
    } else {
      res.status(401).json({
        message: 'El usuario no existe.',
      })
    };
  });
});

app.get('/rooms/:roomId', (req, res) => {
  const { userId } = req.query;
  const { userDni } = req.query;
  const { roomId } = req.params;
  
  usersCollection.doc(userId!.toString()).get().then(doc => {
    if (doc.exists) {
      roomsCollection.doc(roomId).get().then(snap => {
        const data = snap.data();
        console.log(data);
        
        
        if (data) {
          let rtdbRoomRef = rtdb.ref('rooms/' + data.rtdbRoomId);
          rtdbRoomRef.get().then(snap => {
            let roomData = snap.val();
            let playerOneId = roomData.currentGame.playerOne.id;
            let playerTwoId = roomData.currentGame.playerTwo.id;

            if (playerTwoId == '' || userId == playerOneId || userId == playerTwoId) {
              if (userDni == roomData.currentGame.playerOne.dni) {
                rtdbRoomRef.child('currentGame').child('playerOne').update({
                  online: true,
                });
              } else {
                rtdbRoomRef.child('currentGame').child('playerTwo').update({
                  dni: userDni,
                  id: userId,
                  online: true,
                });
              }
              res.json(data);
            } else {
              res.status(401).json({
                error: true,
                message: 'La sala está llena. Por favor, generá otro código.',
              });
            }
          });
        } else {
          res.status(401).json({
            error: true,
            message: 'El usuario no existe.',
          });
        }
      });
    };
  });
});

app.patch('/rooms/status', (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { player } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      let data = { player: player, status: true};
      let rtdbRoomRef = rtdb.ref('rooms/' + roomId);

      rtdbRoomRef.child('currentGame').child(player).update({
        readyToPlay: true,
      });
      res.json(data);
    } else {
      res.status(401).json({
        error: true,
        message: 'El usuario no existe.',
      });
    }
  });
});

app.patch('/rooms/choice', (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { player } = req.body;
  const { choice } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      let data = { player, choice };
      let rtdbRoomRef = rtdb.ref('rooms/' + roomId);

      rtdbRoomRef.child('currentGame').child(player).update({
        choice,
      });
      res.json(data);
    } else {
      res.status(401).json({
        error: true,
        message: 'El usuario no existe.',
      });
    }
  });
});

app.patch('/rooms/history', (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { result } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      let rtdbRoomRef = rtdb.ref('rooms/' + roomId);
      let currentHistory;

      rtdbRoomRef.get().then(snap => {
        if (snap.exists) {
          currentHistory = snap.val().historyScore;

          if (result == 'playerOne') {
            currentHistory.playerOne = currentHistory.playerOne + 1;
            rtdbRoomRef.child('historyScore').update({
              playerOne: currentHistory.playerOne,
              result: 'playerOne',
            });
          } else if (result == 'playerTwo') {
            currentHistory.playerTwo = currentHistory.playerTwo + 1;
            rtdbRoomRef.child('historyScore').update({
              playerTwo: currentHistory.playerTwo,
              result: 'playerTwo',
            });
          } else {
            rtdbRoomRef.child('historyScore').update({
              result: 'empate',
            });
          }
          res.json(currentHistory);
        }
      });
    } else {
      res.status(401).json({
        message: 'El usuario no existe.',
      });
    }
  });
});

app.patch('/rooms/logout', (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { player } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      let data = { player, currentChoice: '', online: false, readyToPlay: false };
      let rtdbRoomRef = rtdb.ref('rooms/' + roomId);

      rtdbRoomRef.child('currentGame').child(player).update({
        online: false,
        readyToPlay: false,
        currentChoice: '',
      });
      res.json(data);
    } else {
      res.status(401).json({
        message: 'El usuario no existe.',
      });
    }
  });
});

app.patch('/rooms/reset', (req, res) => {
  const { userId } = req.body;
  const { roomId } = req.body;
  const { player } = req.body;
  const { choice } = req.body;

  usersCollection.doc(userId.toString()).get().then(doc => {
    if (doc.exists) {
      let data = { player, choice};
      let rtdbRoomRef = rtdb.ref('rooms/' + roomId);

      rtdbRoomRef.child('currentGame').child(player).update({
        readyToPlay: false,
        currentChoice: '',
      });
      rtdbRoomRef.child('historyScore').update({
        currentResult: '',
      });
      res.json(data);
    } else {
      res.status(401).json({
        message: 'El usuario no existe.',
      });
    }
  });
});

app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Iniciado en http://localhost:${port}`);
});