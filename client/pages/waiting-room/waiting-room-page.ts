import "../../components/button/button"
import "../../components/option-to-choose/option-to-choose"

export function initWaitingRoomPage(params) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "container-waiting-room-page";

    // completar con el código de la sala
    const roomId = '';

    div.innerHTML = `
        <div class='room-id'>
        <p class='room-id-sala'>Sala</p>
        <p class='room-id-number'>${roomId}</p>
        </div>
        <h4 class="text-instructions">
            Esperando a que tu rival presione <i>¡Jugar!</i>...
        </h4>
        <div class="container-jugadas">
            <my-jugada jugada="piedra"></my-jugada>
            <my-jugada jugada="papel"></my-jugada>
            <my-jugada jugada="tijera"></my-jugada>
        </div>
    `;

    style.innerHTML = `
        .container-waiting-room-page {
            height: 100vh;
            margin: auto;
            display: grid;
        }
        .room-id {
            display: grid;
            justify-content: flex-end;
            padding: 30px;
            font-size: 30px;
        }
        .room-id-sala, .room-id-number {
            text-align: right;
            margin: 0;
        }
        .room-id-sala {
            font-weight: bold;
        }
        .text-instructions {
            font-family: American Typewriter;
            color: rgba(0, 0, 0, 1);
            font-size: 40px;
            width: auto;
            max-width: 350px;
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
        .container-jugadas {
            display: grid;
            grid-template-columns: 100px 100px 100px;
            justify-content: center;
            align-content: end;
            gap: 20px;
        }
    `;

    // const button = div.querySelector(".button-start");
    // button.addEventListener("click", () => {
    //     params.goTo("/play");
    // });

    div.appendChild(style);
    return div;
};