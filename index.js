const express = require("express");
const cors = require("cors");
const fs = require("node:fs");
const jwt = require("jsonwebtoken");

const SECRET_KEY = "CLAVE_ULTRA_SECRETA";
const app = express();
const port = 3000;

// Middleware para CORS y parseo de JSON
app.use(cors());
app.use(express.json());

// Función para leer archivos JSON
const readJsonFile = (path, res) => {
  fs.readFile(path, "utf-8", (err, data) => {
    if (err) {
      console.error(`Error leyendo el archivo: ${path}`, err);
      return res.status(404).json({ error: "Archivo no encontrado" });
    }
    res.json(JSON.parse(data));
  });
};

// Endpoint para autenticación de usuario (generar token)
app.post("/login", (req, res) => {
  const { usuario, contrasena } = req.body;

  // Verificar que las credenciales no estén vacías
  if (!usuario || !contrasena) {
    return res.status(400).json({ message: "Usuario y/o contraseña no pueden estar vacíos" });
  }

  const token = jwt.sign({ usuario }, SECRET_KEY, { expiresIn: "1h" });
  
  return res.status(200).json({ token });
});


// Middleware para proteger rutas
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Debe iniciar sesión" });
  }
  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token inválido o expirado" });
  }
};

// Endpoint para guardar el carrito de compras
app.post("/cart", (req, res) => {
  const { user, cartItems } = req.body;

  // Validar que los datos del carrito sean correctos
  if (!user || !cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
    return res.status(400).json({ message: "Datos del carrito inválidos" });
  }

  // Crear un objeto para guardar el carrito
  const cartData = {
    user,
    cartItems,
    createdAt: new Date().toISOString()
  };

  // Leer los datos actuales del carrito (si existen)
  fs.readFile("cartData.json", "utf-8", (err, data) => {
    let existingCartData = [];
    if (!err) {
      existingCartData = JSON.parse(data); // Si el archivo ya existe, lo leemos
    }

    // Agregar los datos del nuevo carrito al archivo existente
    existingCartData.push(cartData);

    // Guardar el archivo actualizado
    fs.writeFile("cartData.json", JSON.stringify(existingCartData, null, 2), (err) => {
      if (err) {
        return res.status(500).json({ message: "Error al guardar el carrito" });
      }
      res.status(200).json({ message: "Carrito guardado correctamente" });
    });
  });
});

// Usar middleware para proteger las rutas de /emercado-api
app.use("/emercado-api", authMiddleware);

// Rutas para la API
app.get("/emercado-api/cart/buy", (req, res) => {
  readJsonFile("json/cart/buy.json", res);
});

app.get("/emercado-api/cats/cat", (req, res) => {
  readJsonFile("json/cats/cat.json", res);
});

app.get("/emercado-api/cats_products/:catId", (req, res) => {
  const catId = req.params.catId;
  readJsonFile(`json/cats_products/${catId}.json`, res);
});

app.get("/emercado-api/products/:productId", (req, res) => {
  const productId = req.params.productId;
  readJsonFile(`json/products/${productId}.json`, res);
});

app.get("/emercado-api/products_comments/:productId", (req, res) => {
  const productId = req.params.productId;
  readJsonFile(`json/products_comments/${productId}.json`, res);
});

app.get("/emercado-api/sell/publish", (req, res) => {
  readJsonFile("json/sell/publish.json", res);
});

app.get("/emercado-api/user_cart/", (req, res) => {
  readJsonFile("json/user_cart/25801.json", res);
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`API escuchando en http://localhost:${port}`);
});
