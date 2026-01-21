import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

/**
 * Initialize Firebase with the provided configuration
 * This should be called once in your application before using any Firebase services
 * 
 * @param firebaseConfig - Firebase configuration object
 * @returns Object containing initialized Firebase services
 */
export function initializeFirebase(firebaseConfig: FirebaseOptions) {
    try {
        app = initializeApp(firebaseConfig);
        auth = getAuth(app);
        db = getFirestore(app);
        storage = getStorage(app);

        return { app, auth, db, storage };
    } catch (error) {
        console.warn('Firebase initialization failed. The app will run in offline/demo mode.', error);
        return { app: null, auth: null, db: null, storage: null };
    }
}

/**
 * Get the initialized Firebase services
 * Make sure to call initializeFirebase first
 */
export function getFirebaseServices() {
    return { auth, db, storage, app };
}

export { auth, db, storage };
export default app;
