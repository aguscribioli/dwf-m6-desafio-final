import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Instructions extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        const startButtonEl = this.querySelector('.start');
        this.startGame(startButtonEl);
        state.listenOnlineStatus(state.getUserId(), state.getPrivateId());
    }
    startGame(buttonEl) {
        buttonEl.addEventListener('click', () => {
            state.updateStartStatus(state.getUserId(), state.getPrivateId());
            const roomContent = this.querySelector(".container-instructions-content");
            state.subscribe(() => {
            roomContent!.innerHTML = `
                <div class='room-id'>
                    <p class='room-id-sala'>Sala</p>
                    <p class='room-id-number'>${state.getPublicId()}</p>
                </div>
                <h4 class="text-instructions-page">
                    Esperando a que la otra persona presione <i>¡Jugar!</i>...
                </h4>
            `
        
            if (state.playersAreReadyToPlay()) {
                Router.go("/play");
            } else {
                console.log('Los jugadores aún no están readyToPlay.');
            }
            })
        });
    }
    render() {
        this.innerHTML = `
            <div class='container-instructions-page'>
                <div class='container-instructions-content'>
                    <h4 class="text-instructions-page">
                        Presioná <i>¡Jugar!</i> y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
                    </h4>
                    <div class='container-button-instructions'>
                        <button class="button start">¡Jugar!</button>
                    </div>
                </div>
                <div class="container-jugadas">
                    <my-jugada data-jugada="piedra"></my-jugada>
                    <my-jugada data-jugada="papel"></my-jugada>
                    <my-jugada data-jugada="tijera"></my-jugada>
                </div>
            </div>
        `;
        this.addListeners();
    }
}

customElements.define('instructions-page', Instructions);