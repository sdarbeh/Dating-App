import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from './../../_services/auth/auth.service';
import { UserService } from './../../_services/user/user.service';
import { AlertifyService } from './../../_services/alertify/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss'],
})
export class MemberCardComponent implements OnInit {
  @Input() user: User;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {}

  sendLike(): void {
    const currentUserId = this.authService.decodedToken.nameid;
    const recipientName = this.user.knownAs;
    const recipientId = this.user.id;

    this.userService.sendLike(currentUserId, recipientId).subscribe(
      (data) => {
        this.alertify.success(`${recipientName} liked`);
      },
      (err) => {
        this.alertify.error(err);
      }
    );
  }
}
