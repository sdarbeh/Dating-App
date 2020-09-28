import { Component, OnInit } from '@angular/core';
import { User } from './../../_models/user';
import { UserService } from './../../_services/user/user.service';
import { AlertifyService } from './../../_services/alertify/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination, PaginatedResult } from 'src/app/_models/pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss'],
})
export class MemberListComponent implements OnInit {
  users: User[];
  genderList = [
    { value: 'all', display: 'All' },
    { value: 'male', display: 'Males' },
    { value: 'female', display: 'Females' },
  ];
  userParams: any = {};
  pagination: Pagination;

  constructor(
    private userService: UserService,
    private alertify: AlertifyService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.data.subscribe((data) => {
      const { result, pagination } = data.users;
      this.users = result;
      this.pagination = pagination;
    });
    this.resetFilters();
  }

  pagedChanged(event: any): void {
    this.pagination.CurrentPage = event.page;
    this.loadUsers();
  }

  resetFilters(): void {
    this.userParams.gender = 'all';
    this.userParams.minAge = 18;
    this.userParams.maxAge = 99;
    this.userParams.orderBy = 'lastActive';
    this.loadUsers();
  }

  loadUsers(): void {
    const { CurrentPage, ItemsPerPage } = this.pagination;

    this.userService
      .getUsers(CurrentPage, ItemsPerPage, this.userParams)
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
