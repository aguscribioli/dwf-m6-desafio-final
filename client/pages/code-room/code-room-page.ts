import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class CodeRoom extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        this.listenPlayersStatus();
        state.listenOnlineStatus(state.getUserDni(), state.getPrivateId());
    }
    listenPlayersStatus() {
        state.subscribe(() => {
            // NO FUNCIONA ESTE IF, OSEA NO VA A LA PANTALLA DE INSTRUCCIONES UNA VEZ QUE
            // EL PLAYER 2 PUSO EL CODIGO DE LA ROOM
            if (state.playersAreOnline()) {
                Router.go("/instructions");
            }
        })
    }
    render() {
        this.innerHTML = `
            <div class='container-code-room-page'>
                <h4 class="text-instructions">
                Compartí el código
                <br><br><div class='code-id'>${state.getPublicId()}</div><br>
                con tu contrincante
                </h4>
                <div class="container-jugadas">
                    <my-jugada jugada="piedra"></my-jugada>
                    <my-jugada jugada="papel"></my-jugada>
                    <my-jugada jugada="tijera"></my-jugada>
                </div>
            </div>
        `;
        this.addListeners();
    }
}

customElements.define('code-room-page', CodeRoom);