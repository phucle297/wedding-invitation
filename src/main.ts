import { createApp } from "vue";
import App from "./App.vue";
import "./styles/base.css";
import "./styles/invitation.css";

document.documentElement.classList.add("has-gate");
createApp(App).mount("#app");
