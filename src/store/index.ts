import IEvent from "@/interfaces/IEvent"
import IEquipment from "@/interfaces/IEquipement"
import { defineStore } from "pinia"
import { getDatabase, ref, child, get, update, remove, push } from "firebase/database"
import IEventDB from "@/interfaces/IEventDB"

export const EquipmentsStore = defineStore('equipments', {
  state: () => ({
    equipments: [] as IEquipment[]
  }),
  actions: {
    async getEquipments() {
      return new Promise((resolve, reject) => {
        const db = ref(getDatabase())
        get(child(db, 'equipments'))
        .then((response) => {
          this.equipments = []
          for(const key in response.val()) {
            if (response.val().hasOwnProperty(key)) {
              this.equipments.push(response.val()[key])
            }
          }
          resolve(true)
        })
        .catch((error) => {
          return reject(error)
        })
      })
    },
    async newEquipment(equipment: IEquipment) {
      if (!equipment.name || !equipment.responsible) {
        return 'Não pode estar vazio.'
      }
      return new Promise((resolve, reject) => {
        const db = getDatabase()
        push(ref(db, 'equipments/'), equipment)
        .then(() => {
          this.equipments.push(equipment)
          return resolve(true)
        })
        .catch((error) => {
          return reject(error)
        })
      })
    },
  }
})

export const EventsStore = defineStore('events', {
  state: () => ({
    events: [] as IEvent[]
  }),
  actions: {
    async getEvents() {
      const db = ref(getDatabase())

      try {
        const response = await get(child(db, 'events'))

        if (response.exists()) {
          let events = [] as IEvent[]
          for (const [key, event_db] of Object.entries(response.val())) {
            const event: IEvent = {
              id: key,
              title: (event_db as IEvent).title,
              start: (event_db as IEvent).start,
              end: (event_db as IEvent).end,
            }
            events.push(event)
          }
          this.events = events
          return true
        } else {
          return false
        }
      } catch (error) {
        throw (error)
      }
    },
    async newEvent(event: IEvent) {
      if (!event.title || !event.start || !event.end) {
        return 'Não pode estar vazio.'
      }
      else if (event.title.split(' - ').length > 2) {
        return "Retire o '-'"
      }
      const newEvent = {
        title: event.title,
        start: event.start,
        end: event.end
      } as IEventDB
      return new Promise((resolve, reject) => {
        const db = getDatabase()
        const id = push(child(ref(db), 'events')).key
        update(ref(db, `events/${id}`), newEvent)
        .then(() => {
          this.events.push(event)
          return resolve(true)
        })
        .catch((error) => {
          return reject(error)
        })
      })
    },
    async uptdateEvent(event: IEvent) {
      if (!event.title || !event.start || !event.end) {
        return 'Não pode estar vazio.'
      }
      else if (event.title.split(' - ').length > 2) {
        return "Retire o '-'"
      }
      const updatedEvent = {
        title: event.title,
        start: event.start,
        end: event.end
      } as IEventDB
      return new Promise((resolve, reject) => {
        const db = getDatabase()
        update(ref(db, `events/${event.id}`), updatedEvent)
        .then(() => {
          return resolve(true)
        })
        .catch((error) => {
          return reject(error)
        })
      })
    },
    async removeEvent(event_id: string | number) {
      return new Promise((resolve, reject) => {
        const db = getDatabase()
        remove(ref(db, `events/${event_id}`))
        .then(() => {
          this.events = this.events.filter(event => event.id !== event_id)
          return resolve(true)
        })
        .catch((error) => {
          return reject(error)
        })
      })
    }
  },
})
