import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';
import { environment } from './../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

baseUrl = environment.apiUrl + 'auth/';
jwtHelper = new JwtHelperService();
decodedToken: any;

constructor(private http: HttpClient) { }

// tslint:disable-next-line: typedef
login(model: any) {
  return this.http.post(this.baseUrl + 'login', model)
    .pipe(
      map((user: any) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.decodedToken = user.token;
        }
      })
    );
  }

  // tslint:disable-next-line: typedef
  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  // tslint:disable-next-line: typedef
  loggedIn() {
    const token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }
}
