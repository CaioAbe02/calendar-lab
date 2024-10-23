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
        <v-btn icon="mdi-delete" @click.stop="removeEquipment(equipment.id)"></v-btn>
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
      current_equipment: {} as IEquipment
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
    async removeEquipment(equipment_id: string) {
      const confirm_delete = confirm('Você tem certeza que deseja excluir?')

      if (confirm_delete) {
        const result = await this.equipments_store.removeEquipment(equipment_id)

        if (result) {
          alert('Equipamento exluído com sucesso!')
        }
        else {
          alert('Ocorru um erro!')
        }
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