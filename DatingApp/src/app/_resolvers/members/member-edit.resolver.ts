import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { User } from '../../_models/user';
import { UserService } from '../../_services/user/user.service';
import { AuthService } from '../../_services/auth/auth.service';
import { AlertifyService } from '../../_services/alertify/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<User> {
    return this.userService.getUser(this.authService.decodedToken.nameid).pipe(
      catchError((err) => {
        this.alertify.error('Problem retreiving your data');
        this.router.navigate(['/members']);
        return of(null);
      })
    );
  }
}
