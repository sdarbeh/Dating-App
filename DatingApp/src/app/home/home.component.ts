import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  registerMode = false;

  values: any;

  constructor() {}

  ngOnInit(): void {}

  onRegisterClick(): void  {
    this.registerMode = true;
  }

  cancelRegisterMode(registerMode: boolean): void  {
    this.registerMode = registerMode;
  }
}
