import { Injectable } from '@angular/core';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, Auth, UserCredential } from 'firebase/auth';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  private readonly app: FirebaseApp;
  private readonly auth: Auth;
  private readonly googleProvider: GoogleAuthProvider;

  constructor() {
    if (!getApps().length) {
      this.app = initializeApp(environment.firebase);
    } else {
      this.app = getApps()[0];
    }
    this.auth = getAuth(this.app);
    this.googleProvider = new GoogleAuthProvider();
    this.googleProvider.setCustomParameters({
      prompt: 'select_account'
    });
  }

  async signInWithGoogle(): Promise<string> {
    const credential: UserCredential = await signInWithPopup(this.auth, this.googleProvider);
    const idToken = await credential.user.getIdToken();
    return idToken;
  }
}
