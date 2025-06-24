// Importa dotenv para leer variables de entorno (importante para producción)
import dotenv from "dotenv";
dotenv.config();

// Importa Express y CORS
import express from "express";
import cors from "cors";

// Importa Sequelize y modelos
import db from "./app/models/index.js";

// Importa rutas
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

// Inicializa la app
const app = express();

// Configura CORS (puedes permitir más dominios en producción)
const corsOptions = {
  origin: "http://localhost:3000" // Cambia esto si el frontend también está en Render
};
app.use(cors(corsOptions));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta de prueba
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

// Rutas principales
app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

// Puerto dinámico para Render (usa variable de entorno o 8080 por defecto)
const PORT = process.env.PORT || 8080;

// Conectar con la base de datos y luego iniciar el servidor
db.sequelize.sync({ force: false }).then(() => {
  console.log("✅ Database synchronized!");
  app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}.`);
  });
}).catch(err => {
  console.error("❌ Error connecting to the database:", err);
});
