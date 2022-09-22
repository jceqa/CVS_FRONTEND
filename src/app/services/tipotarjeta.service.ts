import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TipoTarjeta} from '../models/tipoTarjeta';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class TipoTarjetaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/tipo-tarjeta/';

    public buscarTipoTarjetas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getTipoTarjetas(all: boolean = false): Observable<TipoTarjeta[]> {
        return this.http.get<TipoTarjeta[]>(this.baseUrl + `?all=${all}`);
    }

    public getTipoTarjetaById(idTipoTarjeta: number): Observable<TipoTarjeta> {
        return this.http.get<TipoTarjeta>(this.baseUrl + `${idTipoTarjeta}`);
    }

    public guardarTipoTarjeta(tipotarjeta: TipoTarjeta): Observable<any> {
        return this.http.post<any>(this.baseUrl, tipotarjeta, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarTipoTarjeta(tipotarjeta: TipoTarjeta): Observable<any> {
        return this.http.put<any>(this.baseUrl, tipotarjeta);
    }

    public eliminarTipoTarjeta(idTipoTarjeta: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idTipoTarjeta}`);
    }
}
