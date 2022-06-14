import { Injectable } from '@angular/core';
import {Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  getAuth,
  sendPasswordResetEmail} from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private auth:Auth) { }

  user: any;
  authuser = getAuth().currentUser;

  register (email:any, password:any){
    return new Promise((resolve, reject) => {
      createUserWithEmailAndPassword(this.auth, email, password)
          .then(userData => {
          resolve(userData)
        }).catch(err => console.log(reject(err)))
    });
  }

  login({email, password} : any){
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  isAuth() {
    return onAuthStateChanged(this.auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        console.log(uid);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
    
  }

  logout(){
    return signOut(this.auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      console.log(error);
    });
  }

  recoverPassword(email:string){
    return sendPasswordResetEmail(this.auth, email) 
      .then(() => {
        // Password reset email sent!
        // ..
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        console.log(errorCode);
        console.log(errorMessage)
      });
  }
}