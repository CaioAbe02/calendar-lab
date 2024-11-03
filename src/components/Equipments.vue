<template>
  <v-container>
    <div class="d-flex align-center ga-4 mb-4">
      <v-text-field
        v-model="equipment_search"
        label="Pesquisar equipamento"
        prepend-inner-icon="mdi-magnify"
        variant="outlined"
        clearable
        hide-details="auto"
      ></v-text-field>
      <v-btn
        prepend-icon="mdi-plus"
        variant="flat"
        class="new_event_btn bg-blue"
        to="equipments/new"
      >
        Equipamento
      </v-btn>
    </div>
    <div class="d-flex flex-column ga-4">
      <v-skeleton-loader
        v-for="n in 6"
        v-if="isLoading"
        :key="n"
        type="list-item-two-line"
      ></v-skeleton-loader>
      <v-card
        v-for="equipment in filteredEquipments"
        :title="equipment.name"
        :subtitle="`Responsável: ${equipment.responsible}`"
        @click="redirectToEquipmentsPage(equipment.name)"
      >
      <template v-slot:append>
        <v-btn icon="mdi-pencil" @click.stop="openFormEdit(equipment)"></v-btn>
        <v-btn icon="mdi-delete" @click.stop="openDeleteComponent(equipment)"></v-btn>
      </template>
      </v-card>
    </div>
    <v-dialog v-model="form_edit">
      <EditEquipmentForm
        @emit_close_edit_form="form_edit = false"
        :equipment="current_equipment"
      />
    </v-dialog>
    <v-dialog v-model="delete_component">
      <ActionConfirmation
        action="delete"
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
      equipment_search: '',
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
    filteredEquipments() {
      let filtered_equipments = [...this.equipments]

      if (this.equipment_search === '') {
        return filtered_equipments
      }

      return filtered_equipments.filter(
        equipment => equipment.name.toLowerCase().includes(this.equipment_search.toLowerCase())
      )

    },
    isLoading() {
      if (this.equipments.length == 0) {
        return true
      }
      return false
    }
  }
})
</script>