<template>
  <v-container>
    <v-sheet class="pa-6 mx-auto" max-width="500" elevation="4" rounded>
      <v-form validate-on="submit lazy" @submit.prevent="submit">
        <h1 class="pb-6">Novo equipamento</h1>
        <v-text-field
          variant="outlined"
          label="Nome do equipamento"
          v-model="name"
          :rules="rules"
        ></v-text-field>
        <v-text-field
          variant="outlined"
          label="Responsável"
          v-model="responsible"
          :rules="rules"
        ></v-text-field>
        <v-btn
          type="submit"
          :loading="loading"
          block
          class="bg-green"
        >
          Adicionar
        </v-btn>
      </v-form>
    </v-sheet>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { EquipmentsStore } from '@/store'

export default defineComponent({
  name: 'NewEquipment',
  data() {
    return {
      name: '',
      responsible: '',
      loading: false,
      rules: [
        (value: string) => {
          if (value) return true

          return 'Este campo não pode estar vazio.'
        },
      ],
    }
  },
  setup() {
    return {
      equipments_store: EquipmentsStore()
    }
  },
  methods: {
    async submit() {
      this.loading = true
      const response = await this.equipments_store.newEquipment({
        name: this.name,
        responsible: this.responsible
      })

      if (response === true) {
        alert('Equipamento criado com sucesso!')
      }

      this.loading = false
      this.$router.push('/')
    }
  }
})
</script>
