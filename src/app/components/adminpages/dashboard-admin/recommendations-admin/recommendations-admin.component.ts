import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Recomendacion} from 'src/app/modelos/recomendacion'

@Component({
  selector: 'app-recommendations-admin',
  templateUrl: './recommendations-admin.component.html',
  styleUrls: ['./recommendations-admin.component.scss']
})
export class RecommendationsAdminComponent implements OnInit {

  formRecomen: FormGroup;
  enumRecomen: number = 0;
  recomendaciones: Recomendacion[] = [];

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
  ) {
    this.formRecomen = new FormGroup({
      title: new FormControl(),
      category: new FormControl(),
      content: new FormControl(),
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
    
    const idAdd = this.comprobarIdRecomen();
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

  comprobarIdRecomen() {
    const listVideo = this.recomendaciones;
    const idNoticiaBD = listVideo.map((item) => item.id);
    const idMod = this.formRecomen.get('id').value;
    let idAdd;
    for (let item of idNoticiaBD) {
      if (item == idMod) {
        idAdd = idMod;

        return idAdd;
      }
    }
    idAdd = `${this.enumRecomen + 1}r`;
    return idAdd;
  }

  async deleteRecomenById(id: any) {
    await this.dataControl.deleteElement(id, 'Recomendaciones');
  }

  fillFormRecomen(id: any) {
    this.dataControl.modifiedRecommendation(id).then((response: any) => {
      this.formRecomen.setValue(response);
    });
  }

  clearForm() {
    this.formRecomen.reset();
  }

}
