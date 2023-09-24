import * as alt from "@altv/client";

export function whileEntityIsStreamedIn<T extends alt.Entity>(
  check: (entity: alt.Entity) => entity is T,
  fn: (entity: T) => void | (() => void)
) {
  let cleanup: void | (() => void);

  const create = ({ entity }: alt.Events.GameEntityCreateEventParameters) => {
    if (check(entity)) {
      cleanup = fn(entity);
    }
  };
  const createHandler = alt.Events.onGameEntityCreate(create);

  const existingEntity = alt.Entity.all.find(check);

  if (existingEntity) {
    create({ entity: existingEntity });
  }

  const destroy = ({ entity }: alt.Events.GameEntityDestroyEventParameters) => {
    if (check(entity)) {
      cleanup?.();
    }
  };
  const destroyHandler = alt.Events.onGameEntityDestroy(destroy);

  return () => {
    cleanup?.();
    createHandler.destroy();
    destroyHandler.destroy();
  };
}
