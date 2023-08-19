import "../../components/button/button"
import "../../components/input/input"
import "../../components/option-to-choose/option-to-choose"

export function initExistingRoomPage(params) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "container-enter-existing-room-page";

    div.innerHTML = `
        <h2 class="title">Piedra, Papel o Tijera</h2>
        <div class="button-container">
            <div class='input-title'>
                <h3>Ingresá el código de la sala</h3>
            </div>
            <my-input class="input"></my-input>
            <my-button class="button">Continuar</my-button>
        </div>
        <div class="container-jugadas">
            <my-jugada jugada="piedra"></my-jugada>
            <my-jugada jugada="papel"></my-jugada>
            <my-jugada jugada="tijera"></my-jugada>
        </div>
    `;

    style.innerHTML = `
        .container-enter-existing-room-page {
            height: 100vh;
            margin: auto;
            display: grid;
        }
        .title {
            color: rgba(0, 144, 72, 1);
            font-size: 100px;
            width: 300px;
            text-align: center;
            margin: auto;
        }
        @media (min-width: 960px) {
            .title {
                font-size: 130px;
                width: 550px;
            }
        }
        .button-container {
            text-align: center;
            padding: 30px 0;
            display: grid;
        }
        @media (min-width: 960px) {
            .button-container {
                padding: 25px 0;
            }
        }
        .input-title {
            font-family: "Odibee Sans", cursive;
            font-size: 30px;
            text-align: center;
        }
        h3 {
            margin: 0;
        }
        .input {
            padding: 10px 0 20px;
        }
        .container-jugadas {
            display: grid;
            grid-template-columns: 100px 100px 100px;
            justify-content: center;
            align-content: end;
            gap: 20px;
        }
    `;

    const button = div.querySelector(".button");
    button.addEventListener("click", () => {
        params.goTo("/instructions");
    }); 

    div.appendChild(style);
    return div;
};