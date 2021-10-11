import { Action } from '@ngrx/store';

export const STORAGE_INSERTED = '[STORAGE] Start Loading';
export const STORAGE_DELETED = '[STORAGE] Stop Loading';

export class StorageInserted implements Action {
    readonly type = STORAGE_INSERTED;
}

export class StorageDeleted implements Action {
    readonly type = STORAGE_DELETED;
}

export type STORAGEActions = StorageInserted | StorageDeleted;
