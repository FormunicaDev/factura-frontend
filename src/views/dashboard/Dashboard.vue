<template>
  <v-row>
    <v-col
      cols="12"
      md="4"
    >
      <dashboard-congratulation-john></dashboard-congratulation-john>
    </v-col>
  </v-row>
</template>

<script>
// eslint-disable-next-line object-curly-newline

// demos
import DashboardCongratulationJohn from './DashboardCongratulationJohn.vue'
import auth from '@/Services/auth'

export default {
  components: {
    DashboardCongratulationJohn,
  },
  setup() {
    return {
    }
  },
  created() {
    this.validarLogin()
  },
  methods: {
    validarLogin() {
      const data = auth.validDateLogin()
      if (!data) {
        sessionStorage.removeItem('tokenfafFormunica')
        localStorage.removeItem('userfafFormunica')
        this.$router.push('/')
      }
    },
  },
}
</script>
