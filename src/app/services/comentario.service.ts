import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Comentario } from '../models/comentario';

@Injectable({
  providedIn: 'root'
})
export class ComentarioService {

  constructor(private http : HttpClient) { }

  private baseUrl = "api/comentario/";

  public guardar(data: Comentario, token : string) : Observable<any>{
    return this.http.post<any>(this.baseUrl, data, 
      {headers : new HttpHeaders().set('X-CSRFToken', token)})
  }
}
