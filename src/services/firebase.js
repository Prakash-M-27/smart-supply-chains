import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            "AIzaSyCTHCekJ3OyhmBfivpttqmFikjlQSKY8E8",
  authDomain:        "supply-shield-ba2f5.firebaseapp.com",
  projectId:         "supply-shield-ba2f5",
  storageBucket:     "supply-shield-ba2f5.firebasestorage.app",
  messagingSenderId: "87226563452",
  appId:             "1:87226563452:web:6264f4f2159f1b266e02f9",
  measurementId:     "G-V4RQ123XN7",
};

const app = initializeApp(firebaseConfig);

export const auth          = getAuth(app);
export const db            = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({ prompt: 'select_account' });
