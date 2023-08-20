import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Welcome extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        const newGameButtonEl = this.querySelector(".new-game");
        newGameButtonEl.addEventListener('click', () => {
            this.submitNewGame();
        });

        const existingRoomButtonEl = this.querySelector(".existing-room");
        existingRoomButtonEl.addEventListener('click', () => {
            console.log('hola');
            
            this.displayForm();
        });

        if (state.getError().error) {
            state.resetError();
        };
    }
    submitNewGame() {
        state.createRoom(state.getUserId(), state.getUserDni());
        state.subscribe(() => {
            Router.go("/code-room");
        });
    }
    // HACER ESTA PARTE Y EMPEZAR POR LA PANTALLA /PLAY
    displayForm() {
        state.subscribe(() => {
            Router.go("/enter-room");
        });
    }
    render() {
        this.innerHTML = `
            <div class='container-welcome-page'>
                <h2 class="title">Piedra, Papel o Tijera</h2>
                <div class="buttons">
                    <button class="button new-game">Crear una sala</button>
                    <button class="button existing-room">Ir a una sala</button>
                </div>
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

customElements.define('welcome-page', Welcome);