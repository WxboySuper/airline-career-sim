import type { SaveGame, SaveId } from "@airline-career-sim/shared";

/**
 * Minimal development-only save repository abstraction.
 */
export interface SaveRepository {
  /**
   * Stores a save.
   *
   * @param save - Save payload to store.
   */
  create(save: SaveGame): Promise<SaveGame>;

  /**
   * Returns a save by ID.
   *
   * @param saveId - Save identifier.
   */
  getById(saveId: SaveId): Promise<SaveGame | undefined>;

  /**
   * Returns all saves currently stored.
   */
  list(): Promise<SaveGame[]>;

  /**
   * Replaces an existing save.
   *
   * @param save - Updated save payload.
   */
  replace(save: SaveGame): Promise<SaveGame>;

  /**
   * Deletes a save by ID.
   *
   * @param saveId - Save identifier.
   */
  delete(saveId: SaveId): Promise<boolean>;
}

const cloneSave = (save: SaveGame) => structuredClone(save);

/**
 * Creates a lightweight in-memory save repository for development and tests.
 */
export function createInMemorySaveRepository(): SaveRepository {
  const saves = new Map<SaveId, SaveGame>();

  return {
    async create(save) {
      const cloned = cloneSave(save);
      saves.set(cloned.id, cloned);
      return cloneSave(cloned);
    },
    async getById(saveId) {
      const existing = saves.get(saveId);
      return existing ? cloneSave(existing) : undefined;
    },
    async list() {
      return [...saves.values()].map((save) => cloneSave(save));
    },
    async replace(save) {
      const cloned = cloneSave(save);
      saves.set(cloned.id, cloned);
      return cloneSave(cloned);
    },
    async delete(saveId) {
      return saves.delete(saveId);
    }
  };
}
