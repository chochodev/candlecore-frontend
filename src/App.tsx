import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "./components/layout/Header"
import { Home } from "./pages/Home"
import { Dashboard } from "./pages/Dashboard"
import { NotFound } from "./pages/NotFound"

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
