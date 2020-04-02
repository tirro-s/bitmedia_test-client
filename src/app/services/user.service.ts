import { StatData } from '../interfaces/stat-data.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, BehaviorSubject } from 'rxjs';

import { User } from '../interfaces/user.model';
import { environment } from 'src/environments/environment';


@Injectable({providedIn: 'root'})
export class UserService {

  usersChange$ = new Subject<StatData>();
  userName$ = new BehaviorSubject<string>(null);

  users: User[] = [];
  currentPage = 1;
  itemsPerPage = 50;
  totalPages = 0;

  constructor(private http: HttpClient) {}

  startIndex = () => {
    return (this.currentPage) * this.itemsPerPage - this.itemsPerPage;
  }

  createData = () => {
    return {
      users: this.users.slice(this.startIndex(), this.startIndex() + this.itemsPerPage),
      currentPage: this.currentPage,
      totalPages: this.totalPages
    };
  }

  fetch() {
    if (this.users.length === 0) {
      this.http.get<User[]>(`${environment.apiUrl}api/getusers`).subscribe( users => {
        this.users = users;
        this.totalPages = Math.floor(this.users.length / this.itemsPerPage);
        this.usersChange$.next(this.createData());
      });
    } else {
      this.usersChange$.next(this.createData());
    }
  }

  nextPage() {
    if (this.currentPage >= this.totalPages) {
      return;
    }
    this.currentPage++;
    this.usersChange$.next(this.createData());
  }

  prevPage() {
    if (this.currentPage <= 1) {
      return;
    }
    this.currentPage--;
    this.usersChange$.next(this.createData());
  }

  selectPage(page: number) {
    this.currentPage = page;
    this.usersChange$.next(this.createData());
  }

}
