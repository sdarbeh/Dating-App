import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user/user.service';
import { AlertifyService } from '../../_services/alertify/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ListsResolver implements Resolve<User[]> {
  pageNumber = 1;
  pageSize = 5;
  likeParam = 'Likers';

  constructor(
    private userService: UserService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User[]> {
    return this.userService
      .getUsers(this.pageNumber, this.pageSize, null, this.likeParam)
      .pipe(
        catchError((err) => {
          this.alertify.error('Problem retreiving data');
          this.router.navigate(['/home']);
          return of(null);
        })
      );
  }
}
