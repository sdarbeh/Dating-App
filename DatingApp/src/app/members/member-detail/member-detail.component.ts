import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { ActivatedRoute } from '@angular/router';
import { TabsetComponent } from 'ngx-bootstrap/tabs';
import {
  NgxGalleryAnimation,
  NgxGalleryImage,
  NgxGalleryOptions,
} from '@kolkov/ngx-gallery';

@Component({
  selector: 'app-member-detail',
  templateUrl: './member-detail.component.html',
  styleUrls: ['./member-detail.component.scss'],
})
export class MemberDetailComponent implements OnInit {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  @ViewChild('memberTabs', { static: true }) memberTabs: TabsetComponent;
  user: User;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    // gallery
    this.galleryOptions = [
      {
        width: '500px',
        height: '500px',
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: true,
      },
    ];

    const { data, queryParams } = this.route;
    // tab params
    queryParams.subscribe((params) => {
      let selectedTab = params.tab;

      if (!selectedTab || selectedTab > 3) {
        selectedTab = 0;
      }

      this.memberTabs.tabs[selectedTab].active = true;
    });

    // user data
    // tslint:disable-next-line: no-shadowed-variable
    data.subscribe((data) => {
      this.user = data.user;
      this.galleryImages = this.getImages();
    });
  }

  getImages(): NgxGalleryImage[] {
    const imageUrls = [];
    this.user.photos.forEach((photo) => {
      imageUrls.push({
        small: photo?.url,
        medium: photo?.url,
        big: photo?.url,
      });
    });
    return imageUrls;
  }

  selectTab(tabId: number): void {
    this.memberTabs.tabs[tabId].active = true;
  }
}
