import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class StatService {

  constructor(private http: HttpClient) {}

  getStatById(id: number): Observable<any> {
    return this.http.get<any>(`http://localhost:3000/getstat?id=${id}`);
  }

}
