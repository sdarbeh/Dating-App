import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/_models/user';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;
currentUser: User;
photoUrl = new BehaviorSubject<string>('../../../assets/user.png');
currentPhotoUrl = this.photoUrl.asObservable();

constructor(private http: HttpClient) { }

changeMemberPhoto(photoUrl: string): void {
  this.photoUrl.next(photoUrl);
}

login(model: any): any {
  return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((user: any) => {
        if (user) {
          const { token, currentUser } = user;
          //
          localStorage.setItem('token', token);
          localStorage.setItem('currentUser', JSON.stringify(currentUser));
          //
          this.decodedToken = this.jwtHelper.decodeToken(token);
          this.currentUser = currentUser;
          //
          this.changeMemberPhoto(this.currentUser.photoUrl);
        }
      })
    );
  }

  register(user: User): any {
    return this.http.post(this.baseUrl + 'register', user);
  }

  loggedIn(): any {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
