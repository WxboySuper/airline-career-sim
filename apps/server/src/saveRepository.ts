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
   * @returns The stored save, or undefined when the save ID does not exist.
   */
  replace(save: SaveGame): Promise<SaveGame | undefined>;

  /**
   * Deletes a save by ID.
   *
   * @param saveId - Save identifier.
   */
  delete(saveId: SaveId): Promise<boolean>;
}

/**
 * Returns a deep clone of a save so callers cannot mutate stored state.
 *
 * @param save - Save payload to clone.
 * @returns A detached copy of the save.
 */
const cloneSave = (save: SaveGame): SaveGame => structuredClone(save);

/**
 * Creates a lightweight in-memory save repository for development and tests.
 */
export function createInMemorySaveRepository(): SaveRepository {
  const saves = new Map<SaveId, SaveGame>();

  return {
    create(save) {
      const cloned = cloneSave(save);
      saves.set(cloned.id, cloned);
      return Promise.resolve(cloneSave(cloned));
    },
    getById(saveId) {
      const existing = saves.get(saveId);
      return Promise.resolve(existing ? cloneSave(existing) : undefined);
    },
    list() {
      return Promise.resolve([...saves.values()].map((save) => cloneSave(save)));
    },
    replace(save) {
      if (!saves.has(save.id)) {
        return Promise.resolve() as Promise<SaveGame | undefined>;
      }
      const cloned = cloneSave(save);
      saves.set(cloned.id, cloned);
      return Promise.resolve(cloneSave(cloned));
    },
    delete(saveId) {
      return Promise.resolve(saves.delete(saveId));
    }
  };
}
