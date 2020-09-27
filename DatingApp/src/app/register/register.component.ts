import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../_services/auth/auth.service';
import { AlertifyService } from '../_services/alertify/alertify.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  @Input() valuesFromHome: any;
  @Output() cancelRegistery = new EventEmitter();

  user: User;
  model: any = {};
  registerForm: FormGroup;

  constructor(
    private router: Router,
    private authService: AuthService,
    private alertify: AlertifyService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
  }

  createRegisterForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(13),
          ],
        ],
        knownAs: ['', Validators.required],
        gender: ['', Validators.required],
        DOB: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(13),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  passwordMatchValidator(g: FormGroup): object {
    const password = g.get('password').value;
    const confirmPassword = g.get('confirmPassword').value;
    //
    return password === confirmPassword ? null : { mismatch: true };
  }

  register(): void {
    const { valid, value } = this.registerForm;

    if (valid) {
      this.user = Object.assign({}, value);

      this.authService.register(this.user).subscribe(
        () => {
          this.alertify.success('registered');
        },
        (err) => {
          this.alertify.error(err);
        },
        () => {
          // on complete
          this.authService.login(this.user).subscribe(() => {
            this.router.navigate(['/members']);
          });
        }
      );
    }
  }

  cancel(): void {
    this.cancelRegistery.emit(false);
  }
}
