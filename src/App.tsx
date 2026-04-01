import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/layout/Header";
import { Home } from "./pages/Home";
import { Dashboard } from "./pages/Dashboard";
import LabIndex from "./pages/lab/Index";
import LabCompare from "./pages/lab/Compare";
import Docs from "./pages/Docs";
import { APIStatus } from "./pages/APIStatus";
import { NotFound } from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-dark-core text-white">
      <BrowserRouter>
        <Routes>
          <Route element={<Header />}>
            <Route path="/" element={<Home />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/lab">
              <Route index element={<LabIndex />} />
              <Route path="compare" element={<LabCompare />} />
            </Route>
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
