<template>
  <v-container>
    <div class="d-flex flex-column ga-4">
      <v-skeleton-loader
        v-for="n in 6"
        v-if="isLoading"
        :key="n"
        type="list-item-two-line"
      ></v-skeleton-loader>
      <v-card
        v-for="equipment in equipments"
        :title="equipment.name"
        :subtitle="`Responsável: ${equipment.responsible}`"
        :to="`equipments/${equipment.name}`"
      ></v-card>
      <v-card
        title="Criar novo equipamento"
        prepend-icon="mdi-plus"
        to="equipments/new"
      ></v-card>
    </div>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { EquipmentsStore } from '@/store'

export default defineComponent({
  name: 'Equipments',
  setup() {
    const equipments_store = EquipmentsStore()
    equipments_store.getEquipments()
    return {
      equipments: computed(() => equipments_store.$state.equipments)
    }
  },
  computed: {
    isLoading() {
      if (this.equipments.length == 0) {
        return true
      }
      return false
    }
  }
})
</script>