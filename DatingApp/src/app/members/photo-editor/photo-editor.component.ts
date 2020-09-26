import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { Photo } from './../../_models/photo';
import { environment } from './../../../environments/environment';
import { AuthService } from './../../_services/auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { UserService } from './../../_services/user/user.service';
import { AlertifyService } from './../../_services/alertify/alertify.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.scss'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() getMemberPhotoChange = new EventEmitter<string>();
  uploader: FileUploader;
  hasBaseDropZoneOver = false;
  baseUrl = `${environment.apiUrl}users/`;
  currentMainPhoto: Photo;
  userId: number = this.authService.decodedToken.nameid;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}

  ngOnInit(): void {
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: `${this.baseUrl}${this.userId}/photos`,
      authToken: `Bearer ${localStorage.getItem('token')}`,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });
    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };
    this.uploader.onSuccessItem = (item, response, status, header) => {
      if (response) {
        const res: Photo = JSON.parse(response);
        const photo = {
          id: res.id,
          url: res.url,
          created: res.created,
          description: res.description,
          isMain: res.isMain,
        };
        this.photos.push(photo);
      }
    };
  }

  setMainPhoto(photo: Photo): void {
    this.userService.setMainPhoto(this.userId, photo.id).subscribe(
      () => {
        // filters for the current main photo(CMP) -- returns array of one
        this.currentMainPhoto = this.photos.filter((p) => p.isMain === true)[0];
        // sets CMP to false
        this.currentMainPhoto.isMain = false;
        // sets new main photo url to parent component -- member edit
        this.authService.changeMemberPhoto(photo.url);
        // sets user in memory photoUrl
        this.authService.currentUser.photoUrl = photo.url;
        // photos will default back because user is being set in local storage
        // updating solves problem
        localStorage.setItem(
          'currentUser',
          JSON.stringify(this.authService.currentUser)
        );
        // sets the selected photo to the main photo
        photo.isMain = true;
        this.alertify.success('Updated main photo');
      },
      (err: string) => {
        this.alertify.error(err);
      }
    );
  }

  deletePhoto(photoId: number): void {
    this.alertify.confirm('Are you sure you want to delete this photo?', () => {
      ///
      this.userService.deletePhoto(this.userId, photoId).subscribe(
        () => {
          // removes deleted photo from array
          const indexToRemove = this.photos.findIndex((p) => p.id === photoId);
          this.photos.splice(indexToRemove, 1);
          this.alertify.success('Photo deleted');
        },
        (err: any) => {
          this.alertify.error('Failed to delete photo');
        }
      );
    });
  }
}
