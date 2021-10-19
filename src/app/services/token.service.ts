import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})

export class TokenService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = "api/token/";

    public getUser(token: string): Observable<any> {
        return this.http.get<any>(this.baseUrl + `usuario?token=${token}`)
    }
}