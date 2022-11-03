import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Formulario} from '../models/formulario';
import {Injectable} from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FormularioService {
    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/formulario/';

    public buscarFormularios(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getFormularios(all: boolean = false): Observable<Formulario[]> {
        return this.http.get<Formulario[]>(this.baseUrl + `?all=${all}`);
    }

    public getFormularioById(idFormulario: number): Observable<Formulario> {
        return this.http.get<Formulario>(this.baseUrl + `${idFormulario}`);
    }

    public guardarFormulario(formulario: Formulario): Observable<any> {
        return this.http.post<any>(this.baseUrl, formulario, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarFormulario(formulario: Formulario): Observable<any> {
        return this.http.put<any>(this.baseUrl, formulario);
    }

    public eliminarFormulario(idFormulario: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idFormulario}`);
    }
}
