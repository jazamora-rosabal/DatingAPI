import { Injectable, OnInit } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root',
})
export class AlertifyService {
  position: string;

  constructor() {
    this.changePositions('bottom-left');
  }

  changePositions(newPosition: string) {
    this.position = newPosition;
    alertify.set('notifier', 'position', this.position);
  }

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
