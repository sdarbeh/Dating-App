import { Component, OnInit } from '@angular/core';
import { User } from '../_models/user';
import { PaginatedResult, Pagination } from 'src/app/_models/pagination';
import { AuthService } from '../_services/auth/auth.service';
import { UserService } from '../_services/user/user.service';
import { AlertifyService } from '../_services/alertify/alertify.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  users: User[];
  pagination: Pagination;
  likesParam: string;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private route: ActivatedRoute,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { result, pagination } = data.likeUsers;
      this.users = result;
      this.pagination = pagination;
    });
    this.likesParam = 'Likers';
  }

  pagedChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadUsers();
  }

  loadUsers(): void {
    const { CurrentPage, ItemsPerPage } = this.pagination;

    this.userService
      .getUsers(CurrentPage, ItemsPerPage, null, this.likesParam)
      .subscribe(
        (res: PaginatedResult<User[]>) => {
          this.users = res.result;
          this.pagination = res.pagination;
        },
        (err) => {
          this.alertify.error(err);
        }
      );
  }
}
