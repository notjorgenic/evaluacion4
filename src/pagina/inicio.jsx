import { useState, useEffect } from 'react'
import axios from 'axios'

const indicadores = [
  { codigo: 'uf',    etiqueta: 'UF' },
  { codigo: 'ivp',   etiqueta: 'IVP' },
  { codigo: 'ipc',   etiqueta: 'IPC' },
  { codigo: 'utm',   etiqueta: 'UTM' },
  { codigo: 'dolar', etiqueta: 'Dólar' },
  { codigo: 'euro',  etiqueta: 'Euro' }
]

export default function Inicio() {
  const [data,    setData]    = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState('')

  const [openCalc,     setOpenCalc]     = useState(false)
  const [selIndicador, setSelIndicador] = useState(null)
  const [montoCLP,     setMontoCLP]     = useState('')
  const [montoUni,     setMontoUni]     = useState('')
  const [resultUni,    setResultUni]    = useState(null)
  const [resultCLP,    setResultCLP]    = useState(null)

  const fetchHoy = async () => {
    setLoading(true); setError('')
    try {
      const respuestas = await Promise.all(
        indicadores.map(ind =>
          axios.get(`https://mindicador.cl/api/${ind.codigo}`)
        )
      )
      const datos = respuestas.map((res, i) => {
        const body     = res.data
        const fechaISO = body.fecha || body.serie?.[0]?.fecha
        const valorNum = body.valor ?? body.serie?.[0]?.valor

        const [yyyy, mm, dd] = fechaISO.split('T')[0].split('-')
        return {
          ...indicadores[i],
          fecha: `${dd}-${mm}-${yyyy}`,
          valor: valorNum
        }
      })
      setData(datos)
    } catch {
      setError('No se pudieron cargar los indicadores del día')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHoy()
  }, [])

  const toggleCalc = indicador => {
    if (openCalc && selIndicador?.codigo === indicador.codigo) {
      setOpenCalc(false)
      setSelIndicador(null)
    } else {
      setOpenCalc(true)
      setSelIndicador(indicador)
    }
    setMontoCLP(''); setMontoUni('')
    setResultUni(null); setResultCLP(null)
  }

  const handleCalcularUni = () => {
    const val = parseFloat(montoCLP)
    if (isNaN(val)) return
    setResultUni(val / selIndicador.valor)
  }

  const handleCalcularCLP = () => {
    const val = parseFloat(montoUni)
    if (isNaN(val)) return
    setResultCLP(val * selIndicador.valor)
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4 text-center">Indicadores económicos del día</h2>

      {loading && (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center">{error}</div>
      )}

      {!loading && !error && (
        <>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Indicador</th>
                  <th>Fecha</th>
                  <th className="text-end">Valor</th>
                </tr>
              </thead>
              <tbody>
                {data.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{ cursor: 'pointer' }}
                    onClick={() => toggleCalc(row)}
                  >
                    <td>{row.etiqueta}</td>
                    <td>{row.fecha}</td>
                    <td className="text-end">
                      {new Intl.NumberFormat('es-CL', {
                        style: 'currency',
                        currency: 'CLP'
                      }).format(row.valor)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {openCalc && selIndicador && (
            <div className="card mt-4">
              <div className="card-body">
                <h5 className="card-title">
                  Calculadora {selIndicador.etiqueta}
                </h5>
                <div className="row">
                  {/* CLP → Unidad */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        CLP → {selIndicador.etiqueta}
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={montoCLP}
                        onChange={e => setMontoCLP(e.target.value)}
                        placeholder="Monto en CLP"
                      />
                    </div>
                    <button
                      className="btn btn-primary"
                      onClick={handleCalcularUni}
                    >
                      Calcular unidad
                    </button>
                    {resultUni != null && (
                      <p className="mt-2">
                        <strong>
                          {resultUni.toLocaleString('es-CL', {
                            minimumFractionDigits: 4,
                            maximumFractionDigits: 4
                          })}{' '}
                          {selIndicador.codigo}
                        </strong>
                      </p>
                    )}
                  </div>

                  {/* Unidad → CLP */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label">
                        {selIndicador.etiqueta} → CLP
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        value={montoUni}
                        onChange={e => setMontoUni(e.target.value)}
                        placeholder={`Monto en ${selIndicador.codigo}`}
                      />
                    </div>
                    <button
                      className="btn btn-secondary"
                      onClick={handleCalcularCLP}
                    >
                      Calcular CLP
                    </button>
                    {resultCLP != null && (
                      <p className="mt-2">
                        <strong>
                          {new Intl.NumberFormat('es-CL', {
                            style: 'currency',
                            currency: 'CLP'
                          }).format(resultCLP)}
                        </strong>
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={fetchHoy}
              disabled={loading}
            >
              {loading ? 'Actualizando…' : 'Actualizar'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
