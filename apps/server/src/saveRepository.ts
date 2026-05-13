import type { SaveGame, SaveId } from "@airline-career-sim/shared";

/**
 * Persistence boundary for development save storage.
 */
export interface SaveRepository {
  /**
   * Stores a new save snapshot.
   *
   * @param save - Valid save snapshot to store.
   * @returns A copy of the stored save.
   */
  create(save: SaveGame): SaveGame;

  /**
   * Finds one save snapshot by ID.
   *
   * @param saveId - Save ID to retrieve.
   * @returns A copy of the save when it exists.
   */
  get(saveId: SaveId): SaveGame | undefined;

  /**
   * Lists all stored save snapshots.
   *
   * @returns Copies of stored saves in repository-defined order.
   */
  list(): SaveGame[];

  /**
   * Replaces or inserts a save snapshot.
   *
   * @param save - Valid save snapshot to store.
   * @returns A copy of the stored save.
   */
  replace(save: SaveGame): SaveGame;

  /**
   * Deletes one save snapshot by ID.
   *
   * @param saveId - Save ID to delete.
   * @returns True when a save was removed.
   */
  delete(saveId: SaveId): boolean;
}

const cloneSave = (save: SaveGame): SaveGame => structuredClone(save);

/**
 * Development-only in-memory save storage.
 *
 * TODO: replace this with authenticated Firebase user mapping plus Postgres persistence.
 */
export class InMemorySaveRepository implements SaveRepository {
  private readonly saves = new Map<SaveId, SaveGame>();

  /**
   * Stores a newly created save by ID.
   *
   * @param save - Valid save snapshot to store.
   * @returns A cloned copy of the stored save.
   */
  create(save: SaveGame): SaveGame {
    this.saves.set(save.id, cloneSave(save));
    return cloneSave(save);
  }

  /**
   * Reads a save by ID.
   *
   * @param saveId - Save ID to read.
   * @returns A cloned save when present.
   */
  get(saveId: SaveId): SaveGame | undefined {
    const save = this.saves.get(saveId);
    return save ? cloneSave(save) : undefined;
  }

  /**
   * Lists all stored saves in deterministic ID order.
   *
   * @returns Cloned save snapshots.
   */
  list(): SaveGame[] {
    return [...this.saves.entries()]
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([, save]) => cloneSave(save));
  }

  /**
   * Replaces an existing save snapshot or inserts it if absent.
   *
   * @param save - Valid save snapshot to store.
   * @returns A cloned copy of the stored save.
   */
  replace(save: SaveGame): SaveGame {
    this.saves.set(save.id, cloneSave(save));
    return cloneSave(save);
  }

  /**
   * Deletes a save by ID.
   *
   * @param saveId - Save ID to delete.
   * @returns True when a save was removed.
   */
  delete(saveId: SaveId): boolean {
    return this.saves.delete(saveId);
  }
}
