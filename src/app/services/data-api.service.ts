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
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class DataApiService {
 
  constructor(private firestore: Firestore) {}

  addUser(user: User, email: any) {
    //const userRef = collection(this.firestore, 'Personas');
    //return addDoc(userRef, user);
    return setDoc(doc(this.firestore, 'Personas', email), user);
  }

  addUserRol(user: User, email: any) {
    //const userRef = collection(this.firestore, 'Roles');
    //return addDoc(userRef, user);
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

  /*

  deleteElement(user: User){
    const userDocRef = collection(this.firestore, `users/{user.email}`);
    return deleteDoc(userDocRef)
  }
  */
}
