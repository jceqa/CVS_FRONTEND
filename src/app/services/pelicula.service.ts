import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario';
import { Critica } from '../models/critica';
import { Pelicula } from '../models/pelicula';

@Injectable({
  providedIn: 'root'
})
export class PeliculaService {

  private baseUrl = "api/pelicula/";

  constructor(private http : HttpClient) { }

  listPeliculas(limit:number, offset:number): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}?limit=${limit}&offset=${offset}`)
  }

  getPelicula(id : number) : Observable<Pelicula>{
    return this.http.get<any>(`${this.baseUrl}/${id}`)
  }

  getCriticas(id : number): Observable<Critica[]>{
    return this.http.get<any>(`${this.baseUrl}/${id}/criticas`) 
  }

  getComentarios(id : number) : Observable<Comentario[]>{
    return this.http.get<any>(`${this.baseUrl}/${id}/comentarios`)
  }
}
