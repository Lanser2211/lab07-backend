// Importa express para definir rutas
import express from "express";

// Importa las funciones del controlador de autenticación
import { signup, signin } from "../controllers/auth.controller.js";

// Importa los middlewares que verifican datos antes de registrar un usuario
import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySignUp.js";

// Crea el router para rutas relacionadas con autenticación
const router = express.Router();

// Ruta para registrar nuevo usuario (signup)
// Aplica los middlewares antes de ejecutar la función signup
router.post("/signup", [checkDuplicateUsernameOrEmail, checkRolesExisted], signup);

// Ruta para iniciar sesión (signin)
router.post("/signin", signin);

// Exporta el router
export default router;
