import { Injectable } from '@angular/core';
import * as alertify from 'alertifyjs';

@Injectable({
  providedIn: 'root'
})
export class AlertifyService {

constructor() {}

confirm(msg: string, okCallback: () => any): void  {
  alertify.confirm(msg, (e: any) => e ? okCallback() : {});
}

message(msg: string): void  {
  alertify.message(msg);
}

success(msg: string): void {
  alertify.success(msg);
}

error(msg: string): void  {
  alertify.error(msg);
}

warning(msg: string): void  {
  alertify.warning(msg);
}

}
