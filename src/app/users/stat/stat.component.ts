import { UserService } from './../../services/user.service';
import { Component, OnInit } from '@angular/core';
import { StatData } from 'src/app/interfaces/stat-data.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stat',
  templateUrl: './stat.component.html',
  styleUrls: ['./stat.component.scss']
})
export class StatComponent implements OnInit {

  data: StatData = {
    users: [],
    currentPage: 1,
    totalPages: 0
  };

  pages = [];

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.usersChange$.subscribe( users => {
      this.data = users;
      if (users.totalPages > 5) {
        if (users.currentPage <= 3) {
          this.pages = [1, 2, 3, 4, 5];
        } else if (users.currentPage >= users.totalPages - 2) {
          this.pages = [users.totalPages - 4, users.totalPages - 3, users.totalPages - 2, users.totalPages - 1, users.totalPages];
        } else {
          this.pages = [];
          for (let i = 1; i <= 5; i++) {
            this.pages.push(this.data.currentPage - 3 + i);
          }
        }
      } else {
        for (let i = 1; i <= users.totalPages; i++) {
          this.pages.push(i);
        }
      }
     });

    this.userService.fetch();
  }

  onNextPage() {
    this.userService.nextPage();
  }

  onPrevPage() {
    this.userService.prevPage();
  }

  onSelectPage(page: number) {
    this.userService.selectPage(page);
  }

  onUserSelect(id: number, firstName: string, lastName: string) {

    this.userService.userName$.next(firstName + ' ' + lastName);
    this.router.navigate(['users', id]);
  }
}
