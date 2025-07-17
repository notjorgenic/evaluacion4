import { useState } from 'react'
import axios from 'axios'

export default function IndicadorPage({ codigo, etiqueta }) {
  const [fecha, setFecha]     = useState('')
  const [data, setData]       = useState(null)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const formatDate = iso => iso.split('T')[0]

  // Formatea CLP
  const formatCurrency = val =>
    new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(val)

  const fetchValor = async () => {
    setError('')
    setData(null)

    // Validación de formato
    const dmyMatch = /^\d{2}-\d{2}-\d{4}$/.test(fecha)
    if (!dmyMatch) {
      setError('Formato inválido. Usa "DD-MM-YYYY"')
      return
    }

    // Validación de fecha real y no futura
    const [d, m, y] = fecha.split('-').map(Number)
    const dt = new Date(y, m - 1, d)
    if (isNaN(dt) || dt > new Date()) {
      setError('Fecha no válida o futura')
      return
    }

    setLoading(true)
    try {
      const url = `https://mindicador.cl/api/${codigo}/${fecha}`
      const res = await axios.get(url)
      const serie = res.data.serie || []

      if (serie.length === 0) {
        setError('No hay datos para esta fecha')
      } else {
        setData({
          fecha: serie[0].fecha,
          valor: serie[0].valor
        })
      }
    } catch (err) {
      setError(
        err.response?.status === 404
          ? 'No hay datos para esta fecha'
          : 'Error de conexión'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container my-4">
      <h3>{etiqueta}</h3>

      <div className="row g-2 align-items-end">
        <div className="col-auto">
          <label htmlFor="fecha-input" className="form-label">
            Fecha en formato "DD-MM-YYYY":
          </label>
          <input
            id="fecha-input"
            type="text"
            className="form-control"
            placeholder="Ejemplo: 15-07-2025"
            value={fecha}
            onChange={e => setFecha(e.target.value.trim())}
          />
        </div>
        <div className="col-auto">
          <button
            className="btn btn-primary"
            onClick={fetchValor}
            disabled={loading}
          >
            {loading ? 'Consultando…' : 'Consultar'}
          </button>
        </div>
          <small className="text-muted">
            Selecciona un día hábil. Si no hay datos, intenta con el día hábil más cercano anterior.
          </small>
      </div>

      {error && (
        <div className="alert alert-warning mt-3">{error}</div>
      )}

      {data && (
        <div className="mt-3">
          <p>
            Fecha actualizada: <strong>{formatDate(data.fecha)}</strong>
          </p>
          <p>
            Valor: <strong>{formatCurrency(data.valor)}</strong>
          </p>
        </div>
      )}
    </div>
  )
}
