export const FromServer = {
  ENTITYSET_IS_ACTIVE: "ENTITYSET_IS_ACTIVE",
} as const;

export interface CallFromServer {
  [FromServer.ENTITYSET_IS_ACTIVE]: (
    interior: number,
    entitySetName: string
  ) => boolean;
}
