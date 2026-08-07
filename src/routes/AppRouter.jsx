import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "../components/Layout";

import Home from "../views/Home";
import Clientes from "../views/Clientes";
import Planes from "../views/Planes";
import Pagos from "../views/Pagos";
import Asistencias from "../views/Asistencias";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<Clientes />} />
          <Route path="/planes" element={<Planes />} />
          <Route path="/pagos" element={<Pagos />} />
          <Route path="/asistencias" element={<Asistencias />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
