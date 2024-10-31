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
        @click="redirectToEquipmentsPage(equipment.name)"
      >
      <template v-slot:append>
        <v-btn icon="mdi-pencil" @click.stop="openFormEdit(equipment)"></v-btn>
        <v-btn icon="mdi-delete" @click.stop="openDeleteComponent(equipment)"></v-btn>
      </template>
      </v-card>
      <v-card
        title="Criar novo equipamento"
        prepend-icon="mdi-plus"
        to="equipments/new"
      ></v-card>
    </div>
    <v-dialog v-model="form_edit">
      <EditEquipmentForm
        @emit_close_edit_form="form_edit = false"
        :equipment="current_equipment"
      />
    </v-dialog>
    <v-dialog v-model="delete_component">
      <DeleteConfirmation
        @emit_close_delete_component="delete_component = false"
        @emit_delete_confirmation="removeEquipment()"
      />
    </v-dialog>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue'
import { EquipmentsStore } from '@/store'
import IEquipment from '@/interfaces/IEquipment'

export default defineComponent({
  name: 'Equipments',
  setup() {
    const equipments_store = EquipmentsStore()
    equipments_store.getEquipments()
    return {
      equipments: computed(() => equipments_store.$state.equipments),
      equipments_store
    }
  },
  data() {
    return {
      form_edit: false,
      current_equipment: {} as IEquipment,
      delete_component: false,
    }
  },
  methods: {
    redirectToEquipmentsPage(equipment_name: string) {
      this.$router.push(`/equipments/${equipment_name}`)
    },
    openFormEdit(selected_equipment: IEquipment) {
      this.current_equipment = selected_equipment
      this.form_edit = true
    },
    openDeleteComponent(selected_equipment: IEquipment) {
      this.current_equipment = selected_equipment
      this.delete_component = true
    },
    async removeEquipment() {
      const result = await this.equipments_store.removeEquipment(this.current_equipment.id)

      if (result) {
        alert('Equipamento exluído com sucesso!')
        this.delete_component = false
      }
      else {
        alert('Ocorru um erro!')
      }
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