import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AccountService} from './account.service';
import {Observable} from 'rxjs';
import {Timbrado} from '../models/timbrado';

@Injectable({
    providedIn: 'root'
})

export class TimbradoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/timbrado/';

    public buscarTimbrados(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getTimbrados(all: boolean = false): Observable<Timbrado[]> {
        return this.http.get<Timbrado[]>(this.baseUrl + `?all=${all}`);
    }

    public getTimbradoById(idTimbrado: number): Observable<Timbrado> {
        return this.http.get<Timbrado>(this.baseUrl + `${idTimbrado}`);
    }

    public guardarTimbrado(timbrado: Timbrado): Observable<any> {
        return this.http.post<any>(this.baseUrl, timbrado, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarTimbrado(timbrado: Timbrado): Observable<any> {
        return this.http.put<any>(this.baseUrl, timbrado);
    }

    public eliminarTimbrado(idTimbrado: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idTimbrado}`);
    }
}
