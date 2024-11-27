const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const jwt =  require("jsonwebtoken");

const SECRET_KEY = "CLAVE ULTRA SECRETA";
const app = express();
const port = 3000;

// Middleware para CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Funcion para leer archivos JSON
const readJsonFile = (path, res) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.error(`Error leyendo el archivo: ${path}`, err);
      return res.status(404).json({ error: "Archivo no encontrado" });
    }
    res.json(JSON.parse(data));
  });
};

// Endpoint para autenticar usuarios y generar token
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: "Usuario y/o contraseña no pueden estar vacíos" });
  }
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.status(200).json({ token });
});

// Middleware para proteger rutas
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Token no proporcionado o inválido" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Token invalido o expirado" });
  }
};

// Usar middleware para proteger las rutas de /emercado-api
app.use("/emercado-api", authMiddleware);

// Rutas para la API
app.get("/emercado-api/cart/buy", authMiddleware, (req, res) => {
  readJsonFile("json/cart/buy.json", res);
});

app.get("/emercado-api/cats/cat", authMiddleware, (req, res) => {
  readJsonFile("json/cats/cat.json", res);
});

app.get("/emercado-api/cats_products/:catId", authMiddleware, (req, res) => {
  const catId = req.params.catId;
  readJsonFile(`json/cats_products/${catId}.json`, res);
});

app.get("/emercado-api/products/:productId", authMiddleware, (req, res) => {
  const productId = req.params.productId;
  readJsonFile(`json/products/${productId}.json`, res);
});

app.get("/emercado-api/products_comments/:productId", authMiddleware, (req, res) => {
  const productId = req.params.productId;
  readJsonFile(`json/products_comments/${productId}.json`, res);
});

app.get("/emercado-api/sell/publish", authMiddleware, (req, res) => {
  readJsonFile("json/sell/publish.json", res);
});

app.get("/emercado-api/user_cart/", authMiddleware, (req, res) => {
  readJsonFile("json/user_cart/25801.json", res);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});