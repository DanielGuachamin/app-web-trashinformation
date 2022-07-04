import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import {
  Storage,
  ref,
  uploadBytes,
  getDownloadURL,
} from '@angular/fire/storage';
import { Noticia } from 'src/app/modelos/noticia';
import { ToastrService } from 'ngx-toastr';

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
  verifyNoticias: Noticia[] = [];
  urlNoticia: string = '';

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
    private storage: Storage,
    private toastr: ToastrService
  ) {
    this.formNoticia = new FormGroup({
      title: new FormControl('', [Validators.required]),
      category: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      author: new FormControl('', [Validators.required]),
      url: new FormControl('', [Validators.required]),
      id: new FormControl(),
      noticiaPic: new FormControl(),
    });
  }

  ngOnInit(): void {
    this.dataControl.getNoticias().subscribe((noticias) => {
      this.noticias = noticias;
      this.verifyNoticias = noticias;
      this.enumNoticias = noticias.length;
    });
  }

  async onSubmitAddNoticia() {
    const nameNoticiaImage = this.selectedFile;
    if (nameNoticiaImage == null) {
      const baseImages = this.plantillaImage;
      const category = this.formNoticia.get('category').value;
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
    const idAdd = this.comprobarId();
    this.formNoticia.controls['id'].setValue(idAdd);
    await this.dataControl.addNoticia(this.formNoticia.value, idAdd);
    console.log(this.formNoticia.value);
    this.formNoticia.reset();
    
  }

  comprobarId() {
    const listElement = this.noticias;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formNoticia.get('id').value;
    let idAdd;
    let rastrearId = 0;
    let rastrearIdBD;
    for (let item of idBD) {
      rastrearId++;
      const idToAdd = `${rastrearId}n`;
      rastrearIdBD = item.substring(0, item.length - 1);
      if (idBD.indexOf(idToAdd) == -1) {
        idAdd = idToAdd;
        console.log('id que falta: ', idAdd);
        this.toastr.success(
          'La noticia fue registrada con exito!',
          'Noticia registrada',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        return idAdd;
      }
      if (item == idMod) {
        idAdd = idMod;
        this.toastr.info(
          'La noticia fue modificada con éxito!',
          'Noticia modificada',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        return idAdd;
      }
    }
    idAdd = `${this.enumNoticias + 1}n`;
    this.toastr.success(
      'La noticia fue registrada con exito!',
      'Noticia registrada',
      {
        positionClass: 'toast-bottom-right',
      }
    );
    console.log('id a añadir', idAdd);
    return idAdd;
  }

  async deleteNoticiaById(id: any) {
    await this.dataControl.deleteElement(id, 'Noticias');
    this.toastr.error(
      'La noticia fue eliminada con éxito!',
      'Noticia eliminada',
      {
        positionClass: 'toast-bottom-right',
      }
    );
    this.formNoticia.reset();
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
      this.urlNoticia = url;
    });
  }

  fillFormNoticia(id: any) {
    this.dataControl.modifiedNoticia(id).then((response: any) => {
      this.formNoticia.setValue(response);
    });
  }

  clearForm() {
    this.formNoticia.reset();
  }

  get title() {
    return this.formNoticia.get('title');
  }

  get category() {
    return this.formNoticia.get('category');
  }

  get description() {
    return this.formNoticia.get('description');
  }

  get author() {
    return this.formNoticia.get('author');
  }

  get url() {
    return this.formNoticia.get('url');
  }

  getErrorMessageTitle() {
    return this.title.hasError('required')
      ? 'Debe escribir un título para la noticia'
      : '';
  }

  getErrorMessageCategory() {
    return this.category.hasError('required')
      ? 'Debe elegir una categoría para la noticia'
      : '';
  }

  getErrorMessageDescription() {
    return this.description.hasError('required')
      ? 'Debe escribir una descripción para la noticia'
      : '';
  }

  getErrorMessageAuthor() {
    return this.author.hasError('required')
      ? 'Debe escribir un autor para la noticia'
      : '';
  }

  getErrorMessageUrl() {
    return this.url.hasError('required')
      ? 'Debe ingresar la fuente bibliográfica donde se encuentra la noticia'
      : '';
  }
}
