import { useState, useRef } from "react";
import { Sidebar } from "./components/Sidebar";
import { Pagination } from "./components/Pagination";
import { SECTIONS } from "./constants";
import * as Content from "./sections/Content";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";

export default function Docs() {
  const [activeSection, setActiveSection] = useState("intro");
  const mainRef = useRef<HTMLDivElement>(null);

  const handleSectionChange = (id: string) => {
    setActiveSection(id);
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  };

  useLockBodyScroll(true);

  const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  const sectionMap: Record<string, React.ReactNode> = {
    intro: <Content.Introduction />,
    "getting-started": <Content.GettingStarted />,
    installation: <Content.Installation />,
    "fee-shield": <Content.FeeShield />,
    dashboard: <Content.DashboardOps />,
    deployment: <Content.CloudDeployment />,
  };

  return (
    <div className="relative h-screen overflow-y-auto">
      <div className="flex h-max w-full font-sans text-white">
        {/* SIDEBAR NAVIGATION */}
        <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />

        {/* MAIN CONTENT AREA - PAGE BASED */}
        <main ref={mainRef} className="flex-1">
          <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12 lg:py-20">
            <div key={activeSection} className="duration-500 animate-in fade-in slide-in-from-bottom-4">
              {sectionMap[activeSection]}
            </div>

            {/* PAGINATION */}
            <Pagination currentIndex={currentIndex} onNavigate={handleSectionChange} />
          </div>
        </main>
      </div>
    </div>
  );
}
