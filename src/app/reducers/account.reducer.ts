import { AccountActions, SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './account.actions';

export interface State {
    isAuthenticated: boolean;
}

export const initialState: State = {
    isAuthenticated: false
};

export function accountReducer(state = initialState, action: AccountActions) {
    switch (action.type) {
        case SET_AUTHENTICATED:
            return {
                isAuthenticated: true
            };
        case SET_UNAUTHENTICATED:
            return {
                isAuthenticated: false
            };
        default:
            return state;
    }
}

export const getIsAuth = (state: State) => state.isAuthenticated;
