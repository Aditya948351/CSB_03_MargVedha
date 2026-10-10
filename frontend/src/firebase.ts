import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, limit, doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBwl9IsrwEMAsVGyyte9Ke422pvCp_iEi8",
  authDomain: "margvedha-2026-cisa.firebaseapp.com",
  projectId: "margvedha-2026-cisa",
  storageBucket: "margvedha-2026-cisa.firebasestorage.app",
  messagingSenderId: "885323920289",
  appId: "1:885323920289:web:2a8be9ec0ad79d59b511e0"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();
githubProvider.addScope('repo');
githubProvider.addScope('read:org');

export const saveScanResult = async (scanData: any, userId: string = 'anonymous') => {
  try {
    const scansRef = collection(db, "scans");
    const docRef = await addDoc(scansRef, {
      user_id: userId,
      scan_id: scanData.scan_id,
      source_name: scanData.source_name || 'Unknown Source',
      uploaded_at: scanData.uploaded_at,
      project_count: scanData.projects.length,
      finding_count: scanData.findings.length,
      critical_count: scanData.findings.filter((f: any) => f.severity >= 9.0).length,
      high_count: scanData.findings.filter((f: any) => f.severity >= 7.0 && f.severity < 9.0).length,
    });

    // Also persist the user's active scan state for session persistence
    if (userId && userId !== 'anonymous') {
      await setDoc(doc(db, "users", userId, "state", "activeScan"), {
        scanData,
        updated_at: new Date().toISOString()
      });
    }

    return docRef.id;
  } catch (error) {
    console.error("Error saving scan result to Firebase:", error);
    return null;
  }
};

export const getUserActiveScan = async (userId: string) => {
  try {
    if (!userId || userId === 'anonymous') return null;
    const docRef = doc(db, "users", userId, "state", "activeScan");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().scanData || null;
    }
  } catch (error) {
    console.error("Error fetching active scan from Firebase:", error);
  }
  return null;
};

export const saveUserReposToFirebase = async (userId: string, repos: any[]) => {
  try {
    if (!userId || userId === 'anonymous') return;
    const docRef = doc(db, "users", userId, "state", "repos");
    await setDoc(docRef, { repos, updated_at: new Date().toISOString() });
  } catch (error) {
    console.error("Error saving user repos to Firebase:", error);
  }
};

export const getUserReposFromFirebase = async (userId: string) => {
  try {
    if (!userId || userId === 'anonymous') return [];
    const docRef = doc(db, "users", userId, "state", "repos");
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data().repos || [];
    }
  } catch (error) {
    console.error("Error fetching user repos from Firebase:", error);
  }
  return [];
};

export const getScanHistory = async (userId: string = 'anonymous') => {
  try {
    const scansRef = collection(db, "scans");
    const q = query(scansRef, limit(50)); 
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return docs
      .filter((d: any) => d.user_id === userId)
      .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }
};
