import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {TipoArticulo} from '../models/tipoArticulo';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class TipoArticuloService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/tipoarticulo/';

    public buscarCiudades(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getTipoArticulos(all: boolean = false): Observable<TipoArticulo[]> {
        return this.http.get<TipoArticulo[]>(this.baseUrl + `?all=${all}`);
    }

    public getTipoArticuloById(id: number): Observable<TipoArticulo> {
        return this.http.get<TipoArticulo>(this.baseUrl + `/${id}`);
    }


    public guardarTipoArticulo(tipoArticulo: TipoArticulo): Observable<any> {
        return this.http.post<any>(this.baseUrl, tipoArticulo, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarTipoArticulo(tipoArticulo: TipoArticulo): Observable<any> {
        return this.http.put<any>(this.baseUrl, tipoArticulo);
    }

    public eliminarTipoArticulo(id: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${id}`);
    }

}
