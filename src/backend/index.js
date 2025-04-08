const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Connexion à la base de données MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mot_de_passe",
  database: "maBase",
});

db.connect((err) => {
  if (err) {
    console.error("Erreur de connexion à MySQL:", err);
  } else {
    console.log("Connecté à MySQL !");
  }
});

// Route pour récupérer les données
app.get("/items", (req, res) => {
  db.query("SELECT * FROM items", (err, results) => {
    if (err) {
      console.error("Erreur lors de la requête:", err);
      res.status(500).json({ error: "Erreur serveur" });
    } else {
      res.json(results);
    }
  });
});

// Lancer le serveur
app.listen(5000, () => console.log("Serveur backend sur http://localhost:5000"));
