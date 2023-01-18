import { RPC } from "@shared/constants/rpcs";
import rpc from "altv-rpc";
import native from "natives";

rpc.on(RPC.Client.IPL_LOAD, (name: string) => {
  native.requestIpl(name);
});

rpc.on(RPC.Client.IPL_UNLOAD, (name: string) => {
  native.removeIpl(name);
});
