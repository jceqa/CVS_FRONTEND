import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Menu} from '../models/menu';

@Injectable({
    providedIn: 'root'
})

export class MenuService {

    constructor(private http: HttpClient,
    ) { }

    private baseUrl = 'api/menu/';

    public getMenu(): Observable<Menu> {
        return this.http.get<Menu>(this.baseUrl);
    }
}
