import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Ajuste} from '../models/ajuste';

@Injectable({
    providedIn: 'root'
})

export class AjusteService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/ajuste/';

    public buscarAjustes(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getAjustes(all: boolean = false): Observable<Ajuste[]> {
        return this.http.get<Ajuste[]>(this.baseUrl + `?all=${all}`);
    }

    public getAjusteById(idAjuste: number): Observable<Ajuste> {
        return this.http.get<Ajuste>(this.baseUrl + `${idAjuste}`);
    }

    public guardarAjuste(ajuste: Ajuste): Observable<any> {
        return this.http.post<any>(this.baseUrl, ajuste, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarAjuste(ajuste: Ajuste): Observable<any> {
        return this.http.put<any>(this.baseUrl, ajuste);
    }

    public eliminarAjuste(idAjuste: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idAjuste}`);
    }

    public anularAjuste(ajuste: Ajuste): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', ajuste);
    }

    public processAjuste(ajuste: Ajuste): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'procesar', ajuste);
    }

    public listAjustesPendientes(): Observable<Ajuste[]> {
        return this.http.get<Ajuste[]>(this.baseUrl + 'pendientes');
    }

}
