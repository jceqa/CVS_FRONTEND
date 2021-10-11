import { STORAGE_INSERTED, STORAGE_DELETED, STORAGEActions } from './storage.actions';

export interface State {
    isSet: boolean;
}

export const initialState: State = {
    isSet: false
};

export function storageReducer(state = initialState, action: STORAGEActions) {
    switch (action.type) {
        case STORAGE_INSERTED:
            return {
                isSet: true
            };
        case STORAGE_DELETED:
            return {
                isSet: false
            };
        default:
            return state;
    }
}

export const getisSet = (state: State) => state.isSet;
