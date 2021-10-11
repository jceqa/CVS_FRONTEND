import { Action } from '@ngrx/store';

export const SET_AUTHENTICATED = '[Account] Set Authenticated';
export const SET_UNAUTHENTICATED = '[Account] Set Unauthenticated';

export class SetAuthenticated implements Action {
    readonly type = SET_AUTHENTICATED;
}

export class SetUnauthenticated implements Action {
    readonly type = SET_UNAUTHENTICATED;
}

export type AccountActions = SetAuthenticated | SetUnauthenticated;
