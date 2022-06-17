import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  passwordPattern: any = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}/;


  createFormGroup(){
    return new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.email,
        Validators.minLength(6),
        Validators.pattern(this.emailPattern),
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.passwordPattern),
      ]),
    })
  }

  formLogin: FormGroup;

  constructor(private userService: UserService, private router: Router) {
    this.formLogin = this.createFormGroup();
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.formLogin.valid) {
      this.userService.login(this.formLogin.value)
        .then(response => {
          console.log(response);
          this.router.navigate(['/dashboard-admin']);
        })
        .catch(error => console.log(error));
    } else {
      console.log('No funciona');
    }
  }

  openRegister(){
    this.router.navigate(['/register']);
  }

  openRecover(){
    this.router.navigate(['/recover-password'])
  }

  get email(){
    return this.formLogin.get('email');
  }

  get password(){
    return this.formLogin.get('password');
  }

  getErrorMessageEmail() {
    if (this.email.hasError('required')) {
      return 'Debe ingresar un dirección de correo';
    }
    return this.email.hasError('email') ? 'Debe tener al menos 6 caracteres y ser un correo válido' : '';
  }

  getErrorMessagePassword(){
    if (this.password.hasError('required')) {
      return 'Debe ingresar una contraseña'
    }
    return this.password.hasError('pattern') ? 'Mínimo 6 caracteres, 1 numero, 1 simbolo y sin espacios' : '';
  }
}
