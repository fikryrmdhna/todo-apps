import { defineStore } from 'pinia';
import { auth, db } from '../lib/firebase';
import { doc, setDoc } from "firebase/firestore";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence
} from 'firebase/auth';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLayoutLoading: true,
    isButtonRegisterLoading: false,
    user: null,
    error: null,
  }),
  actions: {
    async initAuth() {
      console.log('init Auth!')
      const router = useRouter();
      await setPersistence(auth, browserLocalPersistence);

      onAuthStateChanged(auth, (user) => {
        console.log('listen: ', user)
        if (user) {
          this.user = user;
          this.isLayoutLoading = false;
        } else {
          this.user = null;
          this.isLayoutLoading = false;
        }
      });
    },
    async register(email, password) {
      this.isButtonRegisterLoading = true;
      return new Promise(async (resolve, reject) => {
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          console.log('userCredential: ', userCredential)
          await setDoc(doc(db, "users", userCredential.user.uid), {
            email,
            id: userCredential.user.uid,
          });
          this.user = userCredential.user;
          resolve()
        } catch (error) {
          let errorMessage;
          console.log('error: ', error.code)
  
          switch (error.code) {
            case "auth/invalid-email":
              errorMessage = "Please enter a valid email.";
              break;
            case "auth/missing-password":
              errorMessage = "Please enter a password.";
              break;
            case "auth/email-already-in-use":
              errorMessage = "This email is already in use. Try another email.";
              break;
            default:
              errorMessage = "An error occurred. Please try again.";
          }
  
          this.error = errorMessage;
          reject(error)
        } finally {
          this.isButtonRegisterLoading = false;
        }
      })
    },
    async login(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        this.user = userCredential.user;
      } catch (error) {
        this.error = error.message;
      }
    },
    async logout() {
      await signOut(auth);
      this.user = null;
    },
  },
});
