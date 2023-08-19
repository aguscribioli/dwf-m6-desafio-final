import "../../components/option-to-choose/option-to-choose";
import { Router } from "@vaadin/router";
import { state } from "../../state";

class SignUp extends HTMLElement {
    connectedCallback() {
        this.render();
    }
    addListeners() {
        const signUpFormEl = this.querySelector(".form");
        this.submitSignUpForm(signUpFormEl);
    }
    submitSignUpForm(formEl) {
        formEl.addEventListener("submit", (event) => {
            event.preventDefault();
            let target = event.target as any;

            console.log(target.dni.value);
            
            state.signUpUser(target.dni.value);
            state.subscribe(() => {
                Router.go("/welcome");

            });
        });
    }
    render() {
        this.innerHTML = `
            <div class='container-sign-up-page'>
                <h2 class="title">Piedra, Papel o Tijera</h2>
                <div class='form-container'>
                    <form class='form'>
                        <label class='label'> Ingresá tu DNI
                            <input class="input" name='dni'></input>
                        </label>
                        <button class='button'>Empezar</button>
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

customElements.define('sign-up-page', SignUp);