<template>
  <div class="settings-page">
    <div class="page-header mb-6 animate-on-scroll animate-fade-in-down">
      <div>
        <h1 class="page-title">Настройки</h1>
        <p class="page-subtitle">Управление конфигурацией приложения</p>
      </div>
    </div>

    <v-row>
      <!-- Firebase настройки -->
      <v-col cols="12" lg="6">
        <v-card class="settings-card animate-on-scroll animate-scale-in" elevation="0">
          <div class="card-header">
            <div class="header-icon" style="background: rgba(248, 113, 113, 0.15); border: 1px solid rgba(248, 113, 113, 0.3)">
              <v-icon color="#fca5a5" size="24">mdi-fire</v-icon>
            </div>
            <div>
              <h3 class="card-title">Firebase</h3>
              <p class="card-subtitle">Подключение к базе данных</p>
            </div>
          </div>

          <v-alert :type="firebaseStatus.connected ? 'success' : 'warning'" variant="tonal" class="mb-4 status-alert">
            <v-icon :icon="firebaseStatus.connected ? 'mdi-check-circle' : 'mdi-alert-circle'" start></v-icon>
            {{ firebaseStatus.message }}
          </v-alert>

          <div class="config-steps">
            <div class="step" v-for="(step, i) in firebaseSteps" :key="i">
              <div class="step-number">{{ i + 1 }}</div>
              <div class="step-content">
                <h4 class="step-title">{{ step.title }}</h4>
                <p class="step-description">{{ step.description }}</p>
                <a v-if="step.link" :href="step.link" target="_blank" class="step-link">
                  {{ step.linkText }} <v-icon size="14">mdi-open-in-new</v-icon>
                </a>
              </div>
            </div>
          </div>

          <v-btn
            class="gradient-btn mt-4"
            href="https://console.firebase.google.com/"
            target="_blank"
            rounded="xl"
          >
            <v-icon start>mdi-open-in-new</v-icon>
            Открыть Firebase Console
          </v-btn>
        </v-card>
      </v-col>

      <!-- Настройки приложения -->
      <v-col cols="12" lg="6">
        <v-card class="settings-card animate-on-scroll animate-scale-in" elevation="0" style="transition-delay: 100ms">
          <div class="card-header">
            <div class="header-icon" style="background: rgba(102, 126, 234, 0.15); border: 1px solid rgba(102, 126, 234, 0.3)">
              <v-icon color="#a7b7ff" size="24">mdi-cog</v-icon>
            </div>
            <div>
              <h3 class="card-title">Приложение</h3>
              <p class="card-subtitle">Персонализация интерфейса</p>
            </div>
          </div>

          <div class="settings-list">
            <div class="setting-item">
              <div class="setting-info">
                <v-icon class="setting-icon" icon="mdi-weather-night" size="24"></v-icon>
                <div>
                  <div class="setting-label">Тёмная тема</div>
                  <div class="setting-description">Использовать тёмный фон интерфейса</div>
                </div>
              </div>
              <v-switch v-model="darkMode" hide-details color="primary"></v-switch>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="setting-item">
              <div class="setting-info">
                <v-icon class="setting-icon" icon="mdi-translate" size="24"></v-icon>
                <div>
                  <div class="setting-label">Язык</div>
                  <div class="setting-description">Язык интерфейса приложения</div>
                </div>
              </div>
              <v-select
                v-model="language"
                :items="languages"
                variant="outlined"
                density="compact"
                rounded="lg"
                class="setting-select"
                hide-details
              ></v-select>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="setting-item">
              <div class="setting-info">
                <v-icon class="setting-icon" icon="mdi-refresh" size="24"></v-icon>
                <div>
                  <div class="setting-label">Автообновление</div>
                  <div class="setting-description">Интервал обновления данных</div>
                </div>
              </div>
              <v-select
                v-model="refreshInterval"
                :items="refreshIntervals"
                variant="outlined"
                density="compact"
                rounded="lg"
                class="setting-select"
                hide-details
              ></v-select>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="setting-item">
              <div class="setting-info">
                <v-icon class="setting-icon" icon="mdi-bell" size="24"></v-icon>
                <div>
                  <div class="setting-label">Уведомления</div>
                  <div class="setting-description">Показывать уведомления о событиях</div>
                </div>
              </div>
              <v-switch v-model="notifications" hide-details color="primary"></v-switch>
            </div>

            <v-divider class="my-3"></v-divider>

            <div class="setting-item">
              <div class="setting-info">
                <v-icon class="setting-icon" icon="mdi-chart-timeline-variant" size="24"></v-icon>
                <div>
                  <div class="setting-label">Анимации</div>
                  <div class="setting-description">Включить анимации интерфейса</div>
                </div>
              </div>
              <v-switch v-model="animations" hide-details color="primary"></v-switch>
            </div>
          </div>

          <div class="actions-row">
            <v-btn class="gradient-btn" rounded="xl">
              <v-icon start>mdi-content-save</v-icon>
              Сохранить
            </v-btn>
            <v-btn variant="outlined" rounded="xl">
              <v-icon start>mdi-refresh</v-icon>
              Сбросить
            </v-btn>
          </div>
        </v-card>
      </v-col>

      <!-- Статистика -->
      <v-col cols="12">
        <v-card class="stats-card animate-on-scroll animate-fade-in-up" elevation="0">
          <div class="card-header">
            <h3 class="card-title">Статус подключения</h3>
          </div>

          <v-row>
            <v-col cols="12" sm="4">
              <div class="stat-item">
                <div class="stat-icon" style="background: rgba(74, 222, 128, 0.15); border: 1px solid rgba(74, 222, 128, 0.3)">
                  <v-icon color="#86efac" size="28">mdi-database-check</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ firebaseStatus.connected ? 'Подключено' : 'Не подключено' }}</div>
                  <div class="stat-label">Firestore Database</div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="stat-item">
                <div class="stat-icon" style="background: rgba(102, 126, 234, 0.15); border: 1px solid rgba(102, 126, 234, 0.3)">
                  <v-icon color="#a7b7ff" size="28">mdi-cloud-outline</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ firebaseStatus.connected ? 'Активен' : 'Не активен' }}</div>
                  <div class="stat-label">Firebase Cloud</div>
                </div>
              </div>
            </v-col>

            <v-col cols="12" sm="4">
              <div class="stat-item">
                <div class="stat-icon" style="background: rgba(96, 165, 250, 0.15); border: 1px solid rgba(96, 165, 250, 0.3)">
                  <v-icon color="#93c5fd" size="28">mdi-chart-bar</v-icon>
                </div>
                <div class="stat-content">
                  <div class="stat-value">{{ firebaseStatus.connected ? 'Включён' : 'Выключен' }}</div>
                  <div class="stat-label">Analytics</div>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <!-- Информация о проекте -->
      <v-col cols="12">
        <v-card class="info-card animate-on-scroll animate-fade-in-up" elevation="0" style="transition-delay: 100ms">
          <div class="card-header">
            <h3 class="card-title">О проекте</h3>
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <div class="info-row">
                <span class="info-label">Название:</span>
                <span class="info-value">Dashboard Analytics</span>
              </div>
              <div class="info-row">
                <span class="info-label">Версия:</span>
                <span class="info-value">1.0.0</span>
              </div>
              <div class="info-row">
                <span class="info-label">Последнее обновление:</span>
                <span class="info-value">19 февраля 2026</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="info-row">
                <span class="info-label">Tech Stack:</span>
                <span class="info-value">Vue.js 3, Vuetify, Chart.js, Firebase</span>
              </div>
              <div class="info-row">
                <span class="info-label">Разработчик:</span>
                <span class="info-value">Lunaris</span>
              </div>
              <div class="info-row">
                <span class="info-label">Лицензия:</span>
                <span class="info-value">MIT</span>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue'
import { db } from '@/config/firebase'

onMounted(() => {
  nextTick(() => {
    initScrollAnimations()
  })
})

const initScrollAnimations = () => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated')
        }
      })
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  )

  document.querySelectorAll('.animate-on-scroll').forEach((el) => {
    observer.observe(el)
  })
}

const darkMode = ref(false)
const language = ref('ru')
const refreshInterval = ref('30')
const notifications = ref(true)
const animations = ref(true)

const languages = [
  { title: 'Русский', value: 'ru' },
  { title: 'English', value: 'en' },
  { title: 'Українська', value: 'uk' }
]

const refreshIntervals = [
  { title: '10 секунд', value: '10' },
  { title: '30 секунд', value: '30' },
  { title: '1 минута', value: '60' },
  { title: '5 минут', value: '300' }
]

const firebaseStatus = reactive({
  connected: false,
  message: 'Firebase не настроен. Пожалуйста, обновите конфигурацию в src/config/firebase.js'
})

const firebaseSteps = [
  {
    title: 'Создать проект Firebase',
    description: 'Зарегистрируйтесь и создайте новый проект в консоли Firebase',
    link: 'https://console.firebase.google.com/',
    linkText: 'Открыть консоль'
  },
  {
    title: 'Добавить веб-приложение',
    description: 'Нажмите на иконку Web (</>) и зарегистрируйте приложение',
    link: null,
    linkText: null
  },
  {
    title: 'Скопировать конфигурацию',
    description: 'Получите firebaseConfig и обновите файл src/config/firebase.js',
    link: null,
    linkText: null
  },
  {
    title: 'Включить Firestore',
    description: 'В разделе Build → Firestore Database создайте базу данных',
    link: null,
    linkText: null
  }
]

// Проверка подключения Firebase
try {
  if (db) {
    firebaseStatus.connected = true
    firebaseStatus.message = 'Firebase подключён успешно'
  }
} catch (e) {
  firebaseStatus.connected = false
  firebaseStatus.message = 'Ошибка подключения Firebase'
}
</script>

<style scoped>
.settings-page {
  padding: 0;
}

/* Анимации при скролле */
.animate-on-scroll {
  opacity: 0;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.animate-on-scroll.animated {
  opacity: 1;
}

.animate-fade-in-down {
  transform: translateY(-30px);
}

.animate-on-scroll.animated.animate-fade-in-down {
  transform: translateY(0);
}

.animate-scale-in {
  transform: scale(0.9);
}

.animate-on-scroll.animated.animate-scale-in {
  transform: scale(1);
}

.animate-fade-in-up {
  transform: translateY(30px);
}

.animate-on-scroll.animated.animate-fade-in-up {
  transform: translateY(0);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  margin: 0;
  letter-spacing: -0.5px;
}

.page-subtitle {
  color: rgba(255, 255, 255, 0.6);
  margin: 4px 0 0 0;
  font-size: 0.95rem;
}

/* Карточки настроек */
.settings-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  height: 100%;
  min-width: 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.header-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #fff;
  margin: 0;
}

.card-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 4px 0 0 0;
}

.status-alert {
  background: rgba(102, 126, 234, 0.1) !important;
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #fff;
}

/* Шаги настройки */
.config-steps {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.step {
  display: flex;
  gap: 16px;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  color: #a7b7ff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.step-content {
  flex: 1;
}

.step-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #fff;
  margin: 0 0 4px 0;
}

.step-description {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin: 0 0 8px 0;
}

.step-link {
  color: #667eea;
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.step-link:hover {
  text-decoration: underline;
}

/* Список настроек */
.settings-list {
  margin-bottom: 24px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.setting-info {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.setting-icon {
  color: rgba(255, 255, 255, 0.5);
}

.setting-label {
  font-weight: 500;
  color: #fff;
  font-size: 0.95rem;
}

.setting-description {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.8rem;
  margin-top: 2px;
}

.setting-select {
  min-width: 180px;
}

.setting-select :deep(.v-field) {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.setting-select :deep(.v-field__input) {
  color: #fff;
  font-size: 0.9rem;
}

.actions-row {
  display: flex;
  gap: 12px;
}

.gradient-btn {
  background: rgba(102, 126, 234, 0.15);
  color: #a7b7ff;
  font-weight: 600;
  text-transform: none;
  letter-spacing: 0.3px;
  border: 1px solid rgba(102, 126, 234, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.gradient-btn:hover {
  background: rgba(102, 126, 234, 0.25);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Статистика */
.stats-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  min-width: 0;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 16px;
}

.stat-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
}

.stat-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.85rem;
  margin-top: 2px;
}

/* Информация */
.info-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 24px;
  min-width: 0;
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.9rem;
}

.info-value {
  color: #fff;
  font-weight: 500;
  font-size: 0.9rem;
}

/* Адаптивность */
@media (max-width: 960px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .actions-row {
    flex-direction: column;
  }

  .gradient-btn {
    width: 100%;
  }

  .settings-card,
  .stats-card,
  .info-card {
    padding: 20px;
  }
}

@media (max-width: 600px) {
  .page-header {
    padding: 0 16px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .page-subtitle {
    font-size: 0.85rem;
  }

  .settings-card,
  .stats-card,
  .info-card {
    padding: 16px;
    margin: 0;
  }

  .card-header {
    flex-direction: column;
    gap: 12px;
    padding: 0 8px;
  }

  .card-title {
    font-size: 1rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    padding: 8px 0;
  }

  .setting-info {
    width: 100%;
  }

  .setting-select {
    width: 100%;
    min-width: auto;
  }

  .setting-icon {
    width: 24px;
  }

  .step {
    flex-direction: column;
    gap: 8px;
  }

  .step-number {
    width: 28px;
    height: 28px;
    font-size: 0.8rem;
  }

  .stat-item {
    flex-direction: column;
    text-align: center;
    gap: 12px;
    padding: 12px;
  }

  .stat-icon {
    width: 48px;
    height: 48px;
  }

  .stat-value {
    font-size: 1rem;
  }

  .stat-label {
    font-size: 0.8rem;
  }

  .info-row {
    flex-direction: column;
    gap: 4px;
    padding: 8px 0;
  }

  .info-label {
    font-size: 0.85rem;
  }

  .info-value {
    font-size: 0.85rem;
  }

  .status-alert {
    font-size: 0.85rem;
  }

  .config-steps {
    gap: 12px;
  }
}
</style>
