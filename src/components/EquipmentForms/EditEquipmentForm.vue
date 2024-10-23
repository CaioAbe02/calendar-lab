<template>
  <v-sheet class="pa-6 mx-auto">
    <v-form @submit.prevent="submit">
      <h1 class="pb-6">Editar equipamento</h1>
      <v-text-field
        variant="outlined"
        v-model="name"
        label="Nome do equipamento"
      ></v-text-field>
      <v-text-field
        variant="outlined"
        v-model="responsible"
        label="Responsável"
      ></v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn @click="emitCloseEditForm()">Cancelar</v-btn>
        <v-btn type="submit" class="bg-green" :loading="loading">Confirmar</v-btn>
      </div>
    </v-form>
  </v-sheet>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { EquipmentsStore } from '@/store'
import IEquipment from '@/interfaces/IEquipment';

export default defineComponent({
  name: 'EditEquipmentForm',
  props: {
    equipment: {
      required: true,
      type: Object as ()=>IEquipment
    }
  },
  data() {
    return {
      name: this.equipment.name,
      responsible: this.equipment.responsible,
      loading: false,
    }
  },
  setup() {
    return {
      equipments_store: EquipmentsStore(),
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const updated_equipment = {
        id: this.equipment.id,
        name: this.name,
        responsible: this.responsible
      }
      const response = await this.equipments_store.updateEquipment(updated_equipment)

      if (response) {
        alert('Equipamento editado com sucesso!')
        this.emitCloseEditForm()
      }
      this.loading = false
    },
    emitCloseEditForm() {
      this.$emit('emit_close_edit_form')
    },
  },
})
</script>