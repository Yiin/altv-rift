interface ServerProcedureListenerInfo {
  environment: string;
  id?: string;
  player: import("alt-server").Player;
}

type ServerProcedureListener<D = any> = (
  data: D,
  info: ServerProcedureListenerInfo
) => any | (() => any) | ((data: D) => any);

interface IServerRpc {
  CREATE_CHARACTER: ServerProcedureListener<{
    name: string;
    appearance: import("@prisma/client").Appearance;
  }>;
  START_GAME: ServerProcedureListener;
}

interface ClientProcedureListenerInfo {
  environment: string;
  id?: string;
}

type ClientTriggerListener = () => any;
type ClientProcedureListener<D = any> = (data: D, info: ClientProcedureListenerInfo) => any;

type IClientRpcCalls = {
  [name: string]: ClientProcedureListener;
}
