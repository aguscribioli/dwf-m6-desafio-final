customElements.define(
    "my-timer",
    class extends HTMLElement {
        constructor() {
            super();
            this.render();
        }
        render() {
            const shadow = this.attachShadow({ mode: "open" });
            const div = document.createElement("div");
            const style = document.createElement("style");
            
            div.innerHTML = `
            <div class="countdown-number"></div>
            <svg class="svg">
            <circle class="svg-circle" r="90" cx="140" cy="140"></circle>
            </svg>
            `

            let counter = 3;
            var counterNumber = div.querySelector(".countdown-number") as any;
            counterNumber.textContent = counter;

            const timer = setInterval(() => {
                counter--;
                if (counter == 0) {
                    clearInterval(timer);
                }
                counterNumber.textContent = counter;
            }, 1000)
            
            style.innerHTML = `
            .countdown-number {
                position: relative;
                top: 169px;
                font-weight: 400;
                font-size: 70px;
                text-align: center;
                color: black;
            }
            .svg {
                width: 260px;
                height: 280px;
                transform: rotateY(-180deg) rotateZ(-90deg);
            }
            .svg-circle {
                stroke-dasharray: 570px;
                stroke-dashoffset: 0px;
                stroke-linecap: round;
                stroke-width: 10px;
                stroke: black ;
                fill: none;
                animation: countdown 3s linear infinite forwards;
            }
            @keyframes countdown {
                from {
                  stroke-dashoffset: 0px;
                }
                to {
                  stroke-dashoffset: 580px;
                }
            }`
            
            shadow.appendChild(div);
            shadow.appendChild(style);
        };
    }
);