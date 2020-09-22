import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() {}

confirm(msg: string, okCallback: () => any) {
  alertify.confirm(msg, (e: any) => e ? okCallback() : {});
}

message(msg: string) {
  alertify.message(msg);
}

success(msg: string) {
  alertify.success(msg);
}

error(msg: string) {
  alertify.error(msg);
}

warning(msg: string) {
  alertify.warning(msg);
}

}
