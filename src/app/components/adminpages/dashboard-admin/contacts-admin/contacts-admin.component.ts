import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto'
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';

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
  

  constructor(private dataControl: DataApiService) {
    this.formContact = new FormGroup({
      id: new FormControl(),
      name: new FormControl(),
      address: new FormControl(),
      phoneNumber: new FormControl(),
      activity : new FormControl(),
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
    
    this.formContact.controls['id'].setValue(idAdd);
    await this.dataControl.addContact(this.formContact.value, idAdd);
    console.log('formulario a enviar: ',this.formContact.value)
    this.formContact.reset();
  }

  comprobarIdContact() {
    const listVideo = this.contactos;
    const idNoticiaBD = listVideo.map((item) => item.id);
    const idMod = this.formContact.get('id').value;
    let idAdd;
    for (let item of idNoticiaBD) {
      if (item == idMod) {
        idAdd = idMod;
      
        return idAdd;
      }
    }
    idAdd = `${this.enumContact + 1}c`;
   
    return idAdd;
  }

  async deleteContactById(id: any) {
    await this.dataControl.deleteElement(id, 'Contactos');
  }

  fillFormContacto(id: any) {
    this.dataControl.modifiedContact(id).then((response: any) => {
      this.formContact.setValue(response);
    });
  }

  clearForm() {
    this.formContact.reset();
  }

}
