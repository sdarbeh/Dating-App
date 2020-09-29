import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { UserService } from './../../_services/user/user.service';
import { AlertifyService } from './../../_services/alertify/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    const { data, queryParams } = this.route;
    // tslint:disable-next-line: no-shadowed-variable
    data.subscribe((data) => {
      this.user = data.user;
    });
    queryParams.subscribe((params) => {
      const selectedTab = params.tab;
      this.memberTabs.tabs[selectedTab > 3 ? 0 : selectedTab].active = true;
    });
  }

  selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }
}
