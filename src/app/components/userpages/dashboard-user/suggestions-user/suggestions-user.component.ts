import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Sugerencia } from 'src/app/modelos/sugerencia';
import { UserService } from 'src/app/services/user.service';
import {MatTableDataSource} from '@angular/material/table';
import {DatePipe} from '@angular/common'

@Component({
  selector: 'app-suggestions-user',
  templateUrl: './suggestions-user.component.html',
  styleUrls: ['./suggestions-user.component.scss']
})
export class SuggestionsUserComponent implements OnInit {

  today: Date = new Date();
  pipe = new DatePipe('en-US');
  displayedColumns: string[] = ['nombre', 'seccion', 'comentario', 'acciones'];
  dataSource = new MatTableDataSource();
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
      timeStamp: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.dataControl.getSuggestions().subscribe((sugerencias) => {
      this.enumSuggest = sugerencias.length;
      this.sugerencias = sugerencias;
      this.dataSource.data = this.getSuggestByUser()
      this.sugerenciaByUser = this.getSuggestByUser()
    });
  }

  async onSubmitAddSuggest() {
    const idAdd = this.comprobarIdSuggest()
    this.formSuggest.controls['id'].setValue(idAdd);
    const email = this.userService.seeEmailUserAuth();
    this.formSuggest.controls['email'].setValue(email);
    const timeStamp = this.pipe.transform(Date.now(), 'dd/MM/yyyy');
    this.formSuggest.controls['timeStamp'].setValue(timeStamp);
    let name,
      lastName = '';
    this.dataControl.searchUserData(email).then(async (response) => {
      name = response.name;
      lastName = response.lastName;
      this.formSuggest.controls['name'].setValue(name);
      this.formSuggest.controls['lastName'].setValue(lastName);
      await this.dataControl.addSuggest(this.formSuggest.value, idAdd);
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
