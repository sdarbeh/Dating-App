import { Component, Input, OnInit } from '@angular/core';
import { Photo } from './../../_models/photo';

@Component({
  selector: 'app-member-photo-card',
  templateUrl: './member-photo-card.component.html',
  styleUrls: ['./member-photo-card.component.scss'],
})
export class MemberPhotoCardComponent implements OnInit {
  @Input() photo: Photo;

  constructor() {}

  ngOnInit(): void {}
}
