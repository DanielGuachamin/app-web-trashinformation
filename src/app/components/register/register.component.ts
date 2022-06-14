import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataApiService } from 'src/app/services/data-api.service';
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

  alfabetWithOutSpacePattern: any = /^[A-Za-z\s]+$/;

  formReg: FormGroup;
  formBuilder: any;

  constructor(
    private userService: UserService,
    private router: Router,
    private userControl: DataApiService
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
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.alfabetWithOutSpacePattern)
      ]),
      lastname: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(this.alfabetWithOutSpacePattern)
      ]),
      direction: new FormControl('', [
        Validators.required
      ]),
      rol: new FormControl('finalUser')
    })
  }

  ngOnInit(): void {}

  onSubmit(){
    
    this.userService.register(this.formReg.get('email').value, this.formReg.get('password').value)
      .then(async response => {
        this.formReg.removeControl('password');
        await this.userControl.addUser(this.formReg.value)
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

  get name(){
    return this.formReg.get('name');
  }

  get lastname(){
    return this.formReg.get('lastname');
  }

  get direction(){
    return this.formReg.get('direction');
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

  getErrorMessageNameLastname(){
    if (this.name.hasError('required')) {
      return 'Debe completar el campo'
    }
    return this.name.hasError('pattern') ? 'Mínimo 6 caracteres, sin numeros y sin espacios' : '';
  }

  getErrorMessageDirection(){
    return this.direction.hasError('required') ? 'Debe seleccionar un sector de domicilio' : '';
  }

  closeRegister() {
    this.router.navigate(['/login']);
  }
}