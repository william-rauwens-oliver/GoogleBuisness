import express from 'express';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

// Route pour récupérer les détails du magasin à partir du placeId
app.get('/place-details', async (req, res) => {
    const { placeId } = req.query;

    if (!placeId) {
        return res.status(400).send('placeId manquant');
    }

    try {
        const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&API_KEY`);
        const data = await response.json();

        // Vérifie si la requête a réussi
        if (response.ok && data.status === 'OK') {
            res.status(200).json(data.result);
        } else {
            // Si la requête a échoué, renvoyez une erreur
            res.status(500).json({ error: 'Erreur lors de la récupération des détails du lieu' });
        }
    } catch (error) {
        // Si une erreur s'est produite lors de la requête, renvoyez une erreur
        res.status(500).json({ error: error.message });
    }
});

// Route pour envoyer un commentaire sur le magasin
app.post('/send-comment', async (req, res) => {
    const { placeId, comment } = req.body;
    const apiKey = process.env.API_KEY;

    res.status(200).send('Commentaire envoyé avec succès');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
