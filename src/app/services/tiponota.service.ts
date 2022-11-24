import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TipoNota} from '../models/tipoNota';
import {AccountService} from './account.service';


@Injectable({
    providedIn: 'root'
})

export class TipoNotaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/tiponota/';

    public buscarTipoNotas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getTipoNotas(all: boolean = false): Observable<TipoNota[]> {
        return this.http.get<TipoNota[]>(this.baseUrl + `?all=${all}`);
    }

    public getTipoNotaById(idTipoNota: number): Observable<TipoNota> {
        return this.http.get<TipoNota>(this.baseUrl + `${idTipoNota}`);
    }

    public guardarTipoNota(tipoNota: TipoNota): Observable<any> {
        return this.http.post<any>(this.baseUrl, tipoNota, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarTipoNota(tipoNota: TipoNota): Observable<any> {
        return this.http.put<any>(this.baseUrl, tipoNota);
    }

    public eliminarTipoNota(idTipoNota: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idTipoNota}`);
    }
}
