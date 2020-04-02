import { environment } from './../../environments/environment.prod';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { Stat } from '../interfaces/stat.model';

@Injectable({providedIn: 'root'})
export class StatService {

  constructor(private http: HttpClient) {}

  getStatById(id: number): Observable<Stat[]> {
    return this.http.get<Stat[]>(`${environment.apiUrl}api/getstats?id=${id}`);
  }

}
