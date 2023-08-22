import { rtdb } from './rtdb';
import { ref, onValue } from 'firebase/database'

export type Jugada = "piedra" | "papel" | "tijera";
const imgWin = require("url:./images/result-won.png");
const imgLose = require("url:./images/result-lost.png");
const imgTie = require("url:./images/result-tie.png");

var API_BASE_URL = 'http://localhost:3000';
// if (process.env.ENVIRONMENT == 'dev') {
//     API_BASE_URL = 'http://localhost:3000';
// } else {
//     API_BASE_URL = 'https://desafio-final-m6.onrender.com';
// }

const state = {
    data: {
        userData: {
            dni: '',
            userId: '',
        },
        rtdbData: {
            roomPrivateId: '',
            roomPublicId: '',
            currentGame: {
                playerOne: {
                    dni: '',
                    id: '',
                    online: false,
                    readyToPlay: false,
                    currentChoice: '',
                },
                playerTwo: {
                    dni: '',
                    userId: '',
                    online: false,
                    readyToPlay: false,
                    currentChoice: '',
                },
            },
            historyScore: {
                playerOne: 0,
                playerTwo: 0,
                currentResult: "",
            }
        },
        error: false,
        message: '',
    },
    listeners: [],
    catchError(data) {
        const currentState = this.getState();
        currentState.rtdbData.error = true;
        currentState.rtdbData.message = data.message;
        this.setState(currentState);
    },
    getError() {
        const currentState = this.getState();
        return {
            error: currentState.rtdbData.error,
            message: currentState.rtdbData.message,
        }
    },
    getHistory() {
        const currentState = state.getState();
        return currentState.rtdbData.historyScore;
    },
    getPlayerOneChoice() {
        const currentState = this.getState();
        return currentState.rtdbData.currentGame.playerOne.currentChoice;
    },
    getPlayerTwoChoice() {
        const currentState = this.getState();
        return currentState.rtdbData.currentGame.playerTwo.currentChoice;
    },
    getPlayerOneDni() {
        const currentState = this.getState();
        return currentState.rtdbData.currentGame.playerOne.dni;
    },
    getPlayerTwoDni() {
        const currentState = this.getState();
        return currentState.rtdbData.currentGame.playerTwo.dni;
    },
    getPrivateId() {
        const currentState = this.getState();
        return currentState.rtdbData.roomPrivateId;
    },
    getPublicId() {
        const currentState = this.getState();
        return currentState.rtdbData.roomPublicId;
    },
    getState() {
        return this.data;
    },
    getUserDni() {
        const currentState = this.getState();
        return currentState.userData.dni;
    },
    getUserId() {
        const currentState = this.getState();
        return currentState.userData.userId;
    },
    init() {
        let localData;
        const storageData = localStorage.getItem('currentState');
        if (storageData) {
            localData = storageData;
            this.setState(JSON.parse(localData!));
        } else {
            localData = this.getState();
            this.setState(localData);
        }
    },
    isPlayerOne() {
        return this.getUserDni() == this.getPlayerOneDni();
    },
    playersAreOnline() {
        const currentState = this.getState();
        return (currentState.rtdbData.currentGame.playerOne.online && currentState.rtdbData.currentGame.playerTwo.online)
    },
    playersAreReadyToPlay() {
        const currentState = this.getState();
        return (currentState.rtdbData.currentGame.playerOne.readyToPlay && currentState.rtdbData.currentGame.playerTwo.readyToPlay)
    },
    playersChoseMove() {
        const currentState = this.getState();
        let playerOneMove: Jugada = currentState.rtdbData.currentGame.playerOne.currentChoice;
        let playerTwoMove: Jugada = currentState.rtdbData.currentGame.playerTwo.currentChoice;
        let res: Boolean = (
            playerOneMove == 'piedra' || playerOneMove == 'papel' || playerOneMove == 'tijera' &&
            playerTwoMove == 'piedra' || playerTwoMove == 'papel' || playerTwoMove == 'tijera'
        );
        return res;
    },
    playersStatusIsFalse() {
        const currentState = this.getState();
        let res: Boolean = false;
        if (
            currentState.rtdbData.currentGame.playerOne.readyToPlay == false &&
            currentState.rtdbData.currentGame.playerTwo.readyToPlay == false
        ) { res = true }
        return res;
    },
    resetError() {
        const currentState = this.getState;
        currentState.rtdbData.error = false;
        currentState.rtdbData.message = '';
        this.setState(currentState);
    },
    setFlags(player: string) {
        const currentState = this.getState();
        currentState.rtdbData.currentGame[player].readyToPlay = false,
        currentState.rtdbData.currentGame[player].currentChoice = '',
        this.setState(currentState);
    },
    setMove(player: string, move: Jugada) {
        const currentState = this.getState()
        currentState.rtdbData.currentGame[player].currentChoice = move;
        this.setState(currentState);
    },
    setPlayerReadyToPlay(player: string) {
        const currentState = this.getState();
        currentState.rtdbData.currentGame[player].readyToPlay = true;
        this.setState(currentState);
    },
    setRtdbData(roomPrivateId: string, roomPublicId: string) {
        const currentState = this.getState();
        currentState.rtdbData.roomPrivateId = roomPrivateId;
        currentState.rtdbData.roomPublicId = roomPublicId;
        this.setState(currentState);
    },
    setState(newState) {
        this.data = newState;
        for (const callback of this.listeners) {
            callback();
        }
        localStorage.setItem('currentState', JSON.stringify(newState));
    },
    setUserData(dni, userId?) {
        const currentState = this.getState();
        currentState.userData.dni = dni;
        currentState.userData.userId = userId;
        this.setState(currentState);
    },
    subscribe(callback: (any) => any) {
        this.listeners.push(callback);
    },
    whoWon(playerOneMove: Jugada, playerTwoMove: Jugada) {
        if (playerOneMove == playerTwoMove) {
            return 'empate';
        } else if (
            (playerOneMove == 'piedra' && playerTwoMove == 'tijera' ||
            playerOneMove == 'papel' && playerTwoMove == 'piedra' ||
            playerOneMove == 'tijera' && playerTwoMove == 'papel')
        ) {
            return 'playerOne';
        } else {
            return 'playerTwo';
        }
    },
    listenRoom() {
        const currentState = this.getState();
        const chatRoomRef = ref(rtdb, '/rooms/' + state.getPrivateId());
        onValue(chatRoomRef, () => {
            // const data = snapshot.val();
            // currentState.rtdbData.currentGame = data.currentGame;
            console.log('Cambié el state desde "listenRoom()": ', currentState);
            state.setState(currentState);
        });
    },
    createRoom(userId: string, userDni: string) {
        fetch(API_BASE_URL + '/rooms', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId,
                userDni,
            }),
        }).then(res => {
            return res.json();
        }).then(resFromServer => {
            state.setRtdbData(resFromServer.roomPrivateId, resFromServer.id);
            this.listenRoom();
        });
    },
    enterRoom(roomId:string, userDni: string) {
        const userId = state.getUserId();
        fetch(API_BASE_URL + '/rooms/' + roomId + '?userId=' + userId + '&userDni=' + userDni, {
            method: 'get',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(res => {
            return res.json();
        }).then(data => {
            if (data.error) {
                state.catchError(data);
            } else {
                state.setRtdbData(roomId, data.rtdbRoomId);
                this.listenRoom();
            }
        });
    },
    listenOnlineStatus(userId: string, roomId: string) {
        window.addEventListener('beforeunload', () => {
            if (state.getUserDni() == state.getPlayerTwoDni()) {
                fetch(API_BASE_URL + '/rooms/logout', {
                    method: 'patch',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        roomId,
                        player: 'playerTwo',
                    }),
                });
            } else {
                fetch(API_BASE_URL + '/rooms/logout', {
                    method: 'patch',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        userId,
                        roomId,
                        player: 'playerOne',
                    }),
                });
            }
        });
    },
    resetFlags(userId: string, roomId: string) {
        if (state.getUserDni() == state.getPlayerTwoDni()) {
            fetch(API_BASE_URL + '/rooms/reset', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerTwo',
                    currentChoice: '',
                }),
            });
        } else {
            fetch(API_BASE_URL + '/rooms/reset', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerOne',
                    currentChoice: '',
                }),
            });
        };
    },
    signInUser(dni: string) {
        fetch(API_BASE_URL + '/sign-in', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dni,
            })
        }).then(res => {
            return res.json()
        }).then(res => {
            state.setUserData(dni, res.id);
        });
    },
    signUpUser(dni: string) {
        fetch(API_BASE_URL + '/sign-up', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                dni,
            })
        }).then(res => {
            return res.json()
        }).then(res => {
            state.setUserData(dni, res.id);
        });
    },
    updateChoice(userId: string, roomId: string, choice: Jugada) {
        if (state.getUserDni() == state.getPlayerTwoDni()) {
            fetch(API_BASE_URL + '/rooms/choice', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerTwo',
                    currentChoice: choice,
                }),
            });
        } else {
            fetch(API_BASE_URL + '/rooms/choice', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerOne',
                    currentChoice: choice,
                }),
            });
        }
    },
    updateHistory(userId: string, roomId: string, result: string) {
        if (state.getUserDni() == state.getPlayerTwoDni()) {
            fetch(API_BASE_URL + '/rooms/history', {
                method: 'patch',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    currentResult: result,
                }),
            });
        }
    },
    updateStartStatus(userId: string, roomId: string) {
        if (state.getUserDni() == state.getPlayerTwoDni()) {
            fetch(API_BASE_URL + '/rooms/status', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerTwo',
                }),
            });
        } else {
            fetch(API_BASE_URL + '/rooms/status', {
                method: 'patch',
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId,
                    roomId,
                    player: 'playerOne',
                }),
            });
        };
    },

    //////////// CODIGO VIEJO ////////////
    setResult(result: any) {
        const currentState = this.getState();
        state.setState({
            ...currentState,
            currentGame: {
                ...currentState.currentGame,
                currentResult: result
            }
        })
    },
    restartScore() {
        state.setState({
            historyScore: {
                playerOne: 0,
                playerTwo: 0
            }
        })
    }
};

export { state };