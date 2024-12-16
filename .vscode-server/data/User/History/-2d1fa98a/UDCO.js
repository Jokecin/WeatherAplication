const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const envContent = `
REACT_APP_GEO_DB_API_KEY=${process.env.GEO_DB_API_KEY}
REACT_APP_GEO_DB_API_HOST=${process.env.GEO_DB_API_HOST}
`;

fs.writeFileSync(".env", envContent.trim());
console.log("Archivo .env generado para React");
