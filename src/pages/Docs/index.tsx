import { useState, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { Pagination } from "./components/Pagination";
import { SECTIONS } from "./constants";
import * as Content from "./sections/Content";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("intro");
  const mainRef = useRef<HTMLDivElement>(null);
  
  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  };

  const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);

  const sectionMap: Record<string, React.ReactNode> = {
    "intro": <Content.Introduction />,
    "getting-started": <Content.GettingStarted />,
    "installation": <Content.Installation />,
    "fee-shield": <Content.FeeShield />,
    "dashboard": <Content.DashboardOps />,
    "deployment": <Content.CloudDeployment />,
  };

  return (
    <div className="flex h-[calc(100vh-64px)] w-full overflow-hidden bg-dark-core text-white font-sans">
      {/* 🛠️ SIDEBAR NAVIGATION */}
      <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

      {/* 📄 MAIN CONTENT AREA - PAGE BASED */}
      <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth">
        <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12 lg:py-20">
          
          <div key={activeSection} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {sectionMap[activeSection]}
          </div>

          {/* 🔘 PAGINATION */}
          <Pagination currentIndex={currentIndex} onNavigate={handleSectionChange} />

        </div>
      </main>
    </div>
  );
}
