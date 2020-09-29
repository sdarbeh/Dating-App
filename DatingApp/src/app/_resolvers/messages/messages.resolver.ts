import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router } from '@angular/router';
import { Message } from './../../_models/message';
import { MessageService } from './../../_services/message/message.service';
import { AlertifyService } from '../../_services/alertify/alertify.service';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './../../_services/auth/auth.service';

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  pageNumber = 1;
  pageSize = 5;
  // default from api
  messageContainer = 'Unread';
  userId = this.authService.decodedToken.nameid;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private router: Router,
    private alertify: AlertifyService
  ) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {
    return this.messageService.getMessages(this.userId, this.pageNumber, this.pageSize, this.messageContainer).pipe(
      catchError((err) => {
        this.alertify.error('Problem retreiving messages');
        this.router.navigate(['/home']);
        return of(null);
      })
    );
  }
}
