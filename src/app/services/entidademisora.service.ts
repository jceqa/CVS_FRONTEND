import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EntidadEmisora} from '../models/entidadEmisora';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class EntidadEmisoraService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = 'api/entidad-emisora/';

    public buscarEntidadEmisoras(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getEntidadEmisoras(all: boolean = false): Observable<EntidadEmisora[]> {
        return this.http.get<EntidadEmisora[]>(this.baseUrl + `?all=${all}`);
    }

    public getEntidadEmisoraById(idEntidadEmisora: number): Observable<EntidadEmisora> {
        return this.http.get<EntidadEmisora>(this.baseUrl + `${idEntidadEmisora}`);
    }

    public guardarEntidadEmisora(entidademisora: EntidadEmisora): Observable<any> {
        return this.http.post<any>(this.baseUrl, entidademisora, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarEntidadEmisora(entidademisora: EntidadEmisora): Observable<any> {
        return this.http.put<any>(this.baseUrl, entidademisora);
    }

    public eliminarEntidadEmisora(idEntidadEmisora: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idEntidadEmisora}`);
    }
}
