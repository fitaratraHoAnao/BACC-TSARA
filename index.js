
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, 'public')));

// Middleware pour servir les fichiers PDF
app.use('/fonctionnement', express.static(path.join(__dirname, 'fonctionnement')));

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Créer les répertoires nécessaires s'ils n'existent pas
const series = ['A', 'D', 'C', 'S', 'Ose', 'L'];
const matieres = ['HG', 'MLG', 'FRS', 'PC', 'MATH', 'SVT', 'ANG', 'PHILO'];
const types = ['sujet', 'correction', 'cours'];

const directories = ['public'];

// Générer tous les répertoires nécessaires pour chaque combinaison
types.forEach(type => {
  matieres.forEach(matiere => {
    series.forEach(serie => {
      directories.push(`fonctionnement/${type}/${matiere}/${serie}`);
    });
  });
});

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`Répertoire créé: ${dir}`);
  }
});

// Démarrer le serveur
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Serveur démarré sur http://0.0.0.0:${PORT}`);
  console.log('Pour accéder au site, cliquez sur l\'URL dans le terminal ou sur le bouton "Open" dans Replit');
});
