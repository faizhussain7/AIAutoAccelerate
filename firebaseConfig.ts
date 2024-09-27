import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
// @ts-ignore
import { Auth, getAuth, initializeAuth } from "firebase/auth";
// @ts-ignore
import { getReactNativePersistence } from "@firebase/auth/dist/rn/index.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const FirebaseApiKey = process.env.EXPO_PUBLIC_FIREBASE_API_KEY as string;
const authDomain = process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN as string;
const projectId = process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID as string;
const storageBucket = process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET as string;
const messagingSenderId = process.env
  .EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID as string;
const appId = process.env.EXPO_PUBLIC_FIREBASE_APP_ID as string;

// Firebase configuration
const firebaseConfig = {
  apiKey: FirebaseApiKey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
};

let FIREBASE_APP: FirebaseApp;
let FIREBASE_AUTH: Auth;

if (Platform.OS == "android" || Platform.OS == "ios") {
  // Initialize Firebase app only if it hasn't been initialized yet
  const FIREBASE_APP = !getApps().length
    ? initializeApp(firebaseConfig)
    : getApp();

  // Initialize Firebase Auth with AsyncStorage persistence
  FIREBASE_AUTH = initializeAuth(FIREBASE_APP, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
} else {
  FIREBASE_APP = initializeApp(firebaseConfig);
  FIREBASE_AUTH = getAuth(FIREBASE_APP);
}

export { FIREBASE_APP, FIREBASE_AUTH };
