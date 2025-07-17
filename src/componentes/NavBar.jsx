import { NavLink } from 'react-router-dom'

export default function NavBar() {
  return (
    <nav className="navbar navbar-expand bg-dark navbar-dark">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Menu Inicio</NavLink>
        <div className="navbar-nav">
          <NavLink className="nav-link" to="/uf">UF</NavLink>
          <NavLink className="nav-link" to="/ivp">IVP</NavLink>
          <NavLink className="nav-link" to="/ipc">IPC</NavLink>
          <NavLink className="nav-link" to="/utm">UTM</NavLink>
          <NavLink className="nav-link" to="/dolar">Dólar</NavLink>
          <NavLink className="nav-link" to="/euro">Euro</NavLink>
        </div>
      </div>
    </nav>
  )
}
