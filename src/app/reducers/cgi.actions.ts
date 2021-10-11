import { Action } from '@ngrx/store';

export const SET_UPDATED = '[CGI] Set Updated';
export const SET_OUTDATED = '[CGI] Set Outdated';

export class SetUpdated implements Action {
    readonly type = SET_UPDATED;
}

export class SetOutdated implements Action {
    readonly type = SET_OUTDATED;
}

export type CGIActions = SetUpdated | SetOutdated;
