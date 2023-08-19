import "../../components/option-to-choose/option-to-choose";
import "../../components/timer/timer";
import { state, Jugada } from "../../state";

export function initPlayPage(params) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "container-play-page";
    
    let playerTwoMove: Jugada;
    let playerOneMove: Jugada;
    let counter = 3;
    let activeEvent: any = false;
    
    
    div.innerHTML = `
        <div class="container-jugadas-player-two">
            <my-jugada jugada="tijera" class="player-two-play-tijera"></my-jugada>
            <my-jugada jugada="papel" class="player-two-play-papel"></my-jugada>
            <my-jugada jugada="piedra" class="player-two-play-piedra"></my-jugada>
        </div>
        <my-timer class="container-timer"></my-timer>
        <div class="container-jugadas-player-one">
            <my-jugada jugada="piedra" class="player-one-play-piedra"></my-jugada>
            <my-jugada jugada="papel" class="player-one-play-papel"></my-jugada>
            <my-jugada jugada="tijera" class="player-one-play-tijera"></my-jugada>
        </div>
    `;

    style.innerHTML = `
    .container-play-page {
            height: 100%;
            margin: auto;
            display: grid;
        }
        .container-timer {
            text-align: center;
            height: 50vh;
        }
        .container-jugadas-player-one, .container-jugadas-player-two {
            height: 50vh;
            max-width: 600px;
            margin: 0 auto;
            display: flex;
            gap: 20px;
            justify-content: space-evenly;
            align-items: end;
        }
        @media (min-width:960px) {
            .container-jugadas-player-one, .container-jugadas-player-two {
                gap: 80px;
            }
        }
        .container-jugadas-player-two {
            transform: rotate(180deg);
            display: none;
        }
        .disable {
            display: none;
        }
        .enable {
            display: flex;
        }
        `;

        function activeEventOn() {
        activeEvent = true;
    };
    
    function randomPlayerTwoMove() {
        let randomNumber = Math.random();
        if (randomNumber < 1/3) {
            playerTwoMove = "piedra";
        } else if (randomNumber < 2/3) {
            playerTwoMove = "papel";
        } else { playerTwoMove = "tijera" }
        return playerTwoMove;
    }
    
    function stateSubscriber(playerOneMove, playerTwoMove){
        state.subscribe(() => {});
    }

    function redirectToResult(){
        let counter = 1;
        const redirecter = setInterval(() => {
            counter--;
            if (counter == 0) {
                params.goTo("/result");
                clearInterval(redirecter);
            }
        }, 2000)
    };
    
    const playerOnePlayPiedra = div.querySelector(".player-one-play-piedra");
    const playerOnePlayPapel = div.querySelector(".player-one-play-papel");
    const playerOnePlayTijera = div.querySelector(".player-one-play-tijera");
    const containerJugadasPlayerTwo = div.querySelector(".container-jugadas-player-two");
    const playerTwoPlayPiedra = div.querySelector(".player-two-play-piedra");
    const playerTwoPlayPapel = div.querySelector(".player-two-play-papel");
    const playerTwoPlayTijera = div.querySelector(".player-two-play-tijera");
    const timer = div.querySelector(".container-timer");

    function showPlayerTwoPlay(){
        containerJugadasPlayerTwo.classList.add("enable");
        if (playerTwoMove == "piedra") {
            playerTwoPlayPiedra.classList.add("enable");
            playerTwoPlayPapel.classList.add("disable");
            playerTwoPlayTijera.classList.add("disable");
        } else if (playerTwoMove == "papel") {
            playerTwoPlayPapel.classList.add("enable");
            playerTwoPlayPiedra.classList.add("disable");
            playerTwoPlayTijera.classList.add("disable");
        } else {
            playerTwoPlayTijera.classList.add("enable");
            playerTwoPlayPiedra.classList.add("disable");
            playerTwoPlayPapel.classList.add("disable");
        }
        timer.classList.add("disable");
    }
    
    (function thePlay(){
        playerOnePlayPiedra.addEventListener("click", () => {
            activeEventOn();
            playerOneMove = "piedra";
            randomPlayerTwoMove();
            showPlayerTwoPlay();
            playerOnePlayPapel.classList.add("disable");
            playerOnePlayTijera.classList.add("disable");
            state.setMove(playerOneMove, playerTwoMove);
            stateSubscriber(playerOneMove, playerTwoMove);
            redirectToResult();
        });
        playerOnePlayPapel.addEventListener("click", () => {
            activeEventOn();
            playerOneMove = "papel";
            randomPlayerTwoMove();
            showPlayerTwoPlay();
            playerOnePlayPiedra.classList.add("disable");
            playerOnePlayTijera.classList.add("disable");
            state.setMove(playerOneMove, playerTwoMove);
            stateSubscriber(playerOneMove, playerTwoMove);
            redirectToResult();
        });
        playerOnePlayTijera.addEventListener("click", () => {
            activeEventOn();
            playerOneMove = "tijera";
            randomPlayerTwoMove();
            showPlayerTwoPlay();
            playerOnePlayPiedra.classList.add("disable");
            playerOnePlayPapel.classList.add("disable");
            state.setMove(playerOneMove, playerTwoMove);
            stateSubscriber(playerOneMove, playerTwoMove);
            redirectToResult();
        });
    })();

    (function timesUp() {
        const intervalId = setInterval(() => {
            counter--;
          if (counter < 1 && activeEvent == false) {
            clearInterval(intervalId);
            params.goTo("/time-is-up");
          }
        }, 1000);
    })();
        
    div.appendChild(style);
    return div;
};