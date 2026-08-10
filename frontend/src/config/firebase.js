import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDox5xPXhAoWHfrf8WuNSUuUumvWH7vrBo",
  authDomain: "gym-system-d84bb.firebaseapp.com",
  projectId: "gym-system-d84bb",
  storageBucket: "gym-system-d84bb.firebasestorage.app",
  messagingSenderId: "314788976661",
  appId: "1:314788976661:web:1726d73f21dbc808cb161c",
  measurementId: "G-7EJQZWSP5Z"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export const signInWithGoogleFirebase = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    return {
      email: user.email,
      name: user.displayName,
      photo: user.photoURL,
      uid: user.uid,
      token: await user.getIdToken()
    };
  } catch (error) {
    console.error("Firebase Auth Error:", error);
    throw error;
  }
};
