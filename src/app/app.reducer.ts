import * as fromUi from './reducers/ui.reducer';
import * as fromStorage from './reducers/storage.reducer';
import * as fromAccount from './reducers/account.reducer';
import * as fromCGI from './reducers/cgi.reducer';
import { /*ActionReducerMap,*/ createFeatureSelector, createSelector } from '@ngrx/store';
/*import { translatorReducer } from './clients/components/reusable/redux/translator/translator.reducer';
import { ShopReducer } from './clients/components/reusable/redux/cart/cart.reducer';
import { companyReducer } from './shared/reducers/company.reducer';
import { companysReducer } from './shared/reducers/companys.reducer';
import { menuStatusReducer } from './shared/reducers/menuStatus.reducer';*/

export interface State {
    ui: fromUi.State;
    storage: fromStorage.State;
    auth: fromAccount.State;
    cgi: fromCGI.State;
    lang: string;
    cart: any;
    company: any;
    companys: any;
    menuOpen: boolean;
}

//export const reducers: ActionReducerMap<State> = {//
    //ui: fromUi.uiReducer,
    //storage: fromStorage.storageReducer,
    //auth: fromAccount.accountReducer,
    //cgi: fromCGI.cgiReducer,
    /*lang: translatorReducer,
    cart: ShopReducer,
    company: companyReducer,
    companys: companysReducer,
    menuOpen: menuStatusReducer*/
//};

export const getUiState = createFeatureSelector<fromUi.State>('ui');
export const getIsLoading = createSelector(getUiState, fromUi.getIsLoading);

export const getStorageState = createFeatureSelector<fromStorage.State>('storage');
export const getIsSet = createSelector(getStorageState, fromStorage.getisSet);

export const getAuthState = createFeatureSelector<fromAccount.State>('auth');
export const getIsAuth = createSelector(getAuthState, fromAccount.getIsAuth);

export const getUpdatedState = createFeatureSelector<fromCGI.State>('cgi');
export const getIsUpdated = createSelector(getUpdatedState, fromCGI.getIsUpdated);
