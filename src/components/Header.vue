<template>
  <v-app-bar>
    <template v-slot:prepend>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
    </template>
    <v-app-bar-title>
      <div class="d-flex align-center ga-2">
        <div>
          <v-img
            src="/public/logo.webp"
            :width="130"
          ></v-img>
        </div>
        <span class="mt-4">Agendamentos</span>
      </div>
    </v-app-bar-title>
    <v-btn icon>
      <v-icon @click="changeTheme()">mdi-theme-light-dark</v-icon>
    </v-btn>
  </v-app-bar>
  <v-navigation-drawer v-model="drawer">
    <v-list>
      <v-list-item
        title="Equipamentos"
        to="/"
      ></v-list-item>
      <v-list-item
        title="Calendário"
        to="/calendar"
      ></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useTheme } from 'vuetify'

export default defineComponent({
  name: 'Header',
  data() {
    return {
      drawer: false,
    }
  },
  setup() {
    return {
      theme: useTheme()
    }
  },
  methods: {
    changeTheme() {
      this.theme.global.name.value = this.theme.global.current.value.dark ? 'light' : 'dark'
    }
  }
})
</script>