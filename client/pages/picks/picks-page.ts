import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Picks extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        state.updateHistory(
            state.getUserId(),
            state.getPrivateId(),
            state.whoWon(state.getPlayerOneChoice(), state.getPlayerTwoChoice()));

            console.log('whoWon: ', state.whoWon(state.getPlayerOneChoice(), state.getPlayerTwoChoice()));

        state.subscribe(() => {
            Router.go('/result');
        });
    }
    render() {
        this.innerHTML = `
        <div class='container-picks-page'>
            <my-jugada data-jugada="${state.getPlayerTwoChoice()}" class="player-one-play-piedra hands"></my-jugada>
            <my-jugada data-jugada="${state.getPlayerOneChoice()}" class="player-one-play-tijera hands"></my-jugada>
        </div>
        `;
        this.addListeners();
    }
}

customElements.define('picks-page', Picks);