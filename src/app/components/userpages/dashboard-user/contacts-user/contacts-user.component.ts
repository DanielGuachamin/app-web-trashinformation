import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto'

@Component({
  selector: 'app-contacts-user',
  templateUrl: './contacts-user.component.html',
  styleUrls: ['./contacts-user.component.scss']
})
export class ContactsUserComponent implements OnInit {

  contactos: Contacto[] = [];

  constructor(private dataControl: DataApiService) { }

  ngOnInit(): void {
    this.dataControl.getContacts().subscribe((contactos) => {
      this.contactos = contactos;
    });
  }

}
