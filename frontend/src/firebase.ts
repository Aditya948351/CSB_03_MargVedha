import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, limit, doc, getDoc, setDoc, increment } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
      // Store just high-level metadata to avoid giant documents in Firestore
      critical_count: scanData.findings.filter((f: any) => f.severity >= 9.0).length,
      high_count: scanData.findings.filter((f: any) => f.severity >= 7.0 && f.severity < 9.0).length,
    });
    return docRef.id;
  } catch (error) {
    console.error("Error saving scan result to Firebase:", error);
    return null;
  }
};

export const getScanHistory = async (userId: string = 'anonymous') => {
  try {
    const scansRef = collection(db, "scans");
    // Wait for index creation or use simpler query, but orderBy requires a composite index if we use where()
    // A quick hack for the hackathon is to fetch all ordered by date and filter client-side, 
    // or just fetch by user_id. Let's fetch by user_id.
    const q = query(scansRef, limit(50)); 
    const snapshot = await getDocs(q);
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter to the specific user and sort manually to avoid needing a composite index
    return docs
      .filter((d: any) => d.user_id === userId)
      .sort((a: any, b: any) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime())
      .slice(0, 20);
  } catch (error) {
    console.error("Error fetching scan history:", error);
    return [];
  }
};
