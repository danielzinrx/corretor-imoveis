/* =============================================
   APP — Rotas e estrutura geral do site
   ============================================= */

import React, { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';

import Header from './components/layout/Header.jsx';
import Footer from './components/layout/Footer.jsx';
import BotaoWhatsappFlutuante from './components/layout/BotaoWhatsappFlutuante.jsx';
import Loader from './components/ui/Loader.jsx';
import RotaProtegida from './components/admin/RotaProtegida.jsx';

import Home from './pages/Home.jsx';
import Imoveis from './pages/Imoveis.jsx';
import DetalheImovel from './pages/DetalheImovel.jsx';
import Sobre from './pages/Sobre.jsx';
import Contato from './pages/Contato.jsx';
import NaoEncontrado from './pages/NaoEncontrado.jsx';

/* O painel admin só é baixado quando o corretor acessa /admin */
const Login        = lazy(() => import('./pages/admin/Login.jsx'));
const Painel       = lazy(() => import('./pages/admin/Painel.jsx'));
const NovoImovel   = lazy(() => import('./pages/admin/NovoImovel.jsx'));
const EditarImovel = lazy(() => import('./pages/admin/EditarImovel.jsx'));

/* Volta ao topo a cada troca de página */
function RolarParaTopo() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/* Cabeçalho + conteúdo + rodapé */
function LayoutPublico() {
  return (
    <>
      <Header />
      <Outlet />
      <Footer />
      <BotaoWhatsappFlutuante />
    </>
  );
}

export default function App() {
  return (
    <>
      <RolarParaTopo />
      <Suspense fallback={<div className="pagina-carregando"><Loader /></div>}>
        <Routes>
          <Route element={<LayoutPublico />}>
            <Route path="/"             element={<Home />} />
            <Route path="/imoveis"      element={<Imoveis />} />
            <Route path="/imoveis/:id"  element={<DetalheImovel />} />
            <Route path="/sobre"        element={<Sobre />} />
            <Route path="/contato"      element={<Contato />} />

            {/* Área do corretor */}
            <Route path="/admin/login"  element={<Login />} />
            <Route path="/admin" element={<RotaProtegida><Painel /></RotaProtegida>} />
            <Route path="/admin/novo"   element={<RotaProtegida><NovoImovel /></RotaProtegida>} />
            <Route path="/admin/editar/:id" element={<RotaProtegida><EditarImovel /></RotaProtegida>} />

            <Route path="*" element={<NaoEncontrado />} />
          </Route>
        </Routes>
      </Suspense>
    </>
  );
}
