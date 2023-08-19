import "../../components/button/button"

export function initTimeIsUpPage(params) {
    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "container-instructions-page";

    div.innerHTML = `
        <h4 class="text-instructions">
            ¿Qué pasó?
            <br>
            ¿Se terminó el tiempo?
        </h4>
        <div class="button">
            <my-button class="button-start">¡Volver a jugar!</my-button>
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
            width: 300px;
            text-align: center;
            margin: auto;
            padding-top: 40px;
        }
        @media (min-width: 960px) {
            .text-instructions {
                font-size: 55px;
                width: 800px;
            }
        }
        .button {
            text-align: center;
            padding-top: 60px;
        }
        @media (min-width: 960px) {
            .button {
                padding-top: 25px;
            }
        }
    `;

    const button = div.querySelector(".button-start");
    button.addEventListener("click", () => {
        params.goTo("/play");
    });

    div.appendChild(style);
    return div;
};