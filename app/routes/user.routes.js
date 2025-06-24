// Importa express para crear rutas
import express from "express";

// Importa los controladores que manejan las respuestas según el rol del usuario
import {
  allAccess,
  userBoard,
  adminBoard,
  moderatorBoard,
} from "../controllers/user.controller.js";

// Importa middlewares de autenticación y autorización
import {
  verifyToken,
  isAdmin,
  isModerator,
  isModeratorOrAdmin,
} from "../middlewares/authJwt.js";

// Crea una instancia de router para las rutas protegidas por roles
const router = express.Router();

// Ruta pública: no requiere autenticación
router.get("/all", allAccess);

// Ruta solo para usuarios autenticados (requiere token JWT válido)
router.get("/user", [verifyToken], userBoard);

// Ruta solo para moderadores (requiere token + rol moderator)
router.get("/mod", [verifyToken, isModerator], moderatorBoard);

// Ruta solo para administradores (requiere token + rol admin)
router.get("/admin", [verifyToken, isAdmin], adminBoard);

// Ruta que acepta admin o moderator
router.get("/perm", [verifyToken, isModeratorOrAdmin], (req, res) =>
  res.status(200).send("Contenido para moderadores o administradores.")
);

// Exporta el router
export default router;
