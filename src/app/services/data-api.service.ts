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
import { Contacto } from '../modelos/contacto';
import { Noticia } from '../modelos/noticia';
import { Recomendacion } from '../modelos/recomendacion';
import { User } from '../modelos/user';
import { Video } from '../modelos/video';

@Injectable({
  providedIn: 'root',
})
export class DataApiService {
 
  constructor(private firestore: Firestore) {}

  //Funciones para manejar usuarios
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

  async searchUserRol(email:any) {
    const docRef = doc(this.firestore, 'Roles', email);
    const docSnap = await getDoc(docRef);
    const responseUser:any = docSnap.data()
    const rol = responseUser['rol']
    return rol
  }

  //Funciones para manejar noticias

  addNoticia(noticia: Noticia, id: string){
    return setDoc(doc(this.firestore, 'Noticias', id), noticia);
  }

  getNoticias(): Observable<Noticia[]>{
    const noticiaRef = collection(this.firestore, 'Noticias')
    return collectionData(noticiaRef, {idField: 'id'}) as Observable<Noticia[]>
  }

  async modifiedNoticia(id: any) {
    const noticiaRef = doc(this.firestore, 'Noticias', id)
    const respuesta = await getDoc(noticiaRef)
    return respuesta.data()
  }

  //Funciones para manejar videos

  addVideo(video: Video, id: string){
    return setDoc(doc(this.firestore, 'Videos', id), video);
  }

  getVideos(): Observable<Video[]>{
    const videoRef = collection(this.firestore, 'Videos')
    return collectionData(videoRef, {idField: 'id'}) as Observable<Video[]>
  }

  async modifiedVideo(id: any) {
    const videoRef = doc(this.firestore, 'Videos', id)
    const respuesta = await getDoc(videoRef)
    return respuesta.data()
  }

  //Funciones para manejar recomendaciones

  addRecommendation(recomen: Recomendacion, id: string){
    return setDoc(doc(this.firestore, 'Recomendaciones', id), recomen);
  }

  getRecommendations(): Observable<Recomendacion[]>{
    const recomenRef = collection(this.firestore, 'Recomendaciones')
    return collectionData(recomenRef, {idField: 'id'}) as Observable<Recomendacion[]>
  }

  async modifiedRecommendation(id: any) {
    const recomenRef = doc(this.firestore, 'Recomendaciones', id)
    const respuesta = await getDoc(recomenRef)
    return respuesta.data()
  }

   //Funciones para manejar contactos

   addContact(contacto: Contacto, id: string){
    return setDoc(doc(this.firestore, 'Contactos', id), contacto);
  }

  getContacts(): Observable<Contacto[]>{
    const contactRef = collection(this.firestore, 'Contactos')
    return collectionData(contactRef, {idField: 'id'}) as Observable<Contacto[]>
  }

  async modifiedContact(id: any) {
    const contactRef = doc(this.firestore, 'Contactos', id)
    const respuesta = await getDoc(contactRef)
    return respuesta.data()
  }

  //Funciones generales de control de elementos

  deleteElement(id: String, path: String){
    const noticiaDocRef = doc(this.firestore, `${path}/${id}`);
    return deleteDoc(noticiaDocRef)
  }

  

  
}
