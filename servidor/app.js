require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const passport = require("./config/passport");

const authRoutes = require("./routes/auth.routes");
const entrenadorRoutes = require("./routes/entrenador.routes");
const clienteRoutes = require("./routes/cliente.routes");
const planRoutes = require("./routes/plan.routes");
const membresiaRoutes = require("./routes/membresia.routes");
const pagoRoutes = require("./routes/pago.routes");
const paseDiarioRoutes = require("./routes/paseDiario.routes");

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

// express-session es requerido internamente por Passport para el handshake OAuth,
// aunque la sesión final de la app funciona con JWT (session: false en las rutas).
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/entrenadores", entrenadorRoutes);
app.use("/api/clientes", clienteRoutes);
app.use("/api/planes", planRoutes);
app.use("/api/membresias", membresiaRoutes);
app.use("/api/pagos", pagoRoutes);
app.use("/api/pases-diarios", paseDiarioRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
