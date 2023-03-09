import alt from "alt-client";
import { KeyCode } from "altv-enums";
import { Events } from "@shared/constants/events";
import { onKeyDown } from "@/utility/event-helpers";

onKeyDown(KeyCode.I, () => {
  alt.emitServer(Events.Server.REQUEST_ITEM);
});
