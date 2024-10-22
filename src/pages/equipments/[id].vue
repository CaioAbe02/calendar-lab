<template>
  <v-container>
    <div class="d-flex flex-column align-start pb-4">
      <h1>{{ route.params.id }}</h1>
      <v-btn
        prepend-icon="mdi-plus"
        variant="flat"
        :disabled="loading"
        class="new_event_btn bg-blue"
        @click="form = true"
      >
        Novo agendamento
      </v-btn>
    </div>
    <v-dialog v-model="form">
      <NewEventForm
        @emit_close_new_form="closeNewEventForm()"
        @emit_load_events="refreshEvents()"
      />
    </v-dialog>
    <div>
      <ScheduleXCalendar :calendar-app="calendarApp"></ScheduleXCalendar>
    </div>
    <v-dialog v-model="event_modal" width="auto">
        <v-card
          :title="current_event.title"
        >
          <template v-slot:subtitle>
            <v-icon
              icon="mdi-clock"
              size="18"
            ></v-icon>
            {{ getEventTime(current_event) }}
          </template>
          <v-card-actions>
            <v-btn
              text="Excluir"
              color="red"
              variant="flat"
            ></v-btn>
            <v-btn
              text="Editar"
              color="blue"
              variant="flat"
              class="text-none ms-4 text-white"
              @click="OpenEditEventForm()"
            ></v-btn>
          </v-card-actions>
        </v-card>
    </v-dialog>
    <v-dialog v-model="event_edit_form">
      <EditEventForm
        @emit_close_edit_form="closeEditEventForm()"
        @emit_load_events="loadEvents()"
        :event="current_event"
      />
    </v-dialog>
  </v-container>
</template>

<script setup lang=ts>
import { computed, ref, shallowRef, onMounted } from 'vue'
import { EquipmentsStore, EventsStore } from '@/store'
import { ScheduleXCalendar } from '@schedule-x/vue'
import {
  createCalendar,
  createViewDay,
  createViewMonthAgenda,
  createViewMonthGrid,
  createViewWeek,
  viewMonthGrid
} from '@schedule-x/calendar'
import '@schedule-x/theme-default/dist/index.css'
import { createEventsServicePlugin } from '@schedule-x/events-service'
import { CalendarEvent } from '@schedule-x/calendar'
import { useRoute } from 'vue-router'

const route = useRoute()

const loading = ref(false)
const form = ref(false)
const event_edit_form = ref(false)
const event_modal = ref(false)
let current_event = {} as CalendarEvent

const equipments_store = EquipmentsStore()
equipments_store.getEquipments()

const events_store = EventsStore()
events_store.getEvents()
const events = computed(() => events_store.$state.events.filter(event => event.title.includes(String(route.params.id))))

const eventsService = createEventsServicePlugin()

async function loadEvents() {
  loading.value = true
  await events_store.getEvents()
  eventsService.set(events.value)
  loading.value = false
}

onMounted(() => {
  loadEvents()
})

const calendarApp = shallowRef(createCalendar({
  selectedDate: getCurrentDate(),
  locale: 'pt-BR',
  views: [createViewMonthAgenda(), createViewMonthGrid(), createViewWeek(), createViewDay()],
  defaultView: viewMonthGrid.name,
  firstDayOfWeek: 0,
  callbacks: {
    onEventClick(calendarEvent) {
      event_modal.value = true
      current_event = calendarEvent
    }
  },
  plugins: [
   eventsService,
  ],
  events: events.value,
  monthGridOptions: {
    nEventsPerDay: 3,
  },
  isDark: false,
}))

function refreshEvents() {
  eventsService.set(events.value)
}

function getCurrentDate(): string {
  const date = new Date()
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getEventTime(event: CalendarEvent) {
  const start = event.start.split(' ')[1]
  const end = event.end.split(' ')[1]
  return `${start} - ${end}`
}

function closeNewEventForm() {
  form.value = false
}

function OpenEditEventForm() {
  event_edit_form.value = true
}

function closeEditEventForm() {
  event_modal.value = false
  event_edit_form.value = false
}
</script>

<style>
.sx-vue-calendar-wrapper {
  width: 1200px;
  max-width: 90vw;
  height: 800px;
  max-height: 80vh;
}
</style>
