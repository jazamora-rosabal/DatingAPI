import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { AlertifyService } from '../_services/alertify.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { User } from '../_models/user';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  user: User;

  // Configuracion DatePicker
  maxDate = new Date();
  bsConfid: Partial<BsDatepickerConfig>;
  @Input() valuesFromHome: any;
  @Output() cancelRegister = new EventEmitter();

  registerForm: FormGroup;

  constructor(
    private authServices: AuthService,
    private notificationService: AlertifyService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createRegisterForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
    console.log('maxDate :>> ', this.maxDate);
    this.bsConfid = {
      maxDate: this.maxDate,
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD/MM/YYYY',
    };
  }

  /* this.registerForm = new FormGroup(
      {
        username: new FormControl('', Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(8),
        ]),
        confirmPassword: new FormControl('', Validators.required),
      },
      this.passwordMatchValidator
    ); */

  createRegisterForm(): void {
    this.registerForm = this.formBuilder.group(
      {
        gender: ['female'],
        username: ['', Validators.required],
        knownAs: ['', Validators.required],
        dateOfBirth: [null, Validators.required],
        city: ['', Validators.required],
        country: ['', Validators.required],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(8),
          ],
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: [this.passwordMatchValidator, this.moreThan18Years],
      }
    );
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password').value === g.get('confirmPassword').value
      ? null
      : { mismatch: true };
  }

  moreThan18Years(g: FormGroup) {
    const dateOfBirth = new Date(g.get('dateOfBirth').value);
    const today = new Date();
    let age = today.getFullYear() - dateOfBirth.getFullYear();
    dateOfBirth.setFullYear(dateOfBirth.getFullYear() + age);

    if (dateOfBirth.getTime() > today.getTime()) {
      age--;
    }
    return age >= 18 ? null : { isAKid: true };
  }

  register(): void {
    if (this.registerForm.valid) {
      this.user = Object.assign({}, this.registerForm.value);
      this.authServices.registerAction(this.user).subscribe(
        () => {
          this.notificationService.successDialog( 'Register Successful' );
        },
        error => {
          this.notificationService.errorDialog(error);
        },
        () => {
          if ( !this.authServices.loggedIn() ){
            this.authServices.loginAction(this.user).subscribe(() => {
                this.router.navigate(['/members']);
            }, error => {
              this.notificationService.errorDialog(error);
            });
          }else{
            this.router.navigate(['/members']);
          }
        }
      );
    } else {
      return;
    }
    /*  */

    console.log(this.registerForm.value);
  }

  cancel(): void {
    this.cancelRegister.emit(false);
    console.log('cancelled');
  }

  // ADD CLASS VALIDATIONS

  addClassToUserNameValid(): string {
    if (this.isFieldHasError('username')) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToKnownAsValid(): string {
    if (this.isFieldHasError('knownAs')) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToDateOfBirthValid(): string {
    if (
      this.isFieldHasError('dateOfBirth') ||
      (this.registerForm.get('dateOfBirth').touched &&
        this.registerForm.hasError('isAKid'))
    ) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToCityValid(): string {
    if (this.isFieldHasError('city')) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToCountryValid(): string {
    if (this.isFieldHasError('country')) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToPasswordValid(): string {
    if (this.isFieldHasError('password')) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  addClassToConfirmPasswordValid(): string {
    if (
      this.isFieldHasError('confirmPassword') ||
      (this.registerForm.get('confirmPassword').touched &&
        this.registerForm.hasError('mismatch'))
    ) {
      return 'is-invalid';
    }
    return 'is-valid';
  }

  isFieldHasError(fieldName: string): boolean {
    return this.registerForm.get(fieldName).errors &&
      this.registerForm.get(fieldName).touched
      ? true
      : false;
  }

  checkFieldRequird(fieldName: string): boolean {
    return this.registerForm.get(fieldName).touched &&
      this.registerForm.get(fieldName).hasError('required')
      ? true
      : false;
  }

  isFieldTouched(fieldName: string): boolean {
    return this.registerForm.get(fieldName).touched;
  }
}
