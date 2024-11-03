<template>
  <v-card class="pa-6 mx-auto w-100" max-width="350px">
    <h2 class="mb-3">Confirmar {{ actionConfirmation }}</h2>
    <v-form v-model="valid" validate-on="blur" @submit.prevent="submit">
      <v-text-field
        v-model="password"
        :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
        :type="visible ? 'text' : 'password'"
        placeholder="Digite a senha"
        prepend-inner-icon="mdi-lock-outline"
        variant="outlined"
        :rules="rules"
        @click:append-inner="visible = !visible"
      ></v-text-field>
      <div class="d-flex justify-space-between">
        <v-btn @click="emitCloseDeleteComponent()">Cancelar</v-btn>
        <v-btn color="red" type="submit">Excluir</v-btn>
      </div>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'

export default defineComponent({
  name: 'DeleteConfirmation',
  props: {
    action: {
      required: true,
      type: String as PropType<'delete' | 'edit'>
    }
  },
  data() {
    return {
      valid: false,
      visible: false,
      password: '',
      rules: [
        (value: string) => {
          if (value === import.meta.env.VITE_DELETE_PASSWORD) return true

          return 'Senha incorreta.'
        },
      ],
    }
  },
  methods: {
    submit() {
      if (this.valid) {
        this.emitDeleteConfirmation()
      }
    },
    emitDeleteConfirmation() {
      this.$emit('emit_delete_confirmation')
    },
    emitCloseDeleteComponent() {
      this.$emit('emit_close_delete_component')
    },
  },
  computed: {
    actionConfirmation(): string {
      switch (this.action) {
        case 'delete': return 'exclusão'
        case 'edit': return 'edição'
        default: return 'exlusão'
      }
    }
  }
})
</script>