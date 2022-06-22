import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import {
  Storage,
  ref,
  uploadBytes,
  //listAll,
  getDownloadURL,
} from '@angular/fire/storage';
import { Noticia } from 'src/app/modelos/noticia';

@Component({
  selector: 'app-news-admin',
  templateUrl: './news-admin.component.html',
  styleUrls: ['./news-admin.component.scss'],
})
export class NewsAdminComponent implements OnInit {
  formNoticia: FormGroup;
  selectedFile: any = null;
  enumNoticias: number = 0;
  noticias: Noticia[] = [];
  urlNoticia: string = '';
  fillNoticia: Noticia[] = [];

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

  constructor(private dataControl: DataApiService, private storage: Storage) {
    this.formNoticia = new FormGroup({
      title: new FormControl(),
      category: new FormControl(),
      description: new FormControl(),
      author: new FormControl(),
      url: new FormControl(),
      id: new FormControl(),
      noticiaPic: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getNoticias().subscribe((noticias) => {
      //console.log(noticias);
      this.noticias = noticias;
      this.enumNoticias = noticias.length;
    });
  }

  async onSubmitAddNoticia() {
    //console.log('formulario noticia: ', this.formNoticia.value)
    const idAdd = this.comprobarIdNoticia();
    const nameNoticiaImage = this.selectedFile;

    if (nameNoticiaImage == null) {
      const baseImages = this.plantillaImage;
      const category = this.formNoticia.get('category').value;
      console.log(category);
      for (let nameImage in baseImages) {
        if (nameImage == category) {
          const responseUrlImage = baseImages[nameImage];

          this.formNoticia.controls['noticiaPic'].setValue(responseUrlImage);
        }
      }
    } else {
      const urlNoticia = this.urlNoticia;
      this.formNoticia.controls['noticiaPic'].setValue(urlNoticia);
    }

    this.formNoticia.controls['id'].setValue(idAdd);
    await this.dataControl.addNoticia(this.formNoticia.value, idAdd);
    this.formNoticia.reset();
  }

  comprobarIdNoticia() {
    const listNoticia = this.noticias;
    const idNoticiaBD = listNoticia.map((item) => item.id);
    const idMod = this.formNoticia.get('id').value;
    let idAdd;
    for (let item of idNoticiaBD) {
      if (item == idMod) {
        
        idAdd = idMod;

        return idAdd;
      }
    }
    idAdd = `${this.enumNoticias + 1}n`;
    return idAdd;
  }

  async deleteNoticiaById(id: any) {
    await this.dataControl.deleteNoticia(id);
  }

  uploadNoticiaImage($event: any) {
    this.selectedFile = $event.target.files[0] ?? null;
    const file = $event.target.files[0];

    const imgRef = ref(this.storage, `noticiasImages/${file.name}`);

    uploadBytes(imgRef, file)
      .then((response) => {
        console.log(response);
        this.getNoticiaImageUrl(`noticiasImages/${file.name}`);
      })
      .catch((error) => console.log(error));
  }

  getNoticiaImageUrl(path: string) {
    getDownloadURL(ref(this.storage, path)).then((url) => {
      //console.log('Url de la imagen: ', url)
      this.urlNoticia = url;
    });
  }

  fillFormNoticia(id: any) {
    this.dataControl.modifiedNoticia(id).then((response: any) => {
      const FormNoticia = response;
      this.formNoticia.setValue(response);
    });
  }

  clearForm(){
    this.formNoticia.reset();
  }
}
