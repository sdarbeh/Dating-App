import { Injectable } from '@angular/core';
import { PaginatedResult } from 'src/app/_models/pagination';
import { environment } from 'src/environments/environment';
import { Message } from './../../_models/message';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  baseUrl = `${environment.apiUrl}users/`;

  constructor(private http: HttpClient) {}

  getMessages(id: number, page?: any, itemsPerPage?: any, messageContainer?: any): any {
    // 'get<Message[]>'tells angular type we're receiving
    const paginatedResult: PaginatedResult<Message[]> = new PaginatedResult<Message[]>();

    let params = new HttpParams();

    if (page != null && itemsPerPage != null) {
      params = params.append('pageNumber', page);
      params = params.append('pageSize', itemsPerPage);
    }

    params = params.append('MessageContainer', messageContainer);

    return this.http
    // returning message array
    .get<Message[]>(`${this.baseUrl}${id}/messages`,
    { observe: 'response', params })
      .pipe(
        map((res) => {
          const paginationHeader = res.headers.get('Pagination');
          paginatedResult.result = res.body;

          if (paginationHeader != null) {
            paginatedResult.pagination = JSON.parse(
              paginationHeader
            );
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipentId: number): any {
    return this.http.get<Message[]>(`${this.baseUrl}${id}/messages/thread/${recipentId}`);
  }

  sendMessage(id: number, message: Message): any {
    return this.http.post(`${this.baseUrl}${id}/messages/`, message);
  }

  deleteMessage(id: number, userId: number): any {
    return this.http.post(`${this.baseUrl}${userId}/messages/${id}`, {});
  }

  markAsRead(id: number, userId: number): any {
    return this.http.post(`${this.baseUrl}${userId}/messages/${id}/read`, {}).subscribe();
  }
}
