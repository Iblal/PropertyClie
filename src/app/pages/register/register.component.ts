import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';
import { UserForRegistrationDto } from 'src/app/Dtos/UserForRegistrationDto';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: UntypedFormGroup;
  public hide = true;
  public userTypes = [
    { id: 1, name: 'Agent' },
    { id: 2, name: 'Agency' },
    { id: 3, name: 'Buyer' }
  ];
  constructor(public fb: UntypedFormBuilder, public router:Router, public snackBar: MatSnackBar, 
  private authService: AuthenticationService) { }

  ngOnInit() {
    this.registerForm = this.fb.group({
      userType: ['', Validators.required],
      username: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      firstName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      lastName: ['', Validators.compose([Validators.required, Validators.minLength(1)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],                            
    },{validator: matchingPasswords('password', 'confirmPassword')});
  }

  public onRegisterFormSubmit = (registerFormValue) => {
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      userName: formValues.username,
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirmPassword
    };
    this.authService.registerUser("api/accounts/registration", user)
    .subscribe({
      next: (_) => console.log("Successful registration"),
      error: (err: HttpErrorResponse) => console.log(err.error.errors)
    })
  }
}
