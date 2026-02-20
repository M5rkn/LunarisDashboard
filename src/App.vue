<template>
  <v-app class="dashboard-app">
    <!-- Навигация -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      :temporary="$vuetify.display.smAndDown"
      :permanent="$vuetify.display.mdAndUp ? true : undefined"
      class="nav-drawer"
      :class="{ 'nav-drawer--rail': rail && $vuetify.display.mdAndUp }"
      color="transparent"
    >
      <div class="logo-section pa-4">
        <v-icon size="32" color="white">mdi-view-dashboard</v-icon>
        <span v-if="!rail" class="logo-text">Analytics</span>
        <v-spacer></v-spacer>
        <v-btn
          v-if="$vuetify.display.smAndDown"
          icon
          size="small"
          variant="text"
          @click="drawer = false"
          class="mr-2"
        >
          <v-icon color="white" size="20">mdi-close</v-icon>
        </v-btn>
      </div>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
          :active="route.path === item.path"
          rounded="xl"
          class="mb-2"
          @click="navigateTo(item.path)"
        >
          <template v-slot:prepend>
            <v-icon :icon="item.icon" size="22"></v-icon>
          </template>
          <v-list-item-title v-if="!rail || $vuetify.display.smAndDown" class="menu-item">{{ item.title }}</v-list-item-title>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list-item @click="rail = !rail" rounded="xl" v-if="$vuetify.display.mdAndUp">
          <template v-slot:prepend>
            <v-icon :icon="rail ? 'mdi-chevron-left' : 'mdi-chevron-right'" size="22"></v-icon>
          </template>
          <v-list-item-title v-if="!rail" class="menu-item">Свернуть</v-list-item-title>
        </v-list-item>
      </template>
    </v-navigation-drawer>

    <!-- Верхняя панель -->
    <v-app-bar color="transparent" elevation="0" height="70" class="top-app-bar">
      <v-btn icon variant="text" class="ml-2 menu-btn" @click="drawer = !drawer" :class="{ 'd-none': $vuetify.display.mdAndUp }">
        <v-icon>mdi-menu</v-icon>
      </v-btn>

      <v-text-field
        v-model="searchQuery"
        placeholder="Поиск..."
        variant="outlined"
        density="compact"
        rounded="xl"
        hide-details
        class="search-field"
        prepend-inner-icon="mdi-magnify"
      ></v-text-field>

      <v-spacer></v-spacer>

      <v-btn icon variant="text" class="icon-btn" @click="showToast('Уведомления', 'Нет новых уведомлений', 'info')">
        <v-badge color="error" content="3" floating>
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <v-btn icon variant="text" class="icon-btn" @click="showToast('Настройки', 'Открыть настройки приложения', 'info')">
        <v-icon>mdi-cog-outline</v-icon>
      </v-btn>

      <v-avatar size="40" class="avatar" @click="showToast('Профиль', 'Добро пожаловать!', 'success')">
        <v-img src="https://i.pravatar.cc/150?img=12" alt="User"></v-img>
      </v-avatar>

      <v-spacer></v-spacer>
    </v-app-bar>

    <!-- Toast уведомления -->
    <Toast ref="toastRef" />

    <!-- Основной контент -->
    <v-main class="main-content" :class="{ 'main-content--rail': rail && $vuetify.display.mdAndUp }">
      <v-container fluid class="px-0">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay } from 'vuetify'
import Toast from '@/components/Toast.vue'

const route = useRoute()
const router = useRouter()
const { mdAndUp } = useDisplay()
const drawer = ref(false)
const rail = ref(false)
const searchQuery = ref('')
const toastRef = ref(null)

const showToast = (title, message, type = 'info') => {
  if (toastRef.value) {
    toastRef.value[type](title, message)
  }
}

// На ПК drawer всегда открыт, на мобильных закрыт
watch(mdAndUp, (isDesktop) => {
  if (isDesktop) {
    drawer.value = true
  } else {
    drawer.value = false
  }
}, { immediate: true })

// Закрытие drawer при изменении маршрута на мобильных
watch(() => route.path, () => {
  if (window.innerWidth < 960) {
    drawer.value = false
  }
})

// Навигация по клику на пункт меню
const navigateTo = (path) => {
  router.push(path)
  // Закрываем drawer на мобильных
  if (window.innerWidth < 960) {
    setTimeout(() => {
      drawer.value = false
    }, 100)
  }
}

const menuItems = [
  { title: 'Главная', icon: 'mdi-view-dashboard', path: '/' },
  { title: 'Отчёты', icon: 'mdi-file-chart', path: '/reports' },
  { title: 'Настройки', icon: 'mdi-cog', path: '/settings' }
]
</script>

<style>
* {
  box-sizing: border-box;
}

.dashboard-app {
  background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
  min-height: 100vh;
  overflow-x: hidden;
}

.nav-drawer {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* На ПК drawer фиксированный */
@media (min-width: 961px) {
  .nav-drawer {
    position: fixed !important;
    top: 70px !important;
    height: calc(100vh - 70px) !important;
    width: 260px !important;
  }
}

/* На мобильных drawer overlay поверх контента */
@media (max-width: 960px) {
  .nav-drawer.v-navigation-drawer--temporary {
    position: fixed !important;
    top: 70px !important;
    height: calc(100vh - 70px) !important;
    width: 280px !important;
    z-index: 1001 !important;
    box-shadow: none !important;
  }
  
  .nav-drawer.v-navigation-drawer--temporary:not(.v-navigation-drawer--active) {
    display: none !important;
  }
  
  /* Полностью убираем scrim */
  .v-navigation-drawer__scrim,
  .v-overlay__scrim {
    display: none !important;
    visibility: hidden !important;
    opacity: 0 !important;
    pointer-events: none !important;
  }
  
  /* Кнопки меню должны быть поверх всего */
  .nav-drawer .v-list-item {
    z-index: 1002 !important;
    position: relative;
  }
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(102, 126, 234, 0.15);
  border: 1px solid rgba(102, 126, 234, 0.3);
  border-radius: 16px;
  margin: 8px;
  transition: all 0.2s ease;
}

.nav-drawer--rail .logo-section {
  padding: 8px !important;
  justify-content: center;
  margin: 8px 4px;
}

.nav-drawer--rail .logo-text {
  display: none;
}

.nav-drawer--rail .logo-section .v-icon {
  margin: 0 !important;
}

/* Кнопка закрытия на мобильных */
@media (max-width: 960px) {
  .nav-drawer .logo-section {
    position: relative;
  }
  
  .nav-drawer .logo-section .v-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
  }
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: white;
}

.menu-item {
  font-weight: 500;
}

.nav-drawer--rail .menu-item {
  display: none;
}

/* Навигационная панель */
.nav-drawer {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255, 255, 255, 0.1) !important;
}

/* ПК версия */
@media (min-width: 961px) {
  .nav-drawer {
    position: fixed !important;
    top: 70px !important;
    height: calc(100vh - 70px) !important;
    width: 260px !important;
    transition: width 0.2s ease;
  }
  
  /* Свёрнутая версия */
  .nav-drawer--rail {
    width: 80px !important;
  }
  
  .nav-drawer--rail .logo-section {
    padding: 12px !important;
    justify-content: center;
  }
  
  .nav-drawer--rail .logo-text {
    display: none;
  }
  
  /* Элементы меню */
  .nav-drawer .v-list-item {
    margin: 4px 8px;
    border-radius: 12px;
    min-height: 48px;
  }
  
  .nav-drawer--rail .v-list-item {
    min-height: 56px !important;
    padding: 0 !important;
    position: relative !important;
    display: flex !important;
    align-items: center !important;
    justify-content: center !important;
    overflow: visible !important;
  }

  .nav-drawer--rail .v-list-item .v-list-item__root {
    justify-content: center !important;
    padding: 0 !important;
    width: 100% !important;
    display: flex !important;
    align-items: center !important;
  }

  .nav-drawer--rail .v-list-item__prepend {
    margin-right: 0 !important;
    justify-content: center !important;
    align-items: center !important;
    display: flex !important;
  }
  
  .nav-drawer--rail .v-list-item__content,
  .nav-drawer--rail .v-list-item__title,
  .nav-drawer--rail .v-list-item__subtitle,
  .nav-drawer--rail .v-list-item__spacer {
    display: none !important;
  }
  
  /* Активный элемент - круг */
  .nav-drawer--rail .v-list-item--active {
    background: transparent !important;
    box-shadow: none !important;
  }

  .nav-drawer--rail .v-list-item--active::before {
    content: '' !important;
    position: absolute !important;
    width: 40px !important;
    height: 40px !important;
    border-radius: 50% !important;
    background: rgba(102, 126, 234, 0.2) !important;
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%) !important;
    z-index: 0 !important;
  }

  .nav-drawer--rail .v-list-item--active .v-list-item__overlay {
    display: none !important;
  }

  .nav-drawer--rail .v-list-item--active .v-icon {
    position: relative !important;
    z-index: 1 !important;
    color: #fff !important;
  }

  /* Кнопка сворачивания */
  .nav-drawer--rail .v-list-item--append .v-icon {
    margin: 0 !important;
  }
}

.v-list-item--active {
  background: rgba(102, 126, 234, 0.15) !important;
}

/* На мобильных активный элемент меню */
@media (max-width: 960px) {
  .nav-drawer .v-list-item--active {
    background: rgba(102, 126, 234, 0.15) !important;
    border-radius: 12px !important;
  }
}

.top-app-bar {
  background: rgba(255, 255, 255, 0.05) !important;
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  padding: 0 16px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1001 !important;
}

.menu-btn {
  display: none;
}

@media (max-width: 960px) {
  .menu-btn {
    display: inline-flex !important;
  }
}

.search-field {
  max-width: 400px;
  margin-left: 16px;
}

.search-field .v-field {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
}

.search-field .v-field__input {
  color: white !important;
}

.search-field .v-label {
  color: rgba(255, 255, 255, 0.5) !important;
}

.icon-btn {
  margin: 0 2px;
}

.avatar {
  margin: 0 8px 0 4px;
  cursor: pointer;
}

.main-content {
  background: transparent;
  transition: none !important;
  padding-top: 70px;
  overflow-x: hidden;
}

@media (min-width: 961px) {
  .main-content {
    margin-left: 260px;
    transition: margin-left 0.2s ease;
  }

  .main-content--rail {
    margin-left: 80px;
  }
}

@media (max-width: 960px) {
  .main-content {
    margin-left: 0 !important;
  }
}

.v-navigation-drawer .v-list-item {
  margin: 4px 8px;
  border-radius: 12px;
}

.v-navigation-drawer .v-list-item:hover {
  background: rgba(255, 255, 255, 0.08) !important;
}

.v-container {
  max-width: 100% !important;
  padding: 24px 32px !important;
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
}

@media (max-width: 960px) {
  .v-container {
    padding: 16px 24px !important;
  }
}

@media (max-width: 600px) {
  .v-container {
    padding: 12px 16px !important;
  }

  .main-content {
    margin-left: 0 !important;
  }
}

/* Адаптивность */
@media (max-width: 960px) {
  .search-field {
    max-width: 180px;
  }

  .page-header {
    padding: 0 16px;
  }
}

@media (max-width: 600px) {
  .search-field {
    display: none;
  }

  .nav-drawer {
    top: 70px !important;
  }

  .avatar {
    width: 36px;
    height: 36px;
  }

  .icon-btn {
    min-width: auto;
  }

  .top-app-bar {
    padding: 0 8px !important;
  }

  .menu-btn {
    margin-left: 8px !important;
  }
}
</style>
