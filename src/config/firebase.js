// Конфигурация Firebase
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAnalytics } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: "AIzaSyCH9o3gD9qYqY5q__KEMNvY5XunLz1C0ww",
  authDomain: "dashboard-app-de56a.firebaseapp.com",
  projectId: "dashboard-app-de56a",
  storageBucket: "dashboard-app-de56a.firebasestorage.app",
  messagingSenderId: "724587257739",
  appId: "1:724587257739:web:5809c2d27f165b285a598e",
  measurementId: "G-VDBK78GK36"
};

// Инициализация Firebase
const app = initializeApp(firebaseConfig)

// Экспорт сервисов
export const db = getFirestore(app)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null

export default app
