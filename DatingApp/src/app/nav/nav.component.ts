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
  photoUrl: string;

  constructor(
    public authService: AuthService,
    private alertify: AlertifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }
  
  login(): void {
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

  loggedIn(): boolean {
    return this.authService.loggedIn();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    //
    this.authService.decodedToken = null;
    this.authService.currentUser = null;
    //
    this.alertify.message('Logged out');
    this.router.navigate(['/home']);
  }

  getTimeOfDay(): string {
    const today = new Date();
    const curHr = today.getHours();

    if (curHr < 12) {
      return 'Good morning';
    } else if (curHr < 18) {
      return 'Good afternoon';
    } else {
      return 'Good evening';
    }
  }
}
