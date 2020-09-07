import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'photoPipe'
})
export class PhotoPipePipe implements PipeTransform {

  transform(photoUrl: string): string {
    return photoUrl ? photoUrl : '../../assets/user.png';
  }

}
