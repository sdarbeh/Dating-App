import { Component, Input, OnInit } from '@angular/core';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from 'src/app/_services/alertify/alertify.service';
import { AuthService } from 'src/app/_services/auth/auth.service';
import { MessageService } from './../../_services/message/message.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.scss'],
})
export class MemberMessagesComponent implements OnInit {
  @Input() recipientId: number;
  @Input() recipientName: string;
  curentUserId: number = this.authService.decodedToken.nameid;
  messages: Message[];
  newMessage: any = {};

  constructor(
    private authService: AuthService,
    private messageService: MessageService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(): void {
    this.messageService
      .getMessageThread(this.curentUserId, this.recipientId)
      .pipe(
        tap((messages: any) => {
          messages.forEach((msg: any) => {
            if (
              msg.isRead === false &&
              msg.recipientId === +this.curentUserId
            ) {
              this.messageService.markAsRead(msg.id, this.curentUserId);
            }
          });
        })
      )
      .subscribe(
        (messages) => {
          // sort newest date
          this.sortByDate(messages);
          this.messages = messages;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  sortByDate(messages: any): void {
    messages.sort((a: any, b: any) => {
      return (
        (new Date(a.messageSent) as any) - (new Date(b.messageSent) as any)
      );
    });
  }

  sendMessage(): void {
    this.newMessage.recipientId = this.recipientId;
    this.messageService
      .sendMessage(this.curentUserId, this.newMessage)
      .subscribe(
        (msg: Message) => {
          this.messages.push(msg);
          this.newMessage = '';
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  deleteMessage(id: number): void {
    this.alertify.confirm(
      'Are you sure you want to delete this message?',
      () => {
        this.messageService.deleteMessage(id, this.curentUserId).subscribe(
          () => {
            const messageIndex = this.messages.findIndex((m) => m.id === id);
            this.messages.splice(messageIndex, 1);
            this.alertify.success('Message deleted');
          },
          () => {
            this.alertify.error('Problem deleted message');
          }
        );
      }
    );
  }
}
