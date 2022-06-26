import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto'
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-contacts-admin',
  templateUrl: './contacts-admin.component.html',
  styleUrls: ['./contacts-admin.component.scss']
})

export class ContactsAdminComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'name', 'address', 'phoneNumber', 'activity', 'actions'];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, {static: true})paginator: MatPaginator | undefined;
  @ViewChild(MatSort, {static: true})sort: MatSort | undefined;
  formContact: FormGroup;
  enumContact: number = 0;
  contactos: Contacto[] = [];



  constructor(private dataControl: DataApiService,
              private toastr: ToastrService,
              ) {
    this.formContact = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3)
      ]),
      address: new FormControl('', [
        Validators.required
      ]),
      phoneNumber: new FormControl('', [
        Validators.required,
        Validators.maxLength(10)
      ]),
      activity: new FormControl('', [
        Validators.required
      ]),
    })



  }

  ngOnInit(): void {
    this.dataControl.getContacts().subscribe((contactos) => {
      this.dataSource.data = contactos;
      this.enumContact = contactos.length;
      this.contactos = contactos;
    });


  }



  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }



  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  async onSubmitAddContact() {

    const idAdd = this.comprobarIdContact();
    console.log(idAdd)
    this.formContact.controls['id'].setValue(idAdd);
    await this.dataControl.addContact(this.formContact.value, idAdd);
    console.log('formulario a enviar: ',this.formContact.value)
    this.formContact.reset();


  }

  comprobarIdContact() {
    const listContacto = this.contactos;
    const idContactoBD = listContacto.map((item) => item.id);
    const idMod = this.formContact.get('id').value;
    console.log('id para modificar: ',idMod)
    let idAdd;
    if(idContactoBD[0] != '1c'){
      idAdd = '1c'
      return idAdd;
    }else {
      for (let item of idContactoBD) {

        if (item == idMod) {
          idAdd = idMod;
          this.toastr.info('El contacto fue modificado con éxito!', 'Contacto modificado', {
            positionClass: 'toast-bottom-right'
          })
          console.log('id para cambiar: ',idAdd)
          return idAdd;
        }
      }
      idAdd = `${this.enumContact + 1}c`;
          this.toastr.success('El contacto fue registrado con exito!', 'Contacto registrado', {
          positionClass: 'toast-bottom-right'
          });
          console.log('id para agregar: ',idAdd)
          return idAdd;

    }

  }

  async deleteContactById(id: any) {
    await this.dataControl.deleteElement(id, 'Contactos');

    this.toastr.error('El contacto fue eliminado con éxito', 'Registro eliminado', {
      positionClass: 'toast-bottom-right'
    });
  }

  fillFormContacto(id: any) {
    this.dataControl.modifiedContact(id).then((response: any) => {
      this.formContact.setValue(response);

    });
  }

  clearForm() {
    this.formContact.reset();
  }

  get name(){
    return this.formContact.get('name');
  }

  get address(){
    return this.formContact.get('address');
  }

  get phoneNumber(){
    return this.formContact.get('phoneNumber');
  }

  get activity(){
    return this.formContact.get('activity');
  }

  getErrorMessageName(){
    if (this.name.hasError('required')) {
      return 'Debe completar el campo'
    }
    return this.name.hasError('pattern') ? 'Mínimo 6 caracteres y sin numeros' : '';
  }

  getErrorMessageAddress(){
    return this.address.hasError('required') ? 'Debe escribir su dirrección' : '';
  }

  getErrorMessagePhoneNumber(){
    if (this.phoneNumber.hasError('required')){
      return  'Debe escribir su número de contacto'
    }
    return this.phoneNumber.hasError('pattern') ? 'Máximo 10 dígitos' : '';
  }

  getErrorMessageActivity(){
    return this.activity.hasError('required') ? 'Debe escribir el servicio de reciclaje que oferta' : '';
  }


}
