import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { AlertifyService } from './../../_services/alertify/alertify.service';
import { NgForm } from '@angular/forms';
import { UserService } from './../../_services/user/user.service';
import { AuthService } from './../../_services/auth/auth.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss'],
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm', { static: true }) editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  user: User;
  photoUrl: string;
  userId: number = this.authService.decodedToken.nameid;

  unloadNotification($event: any): any {
    if (this.editForm.dirty) {
      $event.returnValue = true;
    }
  }

  constructor(
    private service: UserService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
    this.authService.currentPhotoUrl.subscribe(
      (photoUrl) => (this.photoUrl = photoUrl)
    );
  }

  updateUser(): void {
    this.service
      .updateUser(this.userId, this.user)
      .subscribe(
        (next) => {
          this.alertify.success('Changeds saved');
          this.editForm.reset(this.user);
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }

  updateMainPhoto(photoUrl): void {
    // url is passed from the child event
    this.user.photoUrl = photoUrl;
  }
}
