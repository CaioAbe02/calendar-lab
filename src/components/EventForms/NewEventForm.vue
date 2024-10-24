<template>
  <v-sheet class="pa-6 mx-auto">
    <v-form @submit.prevent="submit">
      <h1 class="pb-6">Novo agendamento</h1>
      <v-text-field
        variant="outlined"
        v-model="user"
        label="Usuário"
      ></v-text-field>
      <v-select
        variant="outlined"
        v-model="equipment"
        :items="equipments"
        item-title="name"
        label="Selecione o equipamento"
        return-object
      ></v-select>
      <v-date-input
        variant="outlined"
        v-model="event_date"
        label="Selecione uma data"
        prepend-icon=""
        persistent-placeholder
      ></v-date-input>
      <v-text-field
        variant="outlined"
        v-model="start_time"
        :active="menu_start"
        :focus="menu_start"
        label="Início"
        prepend-icon=""
        readonly
      >
        <v-menu
          v-model="menu_start"
          :close-on-content-click="false"
          activator="parent"
          transition="scale-transition"
        >
          <v-time-picker
            v-if="menu_start"
            v-model="start_time"
            full-width
            format="24hr"
            :max="end_time"
          ></v-time-picker>
        </v-menu>
      </v-text-field>
      <v-text-field
        v-model="end_time"
        variant="outlined"
        :active="menu_end"
        :focus="menu_end"
        label="Fim"
        prepend-icon=""
        readonly
      >
        <v-menu
          v-model="menu_end"
          :close-on-content-click="false"
          activator="parent"
          transition="scale-transition"
        >
          <v-time-picker
            v-if="menu_end"
            v-model="end_time"
            full-width
            format="24hr"
            :min="start_time"
          ></v-time-picker>
        </v-menu>
      </v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn @click="emitCloseNewForm()">Cancelar</v-btn>
        <v-btn type="submit" class="bg-green" :loading="loading">Adicionar</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { EquipmentsStore, EventsStore } from '@/store'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'NewEventForm',
  data() {
    return {
      user: '',
      event_date: new Date(),
      start_time: '',
      end_time: '',
      menu_start: false,
      menu_end: false,
      loading: false,
    }
  },
  setup() {
    const route = useRoute()

    const equipments_store = EquipmentsStore()
    const equipments = computed(() => equipments_store.$state.equipments)
    let equipment = ref(equipments.value[0])
    const equipment_name = route.params.id

    if (equipment_name) {
      equipment = ref(equipments.value.filter(equipment => equipment.name === equipment_name)[0])
    }

    return {
      equipments,
      equipment,
      events_store: EventsStore()
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const year = this.event_date.getFullYear()
      const month = String(this.event_date.getMonth() + 1).padStart(2, '0')
      const day = String(this.event_date.getDate()).padStart(2, '0')

      const event_start = `${year}-${month}-${day} ${this.start_time}`
      const event_end = `${year}-${month}-${day} ${this.end_time}`

      const title = `${this.equipment.name} - ${this.user}`

      const response = await this.events_store.newEvent({
        title: title,
        start: event_start,
        end: event_end,
      })

      if (response) {
        alert('Agendamento criado com sucesso!')
        this.emitCloseNewForm()
        this.emitLoadEvents()
      }

      this.loading = false
    },
    emitCloseNewForm() {
      this.$emit('emit_close_new_form')
    },
    emitLoadEvents() {
      this.$emit('emit_load_events')
    }
  },
})
</script>