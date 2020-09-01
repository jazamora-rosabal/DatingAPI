import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  constructor() {}

  successDialog(message: string) {
    alertify.success(message);
  }

  errorDialog(message: string) {
    alertify.error(message);
  }

  warningDialog(message: string) {
    alertify.warning(message);
  }

  messageDialog(message: string) {
    alertify.message(message);
  }

  confirmDialog(message: string, okCallback: () => any) {
    alertify.confirm(message, (e: any) => {
      if (e) {
        okCallback();
      } else {
      }
    });
  }
}
