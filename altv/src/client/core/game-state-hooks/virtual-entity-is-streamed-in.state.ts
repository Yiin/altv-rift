import alt from "@altv/client";

export function whileVirtualEntityIsStreamedIn(
  check: (entity: alt.VirtualEntity) => boolean,
  fn: (entity: alt.VirtualEntity) => MaybePromise<void | (() => void)>,
) {
  const map = new Map<alt.VirtualEntity, () => void>();

  async function create({ object }: alt.Events.WorldObjectStreamInEventParameters) {
    if (object instanceof alt.VirtualEntity && check(object)) {
      const cleanup = await fn(object);

      if (cleanup) {
        map.set(object, cleanup);
      }
    }
  }

  const onWorldObjectStreamIn = alt.Events.onWorldObjectStreamIn(create);

  const existingEntities = alt.VirtualEntity.streamedIn.filter(check);

  for (const existingEntity of existingEntities) {
    create({ object: existingEntity });
  }

  const onWorldObjectStreamOut = alt.Events.onWorldObjectStreamOut(({ object }) => {
    if (object instanceof alt.VirtualEntity && check(object)) {
      const cleanup = map.get(object);
      if (cleanup) {
        cleanup();
        map.delete(object);
      }
    }
  });

  return () => {
    onWorldObjectStreamIn.destroy();
    onWorldObjectStreamOut.destroy();

    for (const cleanup of map.values()) {
      cleanup();
    }
  };
}
