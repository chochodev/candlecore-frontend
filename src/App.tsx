import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import { StrategyLab } from "./pages/StrategyLab";
import { APIStatus } from "./pages/APIStatus";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <BrowserRouter>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<Home />} />
            <Route path="/lab" element={<StrategyLab />} />
            <Route path="/api" element={<APIStatus />} />
            <Route path="*" element={<NotFound />} />
          </Route>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
