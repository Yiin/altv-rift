import alt from "@altv/client";
import { ref } from "vue";

export function whileEntityIsStreamedIn<T extends alt.Entity>(
  check: (entity: alt.Entity) => entity is T,
  fn: (entity: T) => MaybePromise<void | (() => void)>
) {
  const cleanup = ref<void | (() => void)>();

  async function create({ entity }: alt.Events.GameEntityCreateEventParameters) {
    if (check(entity)) {
      cleanup.value = await fn(entity);
    }
  }
  const onGameEntityCreate = alt.Events.onGameEntityCreate(create);

  const existingEntity = alt.Entity.all.find(check);
  if (existingEntity) {
    create({ entity: existingEntity });
  }

  const onGameEntityDestroy = alt.Events.onGameEntityDestroy(({ entity }) => {
    if (check(entity)) {
      cleanup.value?.();
      cleanup.value = undefined;
    }
  });

  const onDisconnect = alt.Events.onDisconnect(() => {
    if (cleanup.value) {
      cleanup.value();
      cleanup.value = undefined;
    }
  });

  return () => {
    cleanup.value?.();
    onGameEntityCreate.destroy();
    onGameEntityDestroy.destroy();
    onDisconnect.destroy();
  };
}
