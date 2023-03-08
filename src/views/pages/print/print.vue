<template>
  <v-card
    class="rounded-xl"
    elevation="7"
  >
    <v-card-title>
      <v-spacer></v-spacer>
      <v-menu
        v-if="switch1"
        ref="menu"
        v-model="menu"
        :close-on-content-click="false"
        :return-value.sync="dates"
        transition="scale-transition"
        offset-y
        min-width="auto"
      >
        <template v-slot:activator="{ on, attrs }">
          <v-combobox
            v-model="dates"
            multiple
            chips
            small-chips
            label="Rango de Fechas"
            :prepend-icon="icons.mdiCalendarMonthOutline"
            readonly
            v-bind="attrs"
            v-on="on"
          ></v-combobox>
        </template>
        <v-date-picker
          v-model="dates"
          range
          no-title
          scrollable
        >
          <v-spacer></v-spacer>
          <v-btn
            text
            color="primary"
            @click="menu = false"
          >
            Cancelar
          </v-btn>
          <v-btn
            text
            color="primary"
            @click="$refs.menu.save(dates)"
          >
            OK
          </v-btn>
        </v-date-picker>
      </v-menu>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="facturas"
      sort-by="calories"
      hide-default-footer
    >
      <template v-slot:top>
        <v-toolbar
          flat
        >
          <v-toolbar-title> {{ title }}</v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <h3>Total de Registros: {{ paginado.totaldeRegistro }}</h3>
          <v-spacer></v-spacer>
          <v-switch
            v-model="switch1"
            inset
            :label="`Tipo Impresión: ${switch1==true?'Reimpresión':'Pendientes'}`"
          ></v-switch>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <template>
            <v-icon
              medium
              class="mr-2"
              @click="getFacturas()"
            >
              {{ icons.mdiSync }}
            </v-icon>
          </template>
          <v-dialog
            v-model="dialogPrint"
            max-width="550px"
          >
            <v-card>
              <v-card-title class="text-h5">
                ¿Seguro que desea imprimir esta factura?
              </v-card-title>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                  color="blue darken-1"
                  text
                  @click="close"
                >
                  Cancelar
                </v-btn>
                <v-btn
                  color="info"
                  @click="printConfirm()"
                >
                  OK
                </v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>
      <template v-slot:[`item.actions`]="{ item }">
        <v-icon
          medium
          class="mr-2"
          @click="printFactura(item)"
        >
          {{ icons.mdiPrinter }}
        </v-icon>
      </template>
      <template v-slot:no-data>
        <v-btn
          color="primary"
          @click="getFacturas()"
        >
          No existen datos
        </v-btn>
      </template>
    </v-data-table>
    <template>
      <div class="text-center">
        <v-pagination
          v-model="page"
          :length="paginado.totaldePaginas"
          circle
          :total-visible="7"
          @input="getFacturas()"
        ></v-pagination>
      </div>
      <v-overlay :value="overlay">
        <v-progress-circular
          indeterminate
          size="64"
        ></v-progress-circular>
      </v-overlay>
    </template>
  </v-card>
</template>

<script>
import {
  mdiPencil, mdiDelete, mdiPrinter, mdiReload, mdiCalendarMonthOutline, mdiSync,
} from '@mdi/js'
import facturas from '@/Services/factura'
import auth from '@/Services/auth'

export default {
  setup() {
    return {
      icons: {
        mdiPencil,
        mdiDelete,
        mdiPrinter,
        mdiReload,
        mdiCalendarMonthOutline,
        mdiSync,
      },
    }
  },
  data: () => ({
    dialog: false,
    dialogPrint: false,
    dialogInvoice: false,
    switch1: false,
    page: 1,
    title: 'Pendientes de Imprimir',
    dates: [],
    menu: false,
    overlay: false,
    headers: [
      {
        text: 'Factura',
        align: 'start',
        sortable: false,
        value: 'factura',
      },
      { text: 'Cod.Sucursal', value: 'codsucursal' },
      { text: 'Sucursal', value: 'sucursal' },
      { text: 'Cod. Cliente', value: 'codCliente' },
      { text: 'Cliente', value: 'cliente' },
      { text: 'Fecha Factura', value: 'fechaFactura' },
      { text: 'SubTotal', value: 'subtotal' },
      { text: 'Total', value: 'totalFactura' },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    facturas: [],
    facturaImprinir: [],
    editedIndex: -1,
    paginado: {
      pagina: 0,
      totaldePaginas: 0,
      registroPorPagina: 0,
      totaldeRegistro: 0,
    },
    param: {
      Usuario: '',
      FechaInicial: '',
      FechaFinal: '',
      PendienteImprimir: 0,
      pagina: 1,
    },
    print: {
      codsucursal: '',
      factura: '',
      impresa: 0,
    },
    upt: {
      Impresa: 1,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
  },

  async created() {
    await this.getFacturas()
    this.validarLogin()
  },
  methods: {
    async getFacturas() {
      this.overlay = true
      this.setTitle()
      this.setParam()
      console.log(this.param)
      const data = await facturas.facturasPendientesImprimir(this.param)
      if ('response' in data) {
        this.snackbar = true
        this.text = data.response.data.errors
        this.overlay = false
      } else {
        this.facturas = data.tieneItems === true ? data.items : []
        this.paginado.pagina = data.paginado.pagina
        this.paginado.totaldePaginas = data.paginado.totaldePaginas
        this.paginado.totaldeRegistro = data.paginado.totaldeRegistro
        this.overlay = false
      }
    },
    setTitle() {
      this.title = this.switch1 === true ? 'Reimprimir' : 'Pendientes de Imprimir'
    },
    setParam() {
      const hoy = Date.now()
      const fecha = new Date(hoy)
      this.param.Usuario = localStorage.getItem('userfafFormunica')
      this.param.FechaInicial = this.dates.length === 2 ? this.dates[0] : fecha.toISOString()
      this.param.FechaFinal = this.dates.length === 2 ? this.dates[1] : fecha.toISOString()
      this.param.PendienteImprimir = this.switch1 === true ? 0 : 1
      this.param.pagina = this.page
    },
    async getFacturaImprimir(sucursal, numFact, impresa) {
      this.facturaAImprinir = await facturas.facturaAImprinir(sucursal, numFact, impresa)
    },
    printFactura(item) {
      this.print = item
      this.dialogPrint = true
    },
    async establecerFacturaImpresa() {
      const data = await facturas.updateFactura(this.print.codsucursal, this.print.factura, this.upt)
      console.log(data)
    },
    async printConfirm() {
      this.dialogPrint = false
      const impresa = this.switch1 === true ? 1 : 0

      window.open(`http://localhost:5144/api/printinvoice?CodSucursal=${this.print.codsucursal}&numeroFactura=${this.print.factura}&impresa=${impresa}`, '_blank')

      // window.open(`http://10.10.0.16:8085/api/printinvoice?CodSucursal=${this.print.codsucursal}&numeroFactura=${this.print.factura}&impresa=${impresa}`, '_blank')
      if (!this.switch1) {
        setTimeout(async () => {
          await this.establecerFacturaImpresa()
          await this.getFacturas()
        }, 2000)
      }
    },
    close() {
      this.dialogPrint = false
      this.$nextTick(() => {
        this.editedItem = { ...this.defaultItem }
        this.editedIndex = -1
      })
    },
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
