import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Deposito} from '../models/deposito';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class DepositoService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/deposito/';

    public buscarDepositos(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getDepositos(all: boolean = false): Observable<Deposito[]> {
        return this.http.get<Deposito[]>(this.baseUrl + `?all=${all}`);
    }

    public getDepositoById(idDeposito: number): Observable<Deposito> {
        return this.http.get<Deposito>(this.baseUrl + `${idDeposito}`);
    }

    public guardarDeposito(deposito: Deposito): Observable<any> {
        return this.http.post<any>(this.baseUrl, deposito, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarDeposito(deposito: Deposito): Observable<any> {
        return this.http.put<any>(this.baseUrl, deposito);
    }

    public eliminarDeposito(idDeposito: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idDeposito}`);
    }
}
