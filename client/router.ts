import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
  { path: "/", component: "sign-up-page" },
  { path: "/welcome", component: "welcome-page" },
  { path: "/code-room", component: "code-room-page" },
  { path: "/instructions", component: "instructions-page" },
  { path: "/play", component: "play-page" },
  { path: "/picks", component: "picks-page" },
  { path: "/result", component: "result-page" },
  { path: "(.*)", redirect: "/" },
]);