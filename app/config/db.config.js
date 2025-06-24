// app/config/db.config.js

export default {
  HOST: "dpg-d1d4bo15pdvs73abmu3g-a",
  USER: "admin",
  PASSWORD: "wp5708xhGutdltB30bTURSsHLo7dvTZU",
  DB: "jwt_auth_db_rvc0",
  dialect: "postgres",
  PORT: 5432,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
