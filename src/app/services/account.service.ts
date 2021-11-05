import { /*HttpClient,*/ HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
//import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, /*Observable*/ } from 'rxjs';
//import { environment } from '../../../environments/environment';
import * as fromRoot from '../app.reducer';
//import { LoginClaims } from '../../shared/models/appuser';
//import { Menu } from '../../shared/models/menu';
//import { Sistema } from '../../shared/models/sistema';
//import * as UI from '../reducers/ui.actions';
//import { UIService } from '../services/ui.service';
import * as Auth from '../reducers/account.actions';
//import { UtilService } from '../services/util.service';
//import { PermissionId } from '../../shared/models/permissionId';
//import * as CryptoJS from 'crypto-js';
import * as _ from 'lodash';
//import { ActivateUser } from '../models/activateUser';

/*class TokenDef {
    access_token: string;
    token_type: string;
    expires_in: number;
}*/

@Injectable()
export class AccountService {

    //public systemsObs: Observable<Sistema[]>;
    //public systems: Sistema[];
    //private recoverPasswordURL = environment.apiUrl + 'User/RecoverPassword';
    //private resetPasswordURL = environment.apiUrl + 'User/ResetPassword';
    //private activateUserURL = environment.apiUrl + 'User/Activate';
    //private tokenEndpoint = environment.tokenUrl;
    private roles: string[] = [];
    //private _menu: Menu[] = [];
    //private _permissions: PermissionId[] = [];

    public isAuthenticated$ = new BehaviorSubject<boolean>(false);

    public get username(): string {
        const v = localStorage.getItem('username');
        if (v == null) {
            return '';
        } else {
            return v;
        }
    }

    public set username(value: string) {
        if (value == null) {
            localStorage.setItem('username', '');
        } else {
            localStorage.setItem('username', value);
        }
    }

    public get userid(): number {
        const v = Number(localStorage.getItem('userid'));
        if (v == null) {
            return 0;
        } else {
            return v;
        }
    }

    public set userid(value: number) {
        if (value == null) {
            localStorage.setItem('userid', '0');
        } else {
            localStorage.setItem('userid', value.toString());
        }
    }

    public get IsMenuOpen() {
        const v = localStorage.getItem('isMenuOpen');
        if (v == null) {
            return true;
        } else {
            return v === 'true';
        }
    }
    public set IsMenuOpen(value: boolean) {
        if (value == null) {
            localStorage.setItem('isMenuOpen', 'true');
        } else {
            localStorage.setItem('isMenuOpen', value ? 'true' : 'false');
        }
    }

    public set companyList(value: any) {
        localStorage.setItem('companyList', JSON.stringify(value));
    }

    public loadState() {
        try {
            const serializedState = localStorage.getItem('state');
            if (serializedState === null) {
                return undefined;
            }
            return JSON.parse(serializedState);
        } catch (err) {
            return undefined;
        }
    }

    public saveState(state) {
        try {
            const serializedState = JSON.stringify(state);
            localStorage.setItem('state', serializedState);
        } catch {
            // ignore write errors
        }
    }

    public get companyList() {
        const parseObj = localStorage.getItem('companyList');
        return JSON.parse(parseObj);
    }

    public set selectedCompany(value: any) {
        localStorage.setItem('selectedCompany', _.toString(value));
    }
    public get selectedCompany() {
        const toNumber = localStorage.getItem('selectedCompany');
        return _.toNumber(toNumber);
    }

    public set selectedCompanyName(value: any) {
        localStorage.setItem('selectedCompanyName', value);
    }
    public get selectedCompanyName() {
        return localStorage.getItem('selectedCompanyName');
    }

    public get key() {
        let k = localStorage.getItem('key');
        if (k == null || k === '') {
            k = Math.random()
                .toString(36)
                .substring(7);
            localStorage.setItem('key', k);
        }
        return k;
    }

    /*public get menu() {
        if (this._menu == null || this._menu.length === 0) {
            try {
                let emenu = localStorage.getItem('emenu');
                if (emenu != null && emenu !== '') {
                    emenu = this.decrypt(this.key, emenu);
                    this._menu = JSON.parse(emenu);
                }
            } catch (err) {
                console.error(err);
                this._menu = [];
            }
        }
        return this._menu;
    }

    public set menu(value: Menu[]) {
        try {
            this._menu = value == null ? [] : value;
            localStorage.setItem(
                'emenu',
                this.crypt(this.key, JSON.stringify(this._menu))
            );
        } catch (err) {
            console.error(err);
        }
    }

    public get permissions() {
        if (this._permissions == null || this._permissions.length === 0) {
            try {
                this._permissions = JSON.parse(localStorage.getItem('permissions'));
            } catch (err) {
                console.error(err);
                this._permissions = [];
            }
        }
        return this._permissions;
    }

    public set permissions(value: PermissionId[]) {
        try {
            this._permissions = value == null ? [] : value;
            localStorage.setItem('permissions', JSON.stringify(this._permissions));
        } catch (err) {
            console.error(err);
        }
    }

    public get endpoint() {
        return environment.apiUrl;
    }*/

    constructor(
        //private httpClient: HttpClient,
        //public jwtHelper: JwtHelperService,
        //private uiService: UIService,
        //private utilService: UtilService,
        private store: Store<fromRoot.State>
    ) {
        this.isAuthenticated$.next(this.authenticated);
    }

    public get token(): string {
        return localStorage.getItem('token');
    }
    /*private get decodeToken(): any {
        return this.jwtHelper.decodeToken(this.token);
    }*/
    public get tokenExpiration(): Date {
        return new Date(localStorage.getItem('tokenExpiration'));
    }

    public get authenticated(): boolean {
        const expiration = parseInt(localStorage.getItem('expiration'), 10);
        if (!(expiration && expiration > 0)) return false;
        const expiration_date = new Date(expiration);
        return !(new Date() > expiration_date);
    }

    isDeveloper(): boolean {
        return (
            this.username === 'slanger@indega.com.py' ||
            this.username === 'clobo@indega.com.py' ||
            this.username === 'jcolman@indega.com.py'
        );
    }

    /*getSystems() {
        this.store.dispatch(new UI.StartLoading());
        const headers = this.getAuthHeather();
        return this.httpClient
            .get<any>(this.endpoint + 'getsystems', { headers: headers })
            .subscribe(
                result => {
                    if (result) {
                        this.systemsObs = result;
                        this.systems = result as Sistema[];
                    }
                    this.store.dispatch(new UI.StopLoading());
                },
                (/*error*/ //) => {
    /*     this.store.dispatch(new UI.StopLoading());
         this.uiService.showSnackbar(
             'Error al recuperar los datos de menú',
             'Cerrar',
             3000
         );
     }
 );
}

isInMenu(url: string) {
if (this.menu == null) {
 return false;
}

if (url.indexOf('?') !== -1) {
 url = url.split('?')[0];
}

for (let i = 0; i < this.menu.length; i++) {
 if (this.menu[i].Items == null)
     continue;
 const exists = this.menu[i].Items.find(x => url.startsWith(x.Url) || x.Url === url);
 if (exists != null) return true;
}

return false;
}

isInPermissions(companyId: number, permissionId: number): boolean {
if (this.permissions == null) return false;

const founded = this.permissions.find(
 x => x.e === companyId && x.p === permissionId
);
return founded != null;
}

get_Menu() {
const headers = this.getAuthHeather();
return this.httpClient.get<any>(this.endpoint + 'menu', {
 headers: headers
});
}

get_PermissionId() {
const headers = this.getAuthHeather();
return this.httpClient.get<any>(this.endpoint + 'permission/ids', {
 headers: headers
});
}*/

    /*
    getMenu() {
      this.store.dispatch(new UI.StartLoading());
      const headers = this.getAuthHeather();
      return this.httpClient
        .get<any>(this.endpoint + 'menu', { headers: headers })
        .subscribe(
          result => {
            if (result) {
              this.menu = result as Menu[];
            }
            this.store.dispatch(new UI.StopLoading());
          },
          () => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Error al recuperar los datos de menú',
              'Cerrar',
              3000
            );
          }
        );
    }*/
    /*
    getPermissionId() {
      this.store.dispatch(new UI.StartLoading());
      const headers = this.getAuthHeather();
      return this.httpClient
        .get<any>(this.endpoint + 'permission/ids', { headers: headers })
        .subscribe(
          result => {
            if (result) {
              // console.warn(result);
              this.permissions = result as PermissionId[];
            }
            this.store.dispatch(new UI.StopLoading());
          },
          ( ) => {
            this.store.dispatch(new UI.StopLoading());
            this.uiService.showSnackbar(
              'Error al recuperar los datos de permisos',
              'Cerrar',
              3000
            );
          }
        );
    }*/

    /*openWin() {
      const win = window.open('http://localhost:5555/');
  
      const pass_data = {
        token: localStorage.getItem('token'),
        expiration: localStorage.getItem('expiration'),
        username: localStorage.getItem('username')
      };
  
      setTimeout(function() {
        win.postMessage(JSON.stringify(pass_data), 'http://localhost:5555/');
      }, 0);
    }*/
    /*
    public loginFromOutside() {
      this.getMenu();
    }*/

    /*public postLogin(creds: LoginClaims) {
        const headers = this.getLoginHeader();
        const body = this.utilService.toParams({
            username: creds.username,
            password: creds.password,
            grant_type: 'password'
        });

        return this.httpClient.post<TokenDef>(this.tokenEndpoint, body, {
            headers: headers
        });
    }

    public recoverPassword(email: String) {
        const headers = this.getDefaultHeaders();
        return this.httpClient.post(
            this.recoverPasswordURL + '?email=' + email,
            {},
            { headers: headers }
        );
    }*/

    /* public resetPassword(data: any) {
         const headers = this.getDefaultHeaders();
         return this.httpClient.post(this.resetPasswordURL, data, {
             headers: headers
         });
     }
 
     public activateUser(data: ActivateUser) {
         const headers = this.getDefaultHeaders();
         return this.httpClient.post(this.activateUserURL, data, {
             headers: headers
         });
     }*/

    /*
    public login(creds: LoginClaims) {
      this.store.dispatch(new UI.StartLoading());
  
      const headers = this.getTokenHeather();
      const body = this.utilService.toParams({
        username: creds.username,
        password: creds.password,
        grant_type: 'password'
      });
  
      return this.httpClient
        .post<TokenDef>(this.tokenEndpoint, body, {
          headers: headers
        })
  
        .pipe(
          map(response => {
            debugger;
  
            const result = response;
            if (result && result.access_token) {
              this.store.dispatch(new UI.StopLoading());
  
              const expiration = new Date(
                new Date().getTime() + result.expires_in * 1000
              ).getTime();
  
              // Se localStorage values
              localStorage.setItem('token', result.access_token);
              localStorage.setItem('expiration', expiration.toString());
              localStorage.setItem('username', creds.username);
  
              this.getMenu();
              this.getPermissionId();
  
              return true;
            } else {
              this.store.dispatch(new UI.StopLoading());
              return false;
            }
          })
        )
        .subscribe(
          result => {
            debugger;
  
            if (result) {
              this.store.dispatch(new Auth.SetAuthenticated());
            } else {
              this.uiService.showSnackbar(
                'Error al recuperar los datos de Login',
                'Cerrar',
                3000
              );
              this.store.dispatch(new Auth.SetUnauthenticated());
            }
          },
          err => {
            debugger;
  
            this.store.dispatch(new UI.StopLoading());
            if (err.status === 400) {
              this.uiService.showSnackbar(
                'Error: Usuario y/o contraseña incorrectos',
                'Cerrar',
                3000
              );
            } else if (err.status === 0) {
              this.uiService.showSnackbar(
                'Error: No hay conexión con el servidor',
                'Cerrar',
                3000
              );
            }
          }
        );
    }*/

    public logout() {
        this.store.dispatch(new Auth.SetUnauthenticated());
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('expiration');
        sessionStorage.removeItem('menu');
        sessionStorage.removeItem('emenu');
        sessionStorage.removeItem('key');
        sessionStorage.removeItem('permissions');
        localStorage.removeItem('token');
        localStorage.removeItem('expiration');
        localStorage.removeItem('menu');
        localStorage.removeItem('emenu');
        localStorage.removeItem('key');
        localStorage.removeItem('permissions');
        localStorage.removeItem('clientId');
        this.isAuthenticated$.next(this.authenticated);
    }

    public getLoginHeader(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: '305721340fa99aff67b2060542a1bec2'
        });
    }

    public getTokenHeather(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            api_key: '305721340fa99aff67b2060542a1bec2',
            Authorization: 'Bearer ' + this.token
        });
    }

    public getAuthHeather(key = '305721340fa99aff67b2060542a1bec2'): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            api_key: key,
            Authorization: 'Bearer ' + this.token
        });
    }

    /**
     * Api key de sistema clientes
     */
    public getClientApiKey(): string {
        return '82FDC2F3DE63ECF905A862E106D2A38A';
    }

    public getPdfAuthHeather(key = '305721340fa99aff67b2060542a1bec2'): HttpHeaders {
        return new HttpHeaders({
            // 'Content-Type': 'text/html',
            // 'Content-Type': 'application/pdf',
            api_key: key,
            // responseType: 'blob' as 'json',
            // responseType: 'Blob',
            // Accept: 'application/pdf',
            Authorization: 'Bearer ' + this.token
        });
    }

    public getDefaultHeaders(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/json',
            api_key: '305721340fa99aff67b2060542a1bec2'
        });
    }

    public getFileUploadHeader(): HttpHeaders {
        return new HttpHeaders({
            // 'Content-Type': 'multipart/form-data; boundary',
            api_key: '305721340fa99aff67b2060542a1bec2',
            Authorization: 'Bearer ' + this.token
        });
    }

    public getTxtAuthHeather(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'text/plain',
            api_key: '305721340fa99aff67b2060542a1bec2',
            Authorization: 'Bearer ' + this.token
        });
    }

    public getXmlAuthHeather(): HttpHeaders {
        return new HttpHeaders({
            'Content-Type': 'application/xml',
            api_key: '305721340fa99aff67b2060542a1bec2',
            Authorization: 'Bearer ' + this.token
        });
    }

    public isInRole(roleName: string) {
        if (this.authenticated) return this.roles.indexOf(roleName) > -1;
        return false;
    }

    /*public updateValues() {
        if (!this.token) {
            this.roles = [];
        } else {
            this.roles =
                this.decodeToken[
                'http://schemas.microsoft.com/ws/2008/06/identity/claims/role'
                ] || []; // Decodificar formato de Roles de Microsoft
        }
    }*/

    /**
     * Encrypt and decrypt
     */

    // The set method is use for encrypt the value.
    /* crypt(keys: string, value: string) {
         const encrypted = CryptoJS.AES.encrypt(value, keys);
         return encrypted.toString();
     }*/

    // The get method is use for decrypt the value.
    /*decrypt(keys: string, value: string) {
        const bytes = CryptoJS.AES.decrypt(value.toString(), keys);
        return bytes.toString(CryptoJS.enc.Utf8);
    }*/

    /**
     * Obtiene la cuenta de usuario autenticado.
     * Creado: 13/11/2020 joc
     */
    /* getCurrentUserAccount() {
         const url = `${this.endpoint}user/account`;
         console.log(url);
         return this.httpClient.get<any>(url, { headers: this.getAuthHeather() });
     }*/
}
