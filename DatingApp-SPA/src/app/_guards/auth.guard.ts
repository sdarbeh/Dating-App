import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './../_services/auth/auth.service';
import { AlertifyService } from './../_services/alertify/alertify.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  canActivate(): boolean {
    if (this.authService.loggedIn()) {
        return true;
    }

    this.alertify.error('You must be logged in');
    this.router.navigate(['/home']);
    return false;
  }
}
