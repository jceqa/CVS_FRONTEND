import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cargo } from '../models/cargo';
import { AccountService } from './account.service';

@Injectable({
    providedIn: 'root'
})

export class CargoService {

    constructor(private http: HttpClient,
        private accountService: AccountService
    ) { }

    private get headers() {
        return this.accountService.getAuthHeather();
      }

    private baseUrl = 'api/cargo/';

    public buscarCargos(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getCargos(all: boolean = false): Observable<Cargo[]> {
        return this.http.get<Cargo[]>(this.baseUrl + `?all=${all}`);
    }

    public getCargoById(idCargo: number): Observable<Cargo> {
        return this.http.get<Cargo>(this.baseUrl + `${idCargo}`);
    }

    public guardarCargo(cargo: Cargo): Observable<any> {
        return this.http.post<any>(this.baseUrl, cargo, {
            headers: this.headers,
            observe: 'response'
          });
    }

    public editarCargo(cargo: Cargo): Observable<any> {
        return this.http.put<any>(this.baseUrl, cargo);
    }

    public eliminarCargo(idCargo: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idCargo}`);
    }
}
