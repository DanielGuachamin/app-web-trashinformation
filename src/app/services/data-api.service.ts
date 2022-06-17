import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class DataApiService {

  constructor(private firestore: Firestore) { }

  addUser(user: User){
    const userRef = collection(this.firestore, 'Personas');
    return addDoc(userRef, user);
  }

  addUserRol(user: User){
    const userRef = collection(this.firestore, 'Roles');
    return addDoc(userRef, user);
  }

  getUser(): Observable<User[]> {
    const userRef = collection(this.firestore, 'Personas');
    return collectionData(userRef, {idField: 'email'}) as Observable<User[]>;
  }

  /*

  deleteElement(user: User){
    const userDocRef = collection(this.firestore, `users/{user.email}`);
    return deleteDoc(userDocRef)
  }
  */

}
