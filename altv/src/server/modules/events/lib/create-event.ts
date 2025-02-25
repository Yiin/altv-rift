import alt from "@altv/server";

interface EventConfig {
  name: string;
  cooldown: number;
  setup: (context: { finish: () => void }) => () => void;
}

export function createEvent(config: EventConfig) {
  let timeoutRef: alt.Timers.Timeout | null = null;

  function start() {
    timeoutRef?.destroy();
    timeoutRef = null;

    const cleanup = config.setup({
      finish: () => {
        cleanup();
        timeoutRef = alt.Timers.setTimeout(start, config.cooldown);
      },
    });
  }

  start();
  return () => {
    timeoutRef?.destroy();
  };
}
