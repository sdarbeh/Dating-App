import { Injectable } from '@angular/core';
import { environment } from './../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { PaginatedResult } from 'src/app/_models/pagination';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  baseUrl = `${environment.apiUrl}users/`;

  constructor(private http: HttpClient) {}

  getUsers(
    page?,
    itemsPerPage?,
    userParams?,
    likeParam?
  ): Observable<PaginatedResult<User[]>> {
    // 'get<User[]>'tells angular type we're receiving
    const paginatedResult: PaginatedResult<User[]> = new PaginatedResult<
      User[]
    >();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    if (userParams != null) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }

    if (likeParam === 'Likers') {
      params = params.append('Likers', 'true');
    }

    if (likeParam === 'Likees') {
      params = params.append('Likees', 'true');
    }

    return this.http
      .get<User[]>(`${this.baseUrl}`, { observe: 'response', params })
      .pipe(
        map((res) => {
          paginatedResult.result = res.body;
          if (res.headers.get('Pagination') != null) {
            paginatedResult.pagination = JSON.parse(
              res.headers.get('Pagination')
            );
          }
          return paginatedResult;
        })
      );
  }

  getUser(id): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}${id}`);
  }

  updateUser(id: number, user: User): any {
    return this.http.put(`${this.baseUrl}${id}`, user);
  }

  setMainPhoto(userId: number, photoId: number): any {
    return this.http.post(
      `${this.baseUrl}${userId}/photos/${photoId}/setMain`,
      {}
    );
  }

  deletePhoto(userId: number, photoId: number): any {
    return this.http.delete(`${this.baseUrl}${userId}/photos/${photoId}`);
  }

  sendLike(id: number, recipientId: number): any {
    return this.http.post(`${this.baseUrl}${id}/like/${recipientId}`, {});
  }
}
