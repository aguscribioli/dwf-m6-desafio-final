customElements.define(
  "my-jugada",
  class extends HTMLElement {
    constructor() {
      super();
      this.render();
    }
    render(){
      const shadow = this.attachShadow({ mode: "open" });
      const div = document.createElement("div");
      const jugada = this.getAttribute("data-jugada");
      const style = document.createElement("style");
      const image = document.createElement("img");
      image.setAttribute("width", "90px");
      image.setAttribute("height", "200px");
      
      style.innerHTML = `
      .piedra, .papel, .tijera {
        text-align: center;
        cursor: pointer;
      }
      `
      
      div.className = jugada;
      
      if (jugada == "piedra") {
        image.src = require("url:../../images/stone.png");
      } else if (jugada == "papel") {
        image.src = require("url:../../images/paper.png");
      } else if (jugada == "tijera") {
        image.src = require("url:../../images/scissors.png");
      }

      div.appendChild(image);
      shadow.appendChild(div);
      shadow.appendChild(style);
    };
  }
);