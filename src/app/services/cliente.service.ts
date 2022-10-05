import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Cliente} from '../models/cliente';
import {AccountService} from './account.service';

@Injectable({
    providedIn: 'root'
})

export class ClienteService {

    constructor(private http: HttpClient,
                private accountService: AccountService
    ) {
    }

    private get headers() {
        return this.accountService.getAuthHeather();
    }

    private baseUrl = 'api/cliente/';

    public buscarClientes(cantRegistros: number, pag: number, texto): Observable<any> {
        return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
    }

    public getClientes(all: boolean = false): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.baseUrl + `?all=${all}`);
    }

    public getClienteById(idCliente: number): Observable<Cliente> {
        return this.http.get<Cliente>(this.baseUrl + `${idCliente}`);
    }

    public guardarCliente(cliente: Cliente): Observable<any> {
        return this.http.post<any>(this.baseUrl, cliente, {
            headers: this.headers,
            observe: 'response'
        });
    }

    public editarCliente(cliente: Cliente): Observable<any> {
        return this.http.put<any>(this.baseUrl, cliente);
    }

    public eliminarCliente(idCliente: number): Observable<any> {
        return this.http.delete<any>(this.baseUrl + `${idCliente}`);
    }
}
