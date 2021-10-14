import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from "../models/usuario";
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import * as Auth from '../reducers/account.actions';
//import { Menu } from '../models/menu';


@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient,
        private store: Store<fromRoot.State>,
    ) { }

    //private _menu: Menu[] = [];

    private baseUrl = "api/usuario/";

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
    }*/

    public signIn(userData: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl + `validar?usuario_usuario=${userData.username}&clave_usuario=${userData.password}`, userData)
    }

    public isLoggedIn() {
        return localStorage.getItem('ACCESS_TOKEN') !== null;
    }

    public logout() {
        this.store.dispatch(new Auth.SetUnauthenticated());
        console.log("Desloguear");
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
        localStorage.removeItem('username');
    }

    public get authenticated(): boolean {
        const username = localStorage.getItem('username');
        return this.isAValidString(username);
    }

    public isAValidString(value: string): boolean {
        if (value !== undefined && value !== null && value != "") {
            //console.log(true);
            return true;
        }
        //console.log(false);
        return false;
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

}
