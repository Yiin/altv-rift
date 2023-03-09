import { container } from "@shared/ioc-container";
import { Chat } from "./chat";

container.resolve(Chat).start();
