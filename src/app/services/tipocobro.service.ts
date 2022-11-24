import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {TipoCobro} from '../models/tipoCobro';

@Injectable({
    providedIn: 'root'
})

export class TipoCobroService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/tipocobro/';

    public buscarTipoCobros(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getTipoCobros(all: boolean = false): Observable<TipoCobro[]> {
        return this.http.get<TipoCobro[]>(this.baseUrl + `?all=${all}`);
    }

    public getTipoCobroById(idTipoCobro: number): Observable<TipoCobro> {
        return this.http.get<TipoCobro>(this.baseUrl + `${idTipoCobro}`);
    }

    public guardarTipoCobro(tipoCobro: TipoCobro): Observable<any> {
        return this.http.post<any>(this.baseUrl, tipoCobro, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarTipoCobro(tipoCobro: TipoCobro): Observable<any> {
        return this.http.put<any>(this.baseUrl, tipoCobro);
    }

    public eliminarTipoCobro(idTipoCobro: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idTipoCobro}`);
    }
}
