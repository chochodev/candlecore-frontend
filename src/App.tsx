import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <div className="dark min-h-screen bg-gray-950">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
