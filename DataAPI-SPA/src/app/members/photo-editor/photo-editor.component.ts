import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css'],
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() changeMainPhoto = new EventEmitter<string>();
  currentMainPhoto: Photo;

  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  baseUrl = environment.apiUrl;

  constructor(
    private authService: AuthService,
    private notification: AlertifyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    console.log(this.photos);
    this.initializeUploader();
  }

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url:
        this.baseUrl +
        'users/' +
        this.authService.decodedToken.nameid +
        '/photos',
      authToken: 'Bearer ' + localStorage.getItem('token'),
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024,
    });

    this.hasBaseDropZoneOver = false;

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false;
    };

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const objResponse: Photo = JSON.parse(response);
        const photo = {
          id: objResponse.id,
          url: objResponse.url,
          dateAdd: objResponse.dateAdd,
          description: objResponse.description,
          isMain: objResponse.isMain,
        };
        this.photos.push(photo);
      }
    };

    this.uploader.onErrorItem = (item, response, status, headers) => {
      if (response) {
        this.notification.errorDialog(response);
      }
    };
  }

  setMainPhoto(photo: Photo) {
    this.userService
      .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
      .subscribe(
        () => {
          console.log('Successfully set to main');
          this.currentMainPhoto = this.photos.filter((p) => p.isMain)[0];
          this.currentMainPhoto.isMain = false;
          photo.isMain = true;
          this.authService.changeMemberPhoto(photo.url);
          this.authService.updateMainPhotoCurrentUser(photo.url);
        },
        (error) => {
          this.notification.errorDialog(error);
        }
      );
  }

  deletePhoto(photo: Photo) {
    this.notification.confirmDialog(
      'Are you sure you want to delete this photo?',
      () => {
        this.userService
          .deleteFPhoto(this.authService.decodedToken.nameid, photo.id)
          .subscribe(
            () => {
              this.photos.splice(this.photos.findIndex(photoObj => photoObj.id === photo.id), 1);
              this.notification.successDialog('Photo has been deleted.');
            },
            (error) => {
              this.notification.errorDialog(error);
            }
          );
      }
    );
  }
}
