import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class Play extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners(counter) {
        let countdown = this.querySelector('.container-timer');
        let hands = this.querySelectorAll('.hands');
        function initCountdown() {
            const intervalId = setInterval(() => {
                counter--;
                countdown.innerHTML = `
                <my-timer class="container-timer">${counter}</my-timer>
                `;
                if (counter == 0) {
                    clearInterval(intervalId);
                    // state.resetFlags(state.getUserId(), state.getPrivateId());
                }
                if (state.playersChoseMove()) {
                    clearInterval(intervalId);
                }
            }, 1000);
            for (const h of hands) {
                h.addEventListener('click', (e) => {
                    const playerHand = e.target as any;

                    state.updateChoice(state.getUserId(), state.getPrivateId(), playerHand.dataset.jugada);
                    hands.forEach(element => {
                        element.classList.add('disabled');
                        playerHand.classList.add('target');
                    });
                });
            }
        }
        state.subscribe(() => {
            if (state.playersChoseMove()) {
                Router.go('/picks')
            }
        })
        initCountdown();
    }
    render() {
        let counter: number = 4;
        this.innerHTML = `
        <div class='container-play-page'>
            <my-timer class="container-timer">${counter}</my-timer>
            <div class="container-jugadas-player-one">
                <my-jugada data-jugada="piedra" class="player-one-play-piedra hands"></my-jugada>
                <my-jugada data-jugada="papel" class="player-one-play-papel hands"></my-jugada>
                <my-jugada data-jugada="tijera" class="player-one-play-tijera hands"></my-jugada>
            </div>
        </div>
        `;
        this.addListeners(counter);
    }
}

customElements.define('play-page', Play);