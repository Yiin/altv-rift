import { container } from "@shared/dependency-injection";
import { Chat } from "./chat";

container.resolve(Chat).start();
