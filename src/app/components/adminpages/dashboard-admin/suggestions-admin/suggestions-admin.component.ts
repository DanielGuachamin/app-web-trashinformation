import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Sugerencia } from 'src/app/modelos/sugerencia';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-suggestions-admin',
  templateUrl: './suggestions-admin.component.html',
  styleUrls: ['./suggestions-admin.component.scss'],
})
export class SuggestionsAdminComponent implements OnInit {
  formSuggest: FormGroup;
  enumSuggest: number = 0;
  sugerencias: Sugerencia[] = [];

  constructor(
    private dataControl: DataApiService,
    private userService: UserService
  ) {
    this.formSuggest = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl(),
      section: new FormControl(),
      comment: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getSuggestions().subscribe((sugerencias) => {
      this.sugerencias = sugerencias;
      this.enumSuggest = sugerencias.length;
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
      await this.dataControl.addSuggest(this.formSuggest.value, idAdd);
      this.formSuggest.reset();
    });
  }

  async deleteSuggestById(id: any) {
    await this.dataControl.deleteElement(id, 'Sugerencias');
  }

  comprobarIdSuggest() {
    const listSugerencia = this.sugerencias;
    const idBD = listSugerencia.map((item) => item.id);
    const idMod = '1s'
    let idAdd;
    for (let item of idBD) {
      if (item != idMod) {
        idAdd = idMod;
        return idAdd;
      } else{
        idAdd = `${this.enumSuggest + 1}s`;
        return idAdd;
      }
    }
    idAdd = `${this.enumSuggest + 1}s`;
    return idAdd;
    
  
  }
}
