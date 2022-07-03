import { Component, OnInit } from '@angular/core';
import { DataApiService } from 'src/app/services/data-api.service';
import { Contacto } from 'src/app/modelos/contacto'
import { MatDialog} from '@angular/material/dialog'
import { MapComponent} from '../../../dialogs/map/map.component'

@Component({
  selector: 'app-contacts-user',
  templateUrl: './contacts-user.component.html',
  styleUrls: ['./contacts-user.component.scss']
})
export class ContactsUserComponent implements OnInit {

  contactos: Contacto[] = [];

  constructor(
    private dataControl: DataApiService,
    public dialog: MatDialog
    ) { }

  ngOnInit(): void {
    this.dataControl.getContacts().subscribe((contactos) => {
      this.contactos = contactos;
    });
  }

  openDialog(){
    const dialogRef = this.dialog.open(MapComponent, {
      width: '350px',
      data: 'Esto es el modal de explicacion'
    });
    dialogRef.afterClosed().subscribe(res => {
      console.log(res);
      if(res){
        console.log('Borrar')
      }
    });
  }

}
