import { CGIActions, SET_OUTDATED, SET_UPDATED } from './cgi.actions';

export interface State {
    isUpdated: boolean;
}

export const initialState: State = {
    isUpdated: false
};

export function cgiReducer(state = initialState, action: CGIActions) {
    switch (action.type) {
        case SET_UPDATED:
            return {
                isUpdated: true
            };
        case SET_OUTDATED:
            return {
                isUpdated: false
            };
        default:
            return state;
    }
}

export const getIsUpdated = (state: State) => state.isUpdated;
