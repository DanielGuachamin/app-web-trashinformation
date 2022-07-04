import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Recomendacion} from 'src/app/modelos/recomendacion'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-recommendations-admin',
  templateUrl: './recommendations-admin.component.html',
  styleUrls: ['./recommendations-admin.component.scss']
})
export class RecommendationsAdminComponent implements OnInit {

  formRecomen: FormGroup;
  enumRecomen: number = 0;
  recomendaciones: Recomendacion[] = [];

  contentLimitPattern: any = /^[\s\S]{0,150}$/;

  plantillaImage: any = {
    MedioAmbiente:
      'https://firebasestorage.googleapis.com/v0/b/trash-information-appweb.appspot.com/o/plantillaImages%2Fmedioambiente.jpg?alt=media&token=cf74d9ba-7683-4d60-b742-5141625c4057',
    Orgánicos:
      'https://firebasestorage.googleapis.com/v0/b/trash-information-appweb.appspot.com/o/plantillaImages%2Forganicos.jpg?alt=media&token=925c173b-8a51-4037-965d-b25062629c13',
    Reciclaje:
      'https://firebasestorage.googleapis.com/v0/b/trash-information-appweb.appspot.com/o/plantillaImages%2Freciclaje.jpg?alt=media&token=7bd9d00e-0fae-4e30-aaff-71dbeca12b4f',
    Covid19:
      'https://firebasestorage.googleapis.com/v0/b/trash-information-appweb.appspot.com/o/plantillaImages%2Fcovid19.jpg?alt=media&token=9330e991-2f82-4ba5-a2fe-d0db316998dd',
  };

  constructor(
    private dataControl: DataApiService,
    private toastr: ToastrService
  ) {
    this.formRecomen = new FormGroup({
      title: new FormControl('', [
        Validators.required
      ]),
      category: new FormControl('', [
        Validators.required
      ]),
      content: new FormControl('', [
        Validators.required,
        Validators.pattern(this.contentLimitPattern)
      ]),
      urlImage: new FormControl(),
      id: new FormControl()
    })
  }

  ngOnInit(): void {
    this.dataControl.getRecommendations().subscribe((recomendaciones) => {
      this.recomendaciones = recomendaciones;
      this.enumRecomen = recomendaciones.length;
    });
  }

  async onSubmitAddRecomen() {

    const idAdd = this.comprobarId();
    const urlImage = this.formRecomen.get('urlImage').value
    if ((urlImage == null) || (urlImage == '')) {
      const baseImages = this.plantillaImage;
      const category = this.formRecomen.get('category').value;
      for (let nameImage in baseImages) {
        if (nameImage == category) {
          const responseUrlImage = baseImages[nameImage];
          this.formRecomen.controls['urlImage'].setValue(responseUrlImage);
        }
      }
    }
    this.formRecomen.controls['id'].setValue(idAdd);
    await this.dataControl.addRecommendation(this.formRecomen.value, idAdd);
    console.log('formulario a enviar: ',this.formRecomen.value)
    this.formRecomen.reset();
  }

  comprobarId() {
    const listElement = this.recomendaciones;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formRecomen.get('id').value;
    let idAdd;
    let rastrearId = 0;
    let rastrearIdBD;
    for (let item of idBD) {
      if (item == idMod) {
        idAdd = idMod;
        this.toastr.info(
          'La recomendación fue modificada con éxito!',
          'Recomendación modificada',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        return idAdd;
      }
    }
    for (let item of idBD) {
      rastrearId++;
      const idToAdd = `${rastrearId}r`;
      rastrearIdBD = item.substring(0, item.length - 1);
      if (idBD.indexOf(idToAdd) == -1) {
        idAdd = idToAdd;
        console.log('id que falta: ', idAdd);
        this.toastr.success(
          'La recomendación fue registrada con exito!',
          'Recomendación registrada',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        return idAdd;
      }

    }
    idAdd = `${this.enumRecomen + 1}r`;
    this.toastr.success(
      'La recomendación fue registrada con exito!',
      'Recomendación registrada',
      {
        positionClass: 'toast-bottom-right',
      }
    );
    console.log('id a añadir', idAdd);
    return idAdd;
  }

  async deleteRecomenById(id: any) {
    await this.dataControl.deleteElement(id, 'Recomendaciones');

    this.toastr.error('La recomendación fue eliminada con éxito!', 'Recomendación eliminada', {
      positionClass: 'toast-bottom-right'
    });
    this.formRecomen.reset();
  }

  fillFormRecomen(id: any) {
    this.dataControl.modifiedRecommendation(id).then((response: any) => {
      this.formRecomen.setValue(response);
    });
  }

  clearForm() {
    this.formRecomen.reset();
  }

  get title(){
    return this.formRecomen.get('title');
  }

  get category(){
    return this.formRecomen.get('category');
  }

  get content(){
    return this.formRecomen.get('content');
  }

  getErrorMessageTitle(){
    return this.title.hasError('required') ? 'Debe escribir un título para la recomendación' : '';
  }

  getErrorMessageCategory(){
    return this.category.hasError('required') ? 'Debe elegir una categoría para la recomendación' : '';
  }

  getErrorMessageContent(){
    if(this.content.hasError('required')){
      return 'Debe escribir el contenido de su recomendación'
    }
    return this.content.hasError('pattern') ? 'Límite máximo de caracteres es 150' : '';
  }


}
