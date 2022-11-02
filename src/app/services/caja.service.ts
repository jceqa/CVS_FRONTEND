import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Caja} from '../models/caja';
import {Sucursal} from '../models/sucursal';

@Injectable({
    providedIn: 'root'
})

export class CajaService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/caja/';

    public buscarCajas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getCajas(all: boolean = false): Observable<Caja[]> {
        return this.http.get<Caja[]>(this.baseUrl + `?all=${all}`);
    }

    public getCajaById(idCaja: number): Observable<Caja> {
        return this.http.get<Caja>(this.baseUrl + `${idCaja}`);
    }

    public guardarCaja(caja: Caja): Observable<any> {
        return this.http.post<any>(this.baseUrl, caja, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarCaja(caja: Caja): Observable<any> {
        return this.http.put<any>(this.baseUrl, caja);
    }

    public eliminarCaja(idCaja: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idCaja}`);
    }

    public listCajasBySucursal(sucursales: Sucursal[]): Observable<Caja[]> {
        let url = this.baseUrl + `sucursal/?`;

        let firstTime = true;

        sucursales.forEach(s => {
            if (firstTime) {
                url += `id=${s.id}`;
                firstTime = false;
            } else {
                url += `&id=${s.id}`;
            }
        });

        return this.http.get<Caja[]>(url);
    }
}
