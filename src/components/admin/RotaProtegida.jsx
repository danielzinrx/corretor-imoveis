/* =============================================
   COMPONENTE — RotaProtegida
   Só deixa passar quem está logado; senão vai para /admin/login.
   (A segurança de verdade está nas regras do Firebase.)
   ============================================= */

import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { observarAuth } from '../../services/authService.js';
import Loader from '../ui/Loader.jsx';

export default function RotaProtegida({ children }) {
  const [usuario,    setUsuario]    = useState(null);
  const [carregando, setCarregando] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const cancelar = observarAuth(user => {
      setUsuario(user);
      setCarregando(false);
    });
    return cancelar;
  }, []);

  if (carregando) {
    return <div className="pagina-carregando"><Loader texto="Verificando acesso..." /></div>;
  }

  if (!usuario) {
    return <Navigate to="/admin/login" replace state={{ de: location.pathname }} />;
  }

  return children;
}
