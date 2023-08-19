import "../../components/button/button"
import "../../components/option-to-choose/option-to-choose"

export function initInstructionsPage(params) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "container-instructions-page";

    div.innerHTML = `
        <h4 class="text-instructions">
            Presioná jugar y elegí: piedra, papel o tijera antes de que pasen los 3 segundos.
        </h4>
        <div class="button">
            <my-button class="button-start">¡Jugar!</my-button>
        </div>
        <div class="container-jugadas">
            <my-jugada jugada="piedra"></my-jugada>
            <my-jugada jugada="papel"></my-jugada>
            <my-jugada jugada="tijera"></my-jugada>
        </div>
    `;

    style.innerHTML = `
        .container-instructions-page {
            height: 100vh;
            margin: auto;
            display: grid;
        }
        .text-instructions {
            font-family: American Typewriter;
            color: rgba(0, 0, 0, 1);
            font-size: 40px;
            width: auto;
            max-width: 500px;
            text-align: center;
            margin: auto;
            padding: 40px 20px;
        }
        @media (min-width: 960px) {
            .text-instructions {
                font-size: 55px;
                max-width: 700px;
                padding: 40px 0;
            }
        }
        .button {
            text-align: center;
        }
        @media (min-width: 960px) {
            .button {
                padding-top: 0;
                padding-bottom: 40px;
            }
        }
        .container-jugadas {
            display: grid;
            grid-template-columns: 100px 100px 100px;
            justify-content: center;
            align-content: end;
            gap: 20px;
        }
    `;

    const button = div.querySelector(".button-start");
    button.addEventListener("click", () => {
        params.goTo("/play");
    });

    div.appendChild(style);
    return div;
};