import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user/user.service';
import { AlertifyService } from './../../_services/alertify/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private aletify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      this.user = data.user;
    });
    console.log(this.user.photos.length);
    
  }
}
