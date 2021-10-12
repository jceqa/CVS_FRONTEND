import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usuario } from "../models/usuario";

@Injectable({
    providedIn: 'root'
})
export class LoginService {

    constructor(private http: HttpClient) { }

    private baseUrl = "api/usuario";

    public signIn(userData: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl + `/validar?usuario_usuario=${userData.username}&clave_usuario=${userData.password}`, userData)
    }

    public isLoggedIn() {
        return localStorage.getItem('ACCESS_TOKEN') !== null;
    }

    public logout() {
        localStorage.removeItem('ACCESS_TOKEN');
    }

}
