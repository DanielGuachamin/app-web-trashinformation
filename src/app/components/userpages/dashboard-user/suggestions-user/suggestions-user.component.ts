import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Sugerencia } from 'src/app/modelos/sugerencia';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-suggestions-user',
  templateUrl: './suggestions-user.component.html',
  styleUrls: ['./suggestions-user.component.scss']
})
export class SuggestionsUserComponent implements OnInit {

  formSuggest: FormGroup;
  enumSuggest: number = 0;
  sugerencias: Sugerencia[] = [];
  sugerenciaByUser: Sugerencia[] = [];

  constructor(
    private dataControl: DataApiService,
    private userService: UserService
  ) {
    this.formSuggest = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      section: new FormControl('', [
        Validators.required
      ]),
      comment: new FormControl('', [
        Validators.required
      ]),
    });
  }

  ngOnInit(): void {
    this.dataControl.getSuggestions().subscribe((sugerencias) => {
      this.enumSuggest = sugerencias.length;
      this.sugerencias = sugerencias;
      this.sugerenciaByUser = this.getSuggestByUser()
    });
  }

  async onSubmitAddSuggest() {
    const idAdd = this.comprobarIdSuggest()
    this.formSuggest.controls['id'].setValue(idAdd);
    const email = this.userService.seeEmailUserAuth();
    this.formSuggest.controls['email'].setValue(email);
    let name,
      lastName = '';
    this.dataControl.searchUserData(email).then(async (response) => {
      name = response.name;
      lastName = response.lastName;
      this.formSuggest.controls['name'].setValue(name);
      this.formSuggest.controls['lastName'].setValue(lastName);
      console.log('formulario a enviar: ', this.formSuggest.value);
      //await this.dataControl.addSuggest(this.formSuggest.value, idAdd);
      this.formSuggest.reset();
    });
  }

  async deleteSuggestById(id: any) {
    await this.dataControl.deleteElement(id, 'Sugerencias');
  }

  getSuggestByUser(){
    const listSugerencia = this.sugerencias;
    const email = this.userService.seeEmailUserAuth();
    let sugerenciaByUser: Sugerencia[] =[];
    for(let sugerencia of listSugerencia){
      if(sugerencia.email == email){
        console.log(sugerencia)
        sugerenciaByUser.push(sugerencia)
      }
    
    }
    console.log(sugerenciaByUser)
    return sugerenciaByUser
  }

  comprobarIdSuggest() {
    const listSugerencia = this.sugerencias;
    const idSugerenciaBD = listSugerencia.map((item) => item.id);
    let idAdd;
    let rastrearId = 0;
    if (idSugerenciaBD[0]!= '1s'){
      idAdd = '1s'
      return idAdd;
    }else{
      for (let item of idSugerenciaBD) {
        rastrearId++;
          if (parseInt(item[0]) != rastrearId) {
            console.log('no coincide', rastrearId);
            idAdd = `${rastrearId}n`;
            return idAdd;
          }
      }
      idAdd = `${this.enumSuggest + 1}s`;
      return idAdd;
    }

  }
  
  get section(){
    return this.formSuggest.get('section');
  }

  get comment(){
    return this.formSuggest.get('comment');
  }

  getErrorMessageSection(){
    return this.section.hasError('required') ? 'Debe escribir acerca de que es su opinión' : '';
  }

  getErrorMessageComment(){
    return this.comment.hasError('required') ? 'Debe escribir el contenido de su opinión' : '';
  }

}
