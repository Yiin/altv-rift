declare module "@altv/server" {
  interface Player {
    pinia: undefined;
    user: undefined;
    character: undefined;
    gameState: undefined;
  }
}

console.log("Loading user-interface...");
import "./core/user-interface";
console.log("Loading rmlui...");
import "./core/rmlui";
console.log("Loading remote-native...");
import "./core/remote-native";
console.log("Loading world...");
import "./modules/world";
console.log("Loading auth...");
import "./modules/auth";
console.log("Loading spawn...");
import "./modules/spawn";
console.log("Loading chat...");
import "./modules/chat";
console.log("Loading player...");
import "./modules/player";
console.log("Loading admin...");
import "./modules/admin";
console.log("Loading inventory...");
import "./modules/inventory";
console.log("Loading npcs...");
import "./modules/npcs";
console.log("Loading questing...");
import "./modules/questing";
console.log("Loading skills...");
import "./modules/skills";
console.log("Loaded.");
