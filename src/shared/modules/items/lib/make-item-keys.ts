export const makeItemKeys =
  <B>() =>
  <T extends { [key: string]: string }>(obj: T) => {
    return obj as any as { [key in keyof T]: B };
  };
