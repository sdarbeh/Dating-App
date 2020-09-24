import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  registerMode = false;

  values: any;

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.getValues();
  }

  onRegisterClick() {
    this.registerMode = true;
  }

  getValues() {
    this.http.get('https://localhost:5001/api/values').subscribe(res => {
      this.values = res;
    }, err => {
      console.log(err);
    });
  }

  cancelRegisterMode(registerMode: boolean) {
    this.registerMode = registerMode;
  }

}
