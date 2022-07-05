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
  enumNoticias: number = 0;
  noticias: Noticia[] = [];
  verifyNoticias: Noticia[] = [];

  urlNoticia: any = null;
  selectedFile: any = null;

  plantillaImage: any = {
    MedioAmbiente:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Fmedioambiente.jpg?alt=media&token=e49add10-456c-40b0-81f5-e41af9c1a783',
    Orgánicos:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Forganicos.jpg?alt=media&token=2f2467bd-5417-4175-89ad-706b8444a4d5',
    Reciclaje:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Freciclaje.jpg?alt=media&token=cb69ee6d-8974-4dcf-9a8b-663b54ef96c8',
    Covid19:
      'https://firebasestorage.googleapis.com/v0/b/testinsercionjson.appspot.com/o/plantillaImages%2Fcovid19.jpg?alt=media&token=3c3364e5-cc84-49e5-a0a7-0131f4a99ce1',
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
      noticiaPic: new FormControl(''),
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
    const noticiaPic = this.formNoticia.get('noticiaPic').value;
    const urlNoticia = this.urlNoticia;
    console.log('nombre noticias subida: ', urlNoticia)
    console.log('url noticia desde la base: ', noticiaPic)
    if ((urlNoticia == null) && (noticiaPic == null)) {
      const baseImages = this.plantillaImage;
      const category = this.formNoticia.get('category').value;
      for (let nameImage in baseImages) {
        if (nameImage == category) {
          const responseUrlImage = baseImages[nameImage];
          this.formNoticia.controls['noticiaPic'].setValue(responseUrlImage);
        }
      }
    } 
    if(urlNoticia){
        this.formNoticia.controls['noticiaPic'].setValue(urlNoticia);
    }

    const idAdd = this.comprobarId();
    if (idAdd != -1) {
      this.formNoticia.controls['id'].setValue(idAdd);
      await this.dataControl.addNoticia(this.formNoticia.value, idAdd);
      console.log(this.formNoticia.value);
      this.formNoticia.reset();
      this.selectedFile = null;
      this.urlNoticia = null;
    } else {
      this.dataControl
        .identifiedIdElement('GlobalNews')
        .then((response) => {
          let idGlobal = response['lastitemNew'];
          idGlobal++;
          const idAdd = `${idGlobal}n`;
          this.toastr.success(
            'La noticia fue registrada con exito!',
            'Noticia registrada',
            {
              positionClass: 'toast-bottom-right',
            }
          );
          const idElement = { lastitemNew: idGlobal };
          this.dataControl.addGlobalIdElement('GlobalNews', idElement);
          this.formNoticia.controls['id'].setValue(idAdd);
          this.dataControl.addNoticia(this.formNoticia.value, idAdd);
          console.log('formulario a enviar: ', this.formNoticia.value);
          this.formNoticia.reset();
          this.selectedFile = null;
          this.urlNoticia = null;
        });
    }
  }

  comprobarId() {
    const listElement = this.noticias;
    const idBD = listElement.map((item) => item.id);
    const idMod = this.formNoticia.get('id').value;
    let idAdd;
    for (let item of idBD) {
      if (item == idMod) {
        idAdd = idMod;
        this.toastr.info(
          'El contacto fue modificado con éxito!',
          'Contacto modificado',
          {
            positionClass: 'toast-bottom-right',
          }
        );
        return idAdd;
      }
    }
    return -1;
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
