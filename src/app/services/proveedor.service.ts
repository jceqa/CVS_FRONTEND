import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Proveedor} from '../models/proveedor';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class ProveedorService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/proveedor/';

    public buscarProveedores(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getProveedores(): Observable<Proveedor[]> {
        return this.http.get<Proveedor[]>(this.baseUrl);
    }

    public getProveedorById(idProveedor: number): Observable<Proveedor> {
        return this.http.get<Proveedor>(this.baseUrl + `${idProveedor}`);
    }

    public guardarProveedor(proveedor: Proveedor): Observable<any> {
        return this.http.post<any>(this.baseUrl, proveedor, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarProveedor(proveedor: Proveedor): Observable<any> {
        return this.http.put<any>(this.baseUrl, proveedor);
    }

    public eliminarProveedor(idProveedor: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idProveedor}`);
    }
}
