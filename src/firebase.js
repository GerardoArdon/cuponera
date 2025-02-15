import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase con tus datos
const firebaseConfig = {
  apiKey: "AIzaSyAmbWYSfhvy0dErxykAABsT_sPg3fzlEk4",
  authDomain: "lacuponera-b9e27.firebaseapp.com",
  projectId: "lacuponera-b9e27",
  storageBucket: "lacuponera-b9e27.firebasestorage.app",
  messagingSenderId: "626413387678",
  appId: "1:626413387678:web:462adbc89268ceec66a08f",
  measurementId: "G-2MH40DP5DF"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

// Exporta las instancias para usarlas en el resto de la app
export { app, analytics, auth, db };
