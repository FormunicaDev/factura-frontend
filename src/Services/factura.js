import axios from 'axios'

export default {
  async facturasPendientesImprimir(obj) {
    let data = []
    await axios.get(`/api/Factura/pendienteImprimir?Factura=${obj.NoFactura}&Usuario=${obj.Usuario}&FechaInicial=${obj.FechaInicial}&FechaFinal=${obj.FechaFinal}&PendienteImprimir=${obj.PendienteImprimir}&registroPorPagina=10&pagina=${obj.pagina}`).then(res => {
      data = res.data
      if (data.paginado.totaldePaginas > obj.pagina) {
        // eslint-disable-next-line no-param-reassign
        obj.pagina = 1
        this.facturasPendientesImprimir(obj)
      }
    }).catch(error => {
      data = error
    })

    return data
  },
  async facturaAImprinir(sucursal, numFact, impresa) {
    let data = []
    await axios.get(`/api/Factura/facturaImprimir?CodSucursal=${sucursal}&numeroFactura=${numFact}&impresa=${impresa}`).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
  async updateFactura(sucursal, numFact, obj) {
    let data = []
    await axios.put(`/api/Factura?CodSucursal=${sucursal}&numeroFactura=${numFact}`, obj).then(res => {
      data = res.data
    }).catch(error => {
      data = error
    })

    return data
  },
}
