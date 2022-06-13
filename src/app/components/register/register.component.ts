import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
//import { AngularFireStorage } from '@angular/fire/compat/storage';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {

  emailPattern: any = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  passwordPattern: any = /^(?=.*[a-z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{6,15}/;

  formReg: FormGroup;

  constructor(
    private userService: UserService,
    private router: Router
    ) {
    this.formReg = new FormGroup({
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

  ngOnInit(): void {}

  onSubmit(){
    this.userService.register(this.formReg.value)
      .then(response => {
        console.log(response);
        this.router.navigate(['/login']);
      })
      .catch(error => console.error(error));
  }

  get email(){
    return this.formReg.get('email');
  }

  get password(){
    return this.formReg.get('password');
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

  closeRegister() {
    this.router.navigate(['/login']);
  }
}