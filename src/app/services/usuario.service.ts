import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';
import {AccountService} from './account.service';
import {UsuarioDto} from '../models/usuarioDto';

@Injectable({
    providedIn: 'root'
})

export class UsuarioService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/usuario/';

    public signIn(userData: Usuario): Observable<any> {
        return this.http.post<any>(this.baseUrl + `validar`, userData);
    }

    public getUserByToken(token: string): Observable<Usuario> {
        return this.http.get<Usuario>(this.baseUrl + `token/?token=${token}`);
    }

    public getUsuarios(all: boolean = false): Observable<UsuarioDto[]> {
        return this.http.get<UsuarioDto[]>(this.baseUrl + `?all=${all}`);
    }

    public getUsuarioById(idUsuario: number): Observable<UsuarioDto> {
        return this.http.get<UsuarioDto>(this.baseUrl + `${idUsuario}`);
    }

    public guardarUsuario(usuarioDto: UsuarioDto): Observable<any> {
        return this.http.post<any>(this.baseUrl, usuarioDto, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarUsuario(usuarioDto: UsuarioDto): Observable<any> {
        return this.http.put<any>(this.baseUrl, usuarioDto);
    }

    public eliminarUsuario(idUsuario: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idUsuario}`);
    }
}
