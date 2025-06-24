// Importa el objeto db (con modelos: User, Role, etc.) desde la carpeta models
import db from "../models/index.js";
const { user: User, role: Role } = db;

// Importa la librería jsonwebtoken para generar tokens JWT
import jwt from "jsonwebtoken";

// Importa bcryptjs para encriptar y comparar contraseñas
import bcrypt from "bcryptjs";

// Importa la configuración (clave secreta) desde un archivo de configuración
import authConfig from "../config/auth.config.js";

// Controlador para el registro de usuario
export const signup = async (req, res) => {
  try {
    // Encripta la contraseña antes de guardarla
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);

    // Crea un nuevo usuario con los datos proporcionados
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Asocia el rol correspondiente al usuario (relación muchos a muchos)
    if (req.body.roles) {
      const roles = await Role.findAll({
        where: { name: req.body.roles }
      });

      await newUser.setRoles(roles);
    } else {
      // Por defecto asigna el rol "user"
      await newUser.setRoles([1]); // 1 = id del rol "user"
    }

    res.status(200).json({ message: "¡Usuario registrado exitosamente!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controlador para el inicio de sesión
export const signin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Busca al usuario por nombre de usuario
    const user = await User.findOne({
      where: { username },
    });

    // Si no se encuentra el usuario, responde con error 404
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compara la contraseña proporcionada con la almacenada (ya encriptada)
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ accessToken: null, message: "Invalid Password!" });
    }

    // Si la contraseña es válida, genera un token JWT que expira en 24 horas
    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: 86400, // 24 horas
    });

    // Extrae los roles del usuario y los transforma en formato "ROLE_NOMBRE"
    const roles = await user.getRoles();
    const authorities = roles.map((role) => "ROLE_" + role.name.toUpperCase());

    // Devuelve los datos del usuario y el token de acceso
    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
