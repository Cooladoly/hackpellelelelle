import { lazy } from "react";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Sponsors } from "./pages/Sponsors";
import { Register } from "./pages/Register";
import { Contact } from "./pages/Contact";
import { CodeOfConduct } from "./pages/CodeOfConduct";
import { Privacy } from "./pages/Privacy";
import { ComingSoon } from "./pages/ComingSoon";
import { NotFound } from "./pages/NotFound";

// These two pages carry the heaviest installed components (Motion's tabs, Radix's accordion),
// so they are downloaded only when visited and the home page stays light.
const Schedule = lazy(() => import("./pages/Schedule").then((m) => ({ default: m.Schedule })));
const Faq = lazy(() => import("./pages/Faq").then((m) => ({ default: m.Faq })));

export default function App() {
  return (
    <TooltipProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="workshops" element={<ComingSoon title="Workshops" />} />
          <Route path="projects" element={<ComingSoon title="Projects" />} />
          <Route path="sponsors" element={<Sponsors />} />
          <Route path="faq" element={<Faq />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="code-of-conduct" element={<CodeOfConduct />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </TooltipProvider>
  );
}
