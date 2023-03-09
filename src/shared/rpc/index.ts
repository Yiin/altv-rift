type RpcCallback = (...args: any[]) => any;

export function createPayload(name: string, args?: any[]) {
  const id = Date.now() + Math.random().toString(16).substring(2, 9);
  return { id, name, args };
}

const procedures = new Map<string, RpcCallback>();

// call server from server
const call = (name: string, ...args: any[]) => {
  if (!procedures.has(name)) {
    throw new Error(`call: Procedure ${name} does not exist`);
  }
  return procedures.get(name)!(...args);
};

// receive from server on server
const register = (name: string, callback: RpcCallback) => {
  if (procedures.has(name)) {
    throw new Error(`register: Procedure ${name} already exists`);
  }
  procedures.set(name, callback);
};

const unregister = (name: string) => {
  procedures.delete(name);
};

export const localRpc = {
  call,
  register,
  unregister,
};
