import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Result extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        // state.updateHistory(state.getUserId(), state.getPrivateId(), state.whoWon(state.getPlayerOneChoice(), state.getPlayerTwoChoice()));
        // state.subscribe(() => {
        //     Router.go('/result');
        // });
    }
    render() {
        this.innerHTML = `
        <div class='container-result-page'>
            <div>HOLAAAAA</div>
            <div class="container-jugadas-player-one">
                <my-jugada data-jugada="piedra" class="player-one-play-piedra hands"></my-jugada>
                <my-jugada data-jugada="papel" class="player-one-play-papel hands"></my-jugada>
                <my-jugada data-jugada="tijera" class="player-one-play-tijera hands"></my-jugada>
            </div>
        </div>
        `;
        this.addListeners();
    }
}

customElements.define('result-page', Result);