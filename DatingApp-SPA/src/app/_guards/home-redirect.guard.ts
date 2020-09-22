import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './../_services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class HomeRedirectGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (this.authService.loggedIn()) {
      this.router.navigate(['/members']);
      return false;
    }

    return true;
  }
}
