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
    displayForm() {
        const formEl = this.querySelector('.existing-room-form');
        const newGameButtonEl = this.querySelector('.new-game');
        const existingRoomButtonEl = this.querySelector('.existing-room');
        const castFormEl = formEl as any;
        const castNewGameButtonEl = newGameButtonEl as any;
        const castexistingRoomButtonEl = existingRoomButtonEl as any;
        castFormEl.style.display = 'grid';
        castNewGameButtonEl.style.display = 'none';
        castexistingRoomButtonEl.style.display = 'none';
        castFormEl.addEventListener('submit', (e) => {
            e.preventDefault();
            let roomId = e.target['room-id'].value;
            state.enterRoom(roomId, state.getUserDni());
            state.subscribe(() => {
                if (state.getError().error) {
                    const container = this.querySelector('.buttons');
                    container!.innerHTML = `
                        <h4 class="text-instructions-page">
                            ${state.getError().message}
                        </h4>
                            <button class="button back">Volver</button>
                    `;
                    let backButtonEl = this.querySelector('.back');
                    const castbackButtonEl = backButtonEl as any;
                    castbackButtonEl.style.display = 'grid';
                    castbackButtonEl?.addEventListener('click', () => {
                        this.render();
                    });
                } else if (state.getPublicId()) {
                    // NO VA A LA PANTALLA DE INSTRUCCIONES UNA VEZ QUE YA LE PUSE
                    // EL CODIGO DE LA ROOM Y SE ACTUALIZO EN RTDB LOS DATOS DEL PLAYER 2
                    Router.go("/instructions");
                };
            });
        })
    }
    render() {
        this.innerHTML = `
            <div class='container-welcome-page'>
                <h2 class="title">Piedra, Papel o Tijera</h2>
                <div class="buttons">
                    <button class="button new-game">Crear una sala</button>
                    <button class="button existing-room">Ir a una sala</button>
                    <form class='existing-room-form'>
                        <label class='label'>Ingresá el código de la sala
                            <input class="input" type='number' name='room-id'></input>
                        </label>
                        <button class="button button-existing-room-form">Continuar</button>
                    </form>
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