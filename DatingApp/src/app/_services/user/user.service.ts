import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.apiUrl}users/`;

  constructor(private http: HttpClient) {}

  // Observable are just that — things you wish to observe and take action on
  getUsers(): Observable<User[]> {
    // 'get<User[]>'tells angular type we're receiving
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${id}`);
  }

  updateUser(id: number, user: User): any {
    return this.http.put(`${this.baseUrl}${id}`, user);
  }

  setMainPhoto(userId: number, photoId: number): any {
    return this.http.post(`${this.baseUrl}${userId}/photos/${photoId}/setMain`, {});
  }
}
