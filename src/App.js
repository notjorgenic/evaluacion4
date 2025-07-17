import { BrowserRouter, Routes, Route } from 'react-router-dom'
import NavBar     from './componentes/NavBar'
import Footer     from './componentes/Footer'
import Inicio     from './pagina/inicio'
import Uf         from './pagina/UF'
import Ivp        from './pagina/Ivp'
import Ipc        from './pagina/Ipc'
import Utm        from './pagina/Utm'
import Dolar      from './pagina/Dolar'
import Euro       from './pagina/Euro'

function App() {
  return (
    <BrowserRouter>
      <div className="d-flex flex-column min-vh-100">
        <NavBar />

        <main className="flex-grow-1">
          <Routes>
            <Route path="/"      element={<Inicio />} />
            <Route path="/uf"    element={<Uf />} />
            <Route path="/ivp"   element={<Ivp />} />
            <Route path="/ipc"   element={<Ipc />} />
            <Route path="/utm"   element={<Utm />} />
            <Route path="/dolar" element={<Dolar />} />
            <Route path="/euro"  element={<Euro />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
