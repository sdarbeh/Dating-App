import { Component, OnInit } from '@angular/core';
import { Message } from '../_models/message';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from '../_services/auth/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from '../_services/alertify/alertify.service';
import { MessageService } from './../_services/message/message.service';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  // default from api
  messageContainer: 'Unread';
  curentUserId: number = this.authService.decodedToken.nameid;

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { result, pagination } = data.messages;
      this.messages = result;
      this.pagination = pagination;
    });
  }

  pagedChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadMessages();
  }

  loadMessages(): void {
    const { CurrentPage, ItemsPerPage } = this.pagination;

    this.messageService
      .getMessages(this.curentUserId, CurrentPage, ItemsPerPage, this.messageContainer)
      .subscribe(
        (res: PaginatedResult<Message[]>) => {
          console.log(res);
          this.messages = res.result;
          this.pagination = res.pagination;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  deleteMessage(id: number): void {
    this.alertify.confirm('Are you sure you want to delete this message?', () => {
      this.messageService.deleteMessage(id, this.curentUserId).subscribe(() => {
        const messageIndex = this.messages.findIndex(m => m.id === id);
        this.messages.splice(messageIndex, 1);
        this.alertify.success('Message deleted');
      }, err => {
        this.alertify.error('Problem deleted message');
      });
    });
  }
}
