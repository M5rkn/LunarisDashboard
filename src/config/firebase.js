// Конфигурация Firebase
// Замените эти значения на ваши данные из Firebase Console
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

// Инициализация analytics с защитой от ошибок
let analyticsInstance = null
try {
  if (typeof window !== 'undefined') {
    analyticsInstance = getAnalytics(app)
  }
} catch (e) {
  console.warn('Analytics не доступен:', e)
}
export const analytics = analyticsInstance

// Проверка инициализации
console.log('Firebase инициализирован:', {
  app,
  db,
  analytics: analyticsInstance,
  projectId: firebaseConfig.projectId
})

export default app
