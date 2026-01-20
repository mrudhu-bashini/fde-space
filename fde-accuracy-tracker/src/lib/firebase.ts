import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseConfig } from '../config/firebase';

// Initialize Firebase
let app;
let auth;
let db;
let storage;

try {
    // Only initialize if we have a config, even if dummy, but getAuth will fail if key is invalid.
    // We'll let it try and catch the specific error if possible, or just catch all.
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
} catch (error) {
    console.warn('Firebase initialization failed. The app will run in offline/demo mode.', error);
    // No-op or null exports. Components using these must check if they exist.
    app = null;
    auth = null;
    db = null;
    storage = null;
}

export { auth, db, storage };

export default app;
