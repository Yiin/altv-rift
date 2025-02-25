import alt from "@altv/client";
import { WindowType } from "@shared/store/client.store";
import { onKeyDown } from "@/core/user-interface/event-helpers";
import { toggleWindow } from "@/core/user-interface/webview";

onKeyDown(
  alt.Enums.KeyCode.L,
  () => {
    toggleWindow(WindowType.WORKBENCH);
  },
  {
    isWindowKeybind: true,
  },
);
