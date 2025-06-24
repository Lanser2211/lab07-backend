// Importamos dotenv para cargar variables de entorno
import dotenv from "dotenv";
dotenv.config();

// Importamos Sequelize
import Sequelize from "sequelize";

// Importamos configuración de la base de datos
import dbConfig from "../config/db.config.js";

// Importamos modelos
import userModel from "./user.model.js";
import roleModel from "./role.model.js";

// Creamos instancia de Sequelize con la configuración
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  dialect: dbConfig.dialect,
  port: dbConfig.PORT || 5432,
  pool: dbConfig.pool,
  logging: false, // Puedes poner true si quieres ver las consultas en consola
});

// Creamos el objeto para almacenar Sequelize y modelos
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Definimos los modelos
db.user = userModel(sequelize, Sequelize);
db.role = roleModel(sequelize, Sequelize);

// Relaciones muchos a muchos entre usuarios y roles
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId",
});

db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId",
});

// Roles disponibles
db.ROLES = ["user", "admin", "moderator"];

// Exportamos el objeto db
export default db;
