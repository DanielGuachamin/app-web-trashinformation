import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { ToastrService } from 'ngx-toastr';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';

@Component({
  selector: 'app-profile-user',
  templateUrl: './profile-user.component.html',
  styleUrls: ['./profile-user.component.scss']
})
export class ProfileUserComponent implements OnInit {

  formProfile: FormGroup;
  profilePic: String = '';
  email: String = '';
  selectedFile: any = null;
  urlProfilePic: string = '';

  alfabetWithOutSpacePattern: any = /^(?!.*[0-9])[a-zA-ZÀ-ÿ\u00f1\u00d1]+(\s*[a-zA-ZÀ-ÿ\u00f1\u00d1]*)*[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/;

  constructor(
    private userService: UserService, 
    private router: Router,
    private dataControl: DataApiService,
    private toastr: ToastrService,
    private storage: Storage
    ) {
      this.formProfile = new FormGroup({
        email: new FormControl(''),
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(3),
          Validators.pattern(this.alfabetWithOutSpacePattern)
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.pattern(this.alfabetWithOutSpacePattern)
        ]),
        direccionBase: new FormControl('', [
          Validators.required
        ]),
        birthdate: new FormControl(''),
        profilePic: new FormControl('')
      })
    }

  ngOnInit(): void {
    this.getProfileUser()
  }

  async onModifiedProfile() {
    const email = this.userService.seeEmailUserAuth();
    const nameProfileImage = this.selectedFile;
    const getDate = this.getDate()
    this.formProfile.controls['birthdate'].setValue(getDate)
    if (nameProfileImage != null) {
      const urlImage = this.urlProfilePic;
      this.formProfile.controls['profilePic'].setValue(urlImage);
    }
    
    await this.dataControl.addUser(this.formProfile.value, email);
    this.toastr.success('Perfil modificado con éxito!', 'Perfil modificado', {
      positionClass: 'toast-bottom-right'
      });
    console.log('formulario perfil: ', this.formProfile.value, email);
    this.getProfileUser()
  }

  getProfileUser(){
    const email = this.userService.seeEmailUserAuth();
    this.dataControl.getProfile(email).then((response: any) => {
      this.formProfile.setValue(response);
      const profilePic = this.formProfile.get('profilePic').value
      this.profilePic = profilePic
      const email = this.formProfile.get('email').value
      this.email = email
      let birthdateBD = this.formProfile.get('birthdate').value
      let split = birthdateBD.split('/')
      birthdateBD = split[2] + '/' + split[1] + '/' + split[0] 
      this.formProfile.controls['birthdate'].setValue(new Date(birthdateBD))
    })
  }

  uploadNoticiaImage($event: any) {
    this.selectedFile = $event.target.files[0] ?? null;
    const file = $event.target.files[0];
    const formName = this.formProfile.get('name').value
    const formLastname = this.formProfile.get('lastName').value
    const fileName = `${formName.toLowerCase()}_${formLastname.toLowerCase()}_22.jpg`
    const imgRef = ref(this.storage, `userImages/${fileName}`);

    uploadBytes(imgRef, file)
      .then((response) => {
        console.log(response);
        this.getProfileImageUrl(`userImages/${fileName}`);
      })
      .catch((error) => console.log(error));
  }

  getProfileImageUrl(path: string) {
    getDownloadURL(ref(this.storage, path)).then((url) => {
      this.urlProfilePic = url;
    });
  }

  get name(){
    return this.formProfile.get('name');
  }

  get lastName(){
    return this.formProfile.get('lastName');
  }

  get direccionBase(){
    return this.formProfile.get('direccionBase');
  }

  
  get birthdate(){
    return this.formProfile.get('birthdate');
  }
  

  getDate(){
    let momentResponse = this.formProfile.value
    momentResponse = JSON.parse(JSON.stringify(momentResponse))
    momentResponse = momentResponse.birthdate
    momentResponse = momentResponse.slice(0,-14)
    let split = momentResponse.split('-')
    momentResponse = split[2] + '/' + split[1] + '/' + split[0]
    return momentResponse
  }

  getErrorMessageNameLastname(){
    if (this.name.hasError('required')) {
      return 'Debe completar el campo'
    }
    return this.name.hasError('pattern') ? 'Mínimo 6 caracteres, sin numeros y sin espacios' : '';
  }

  getErrorMessageDirection(){
    return this.direccionBase.hasError('required') ? 'Debe seleccionar un sector de domicilio' : '';
  }

  getErrorMessageBirthday(){
    return this.birthdate.hasError('required') ? 'Debe seleccionar una fecha de nacimiento' : '';
  }

  singOut(){
    this.userService.logout()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch(error => console.log(error));
  }

}
