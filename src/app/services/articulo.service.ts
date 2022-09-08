import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Articulo } from '../models/articulo';
import { AccountService } from './account.service';

@Injectable({
  providedIn: 'root'
})

export class ArticuloService {

  constructor(private http: HttpClient,
              private accountService: AccountService
  ) { }

  private get headers() {
    return this.accountService.getAuthHeather();
  }

  private baseUrl = 'api/articulo/';

  public buscarArticulos(cantRegistros: number, pag: number, texto): Observable<any> {
    return this.http.get<any>(this.baseUrl + `buscar/nombre?registros_pagina=${cantRegistros}&pagina=${pag}&buscar_texto=${texto}`);
  }

  public getArticulos(): Observable<Articulo[]> {
    return this.http.get<Articulo[]>(this.baseUrl);
  }

  public getArticuloById(idArticulo: number): Observable<Articulo> {
    return this.http.get<Articulo>(this.baseUrl + `${idArticulo}`);
  }

  public guardarArticulo(articulo: Articulo): Observable<any> {
    return this.http.post<any>(this.baseUrl, articulo, {
      headers: this.headers,
      observe: 'response'
    });
  }

  public editarArticulo(articulo: Articulo): Observable<any> {
    return this.http.put<any>(this.baseUrl, articulo);
  }

  public eliminarArticulo(idArticulo: number): Observable<any> {
    return this.http.delete<any>(this.baseUrl + `${idArticulo}`);
  }
}
