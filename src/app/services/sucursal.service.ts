import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Sucursal} from '../models/sucursal';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class SucursalService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/sucursal/';

    public buscarSucursales(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getSucursales(all: boolean = false): Observable<Sucursal[]> {
        return this.http.get<Sucursal[]>(this.baseUrl + `?all=${all}`);
    }

    public getSucursalById(idSucursal: number): Observable<Sucursal> {
        return this.http.get<Sucursal>(this.baseUrl + `${idSucursal}`);
    }

    public guardarSucursal(sucursal: Sucursal): Observable<any> {
        return this.http.post<any>(this.baseUrl, sucursal, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarSucursal(sucursal: Sucursal): Observable<any> {
        return this.http.put<any>(this.baseUrl, sucursal);
    }

    public eliminarSucursal(idSucursal: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idSucursal}`);
    }
}
