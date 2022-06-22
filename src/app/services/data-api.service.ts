import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  setDoc,
  getDoc,
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Noticia } from '../modelos/noticia';
import { User } from '../modelos/user';

@Injectable({
  providedIn: 'root',
})
export class DataApiService {
 
  constructor(private firestore: Firestore) {}

  addUser(user: User, email: any) {
    return setDoc(doc(this.firestore, 'Personas', email), user);
  }

  addUserRol(user: User, email: any) {
    return setDoc(doc(this.firestore, 'Roles', email), user);
  }

  getUser(): Observable<User[]> {
    const userRef = collection(this.firestore, 'Personas');
    return collectionData(userRef, { idField: 'email' }) as Observable<User[]>;
  }

  addNoticia(noticia: Noticia, id: string){
    return setDoc(doc(this.firestore, 'Noticias', id), noticia);
  }

  getNoticias(): Observable<Noticia[]>{
    const noticiaRef = collection(this.firestore, 'Noticias')
    return collectionData(noticiaRef, {idField: 'id'}) as Observable<Noticia[]>
  }

  deleteNoticia(id: String){
    const noticiaDocRef = doc(this.firestore, `Noticias/${id}`);
    return deleteDoc(noticiaDocRef)
  }

  async modifiedNoticia(id: any) {
    
    const noticiaRef = doc(this.firestore, 'Noticias', id)
    const respuesta = await getDoc(noticiaRef)
    return respuesta.data()
  }

  async searchUserRol(email:any) {
    const docRef = doc(this.firestore, 'Roles', email);
    const docSnap = await getDoc(docRef);
    const responseUser:any = docSnap.data()
    const rol = responseUser['rol']
    return rol
  }

  /*

  
  */
}
