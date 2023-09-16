import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Play extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        const startButtonEl = this.querySelector('.start');
        this.startGame(startButtonEl);
    }
    startGame(buttonEl) {
        buttonEl.addEventListener('click', () => {
            state.updateStartStatus(state.getUserId(), state.getPrivateId());
            const roomContent = this.querySelector(".text-instructions-page");
            state.subscribe(() => {
            roomContent!.innerHTML = `
                <div class='room-id'>
                    <p class='room-id-sala'>Sala</p>
                    <p class='room-id-number'>${state.getPublicId()}</p>
                </div>
                <h4 class="text-instructions-page">
                    Esperando a que la otra persona presione <i>¡Jugar!</i>...
                </h4>
            `})
    
            if (state.playersAreReadyToPlay()) {
                Router.go("/play");
            }
        });
    }
    render() {
        this.innerHTML = `
        <div class='container-play-page'>
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
        </div>
        `;
        this.addListeners();
    }
}

customElements.define('play-page', Play);