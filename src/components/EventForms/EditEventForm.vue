<template>
  <v-sheet class="pa-6 mx-auto">
    <v-form>
      <h1 class="pb-6">Editar agendamento</h1>
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
        <v-btn @click="emitCloseEditForm()">Cancelar</v-btn>
        <v-btn @click="edit_confirmation = true" class="bg-green" :loading="loading">Confirmar</v-btn>
      </div>
    </v-form>
    <v-dialog v-model="edit_confirmation">
      <ActionConfirmation
        action="edit"
        @emit_close_delete_component="edit_confirmation = false"
        @emit_delete_confirmation="submit()"
      />
    </v-dialog>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue'
import { EquipmentsStore, EventsStore } from '@/store'
import IEvent from '@/interfaces/IEvent'

export default defineComponent({
  name: 'EditEventForm',
  props: {
    event: {
      required: true,
      type: Object as ()=>IEvent
    }
  },
  data() {
    return {
      user: this.event.title.split(' - ')[1],
      event_date: new Date(this.event.start.replace(' ', 'T')),
      start_time: this.event.start.split(' ')[1],
      end_time: this.event.end.split(' ')[1],
      menu_start: false,
      menu_end: false,
      loading: false,
      edit_confirmation: false,
    }
  },
  setup(props) {
    const equipments_store = EquipmentsStore()
    const equipments = computed(() => equipments_store.$state.equipments)
    const equipment = ref(equipments.value.find(equipment => props.event.title.includes(equipment.name))!)

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

      const updated_event = {
        id: this.event.id,
        title: title,
        start: event_start,
        end: event_end,
      }
      const response = await this.events_store.uptdateEvent(updated_event)

      if (response) {
        alert('Agendamento editado com sucesso!')
        this.emitCloseEditForm()
        this.emitLoadEvents()
      }

      this.loading = false
    },
    emitCloseEditForm() {
      this.$emit('emit_close_edit_form')
    },
    emitLoadEvents() {
      this.$emit('emit_load_events')
    }
  },
})
</script>