import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {AperturaCierreCaja} from '../models/aperturaCierreCaja';

@Injectable({
    providedIn: 'root'
})

export class AperturaCierreCajaService {
    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/aperturacierrecaja/';

    public buscarAperturaCierreCajas(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getAperturaCierreCajas(all: boolean = false): Observable<AperturaCierreCaja[]> {
        return this.http.get<AperturaCierreCaja[]>(this.baseUrl + `?all=${all}`);
    }

    public getAperturaCierreCajaById(idAperturaCierreCaja: number): Observable<AperturaCierreCaja> {
        return this.http.get<AperturaCierreCaja>(this.baseUrl + `${idAperturaCierreCaja}`);
    }

    public guardarAperturaCierreCaja(aperturaCierreCaja: AperturaCierreCaja): Observable<any> {
        return this.http.post<any>(this.baseUrl, aperturaCierreCaja, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarAperturaCierreCaja(aperturaCierreCaja: AperturaCierreCaja): Observable<any> {
        return this.http.put<any>(this.baseUrl, aperturaCierreCaja);
    }

    public eliminarAperturaCierreCaja(idAperturaCierreCaja: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idAperturaCierreCaja}`);
    }

    public anularAperturaCierreCaja(aperturaCierreCaja: AperturaCierreCaja): Observable<any> {
        return this.http.put<any>(this.baseUrl + 'anular', aperturaCierreCaja);
    }

    public getAperturaCierreCajaAbiertaBySucursal(idSucursal: number): Observable<AperturaCierreCaja[]> {
        return this.http.get<AperturaCierreCaja[]>(this.baseUrl + `abiertos?idSucursal=${idSucursal}`);
    }
}
