import alt from "alt-client";

export function whileEntityIsStreamedIn<T extends alt.Entity>(
  check: (entity: alt.Entity) => entity is T,
  fn: (entity: T) => void | (() => void)
) {
  let cleanup: void | (() => void);

  const create = (entity: alt.Entity) => {
    if (check(entity)) {
      cleanup = fn(entity);
    }
  };
  alt.on("gameEntityCreate", create);

  const existingEntity = alt.Entity.all.find(check);

  if (existingEntity) {
    create(existingEntity);
  }

  const destroy = (entity: alt.Entity) => {
    if (check(entity)) {
      cleanup?.();
      alt.off("gameEntityDestroy", destroy);
    }
  };
  alt.on("gameEntityDestroy", destroy);

  return () => {
    cleanup?.();
    alt.off("gameEntityCreate", create);
    alt.off("gameEntityDestroy", destroy);
  };
}
