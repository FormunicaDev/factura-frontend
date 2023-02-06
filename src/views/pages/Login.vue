<template>
  <div class="auth-wrapper auth-v1">
    <div class="auth-inner">
      <v-card class="auth-card">
        <!-- logo -->
        <v-card-title class="d-flex align-center justify-center py-7">
          <router-link
            to="/"
            class="d-flex align-center"
          >
            <v-img
              :src="require('@/assets/images/logos/logoformunica.png')"
              max-height="40px"
              max-width="40px"
              alt="logo"
              contain
              class="me-3 "
            ></v-img>

            <h2 class="text-2xl font-weight-semibold">
              Formunica
            </h2>
          </router-link>
        </v-card-title>

        <!-- title -->
        <v-card-text>
          <p class="text-2xl font-weight-semibold text--primary mb-2">
            ¡Bienvenido!
          </p>
          <p class="mb-2">
            Favor autenticarse con su usuario Formunica
          </p>
        </v-card-text>

        <!-- login form -->
        <v-card-text>
          <v-text-field
            v-model="globalUsuarioDTO.Usuario"
            label="Usuario"
            outlined
          >
          </v-text-field>
          <v-text-field
            v-model="globalUsuarioDTO.Password"
            label="Contraseña"
            outlined
            @keyup.enter="login()"
          >
          </v-text-field>
          <v-form>
            <v-btn
              block
              color="primary"
              class="mt-6"
              @click="login()"
            >
              Iniciar Sesión
            </v-btn>
          </v-form>
          <v-snackbar
            v-model="snackbar"
            :timeout="timeout"
          >
            {{ text }}

            <template v-slot:action="{ attrs }">
              <v-btn
                color="blue"
                text
                v-bind="attrs"
                @click="snackbar = false"
              >
                Cerrar
              </v-btn>
            </template>
          </v-snackbar>
        </v-card-text>

        <!-- create new account  -->
        <v-card-text class="d-flex align-center justify-center flex-wrap mt-2">
          <span class="me-2">
            ¿Nuevo en la plataforma?
          </span>
          <span>
            <strong>Pongase en contacto con el area de IT</strong>
          </span>
        </v-card-text>

        <!-- divider -->
        <v-card-text class="d-flex align-center mt-2">
          <v-divider></v-divider>
          <span class="mx-5">o</span>
          <v-divider></v-divider>
        </v-card-text>

        <!-- social links -->
      </v-card>
    </div>

    <!-- background triangle shape  -->
    <img
      class="auth-mask-bg"
      height="173"
      :src="require(`@/assets/images/misc/mask-${$vuetify.theme.dark ? 'dark':'light'}.png`)"
    >

    <!-- tree -->
    <v-img
      class="auth-tree"
      width="247"
      height="185"
      src="@/assets/images/misc/tree-green.png"
    ></v-img>

    <!-- tree  -->
    <v-img
      class="auth-tree-3"
      width="377"
      height="289"
      src="@/assets/images/misc/tree-3-green.png"
    ></v-img>
  </div>
</template>

<script>
// eslint-disable-next-line object-curly-newline
import { mdiEyeOutline, mdiEyeOffOutline } from '@mdi/js'
import { ref } from '@vue/composition-api'
import auth from '@/Services/auth'

export default {
  setup() {
    const isPasswordVisible = ref(false)

    return {
      isPasswordVisible,

      icons: {
        mdiEyeOutline,
        mdiEyeOffOutline,
      },
    }
  },
  data: () => ({
    snackbar: false,
    text: '',
    timeout: 2000,
    globalUsuarioDTO: {
      Usuario: '',
      Password: '',
    },
  }),
  created() {
  },
  methods: {
    async login() {
      const data = await auth.login(this.globalUsuarioDTO)
      if ('response' in data) {
        this.snackbar = true
        this.text = data.response.data.errors
      } else {
        sessionStorage.setItem('tokenfafFormunica', data[0])
        localStorage.setItem('userfafFormunica', data[2])
        this.$router.push({ name: 'dashboard' })
      }
    },
  },
}
</script>

<style lang="scss">
@import '~@/plugins/vuetify/default-preset/preset/pages/auth.scss';
</style>
