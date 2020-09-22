import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { AlertifyService } from '../_services/alertify/alertify.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  model: any = {};

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  // tslint:disable-next-line: typedef
  ngOnInit() {}

  // tslint:disable-next-line: typedef
  login() {
    this.authService.login(this.model).subscribe(
      (next) => {
        this.alertify.success('Logged in successfull');
      },
      (err) => {
        // on error
        this.alertify.error('Failed to log in');
      },
      () => {
        // on success/completed
        this.router.navigate(['/members']);
      }
    );
  }

  // tslint:disable-next-line: typedef
  loggedIn() {
    return this.authService.loggedIn();
  }

  // tslint:disable-next-line: typedef
  logout() {
    localStorage.removeItem('token');
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }
}
