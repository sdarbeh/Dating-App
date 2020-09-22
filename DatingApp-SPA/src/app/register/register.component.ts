import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { AlertifyService } from '../_services/alertify/alertify.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  @Input() valuesFromHome: any;
  @Output() cancelRegistery = new EventEmitter();


  model: any = {};

  constructor(private authService: AuthService, private alertify: AlertifyService) { }

  ngOnInit() {
    
  }

  register() {
    this.authService.register(this.model).subscribe(() => {
      this.alertify.success('registered');
    }, err => {
      this.alertify.error(err);
    });
  }

  cancel() {
    this.cancelRegistery.emit(false);
  }

}
