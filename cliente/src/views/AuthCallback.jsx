import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// El backend redirige aquí con ?token=xxx después de un login exitoso con Google.
function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { guardarToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");

    if (token) {
      guardarToken(token);
      navigate("/", { replace: true });
    } else {
      navigate("/login?error=sin_token", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="cargando-auth">Iniciando sesión...</div>;
}

export default AuthCallback;
