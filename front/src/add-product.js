import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from '/src/csrf.js';

document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const libelle = document.getElementById('libelle').value;
    const categorie = document.getElementById('categorie').value;
    const description = document.getElementById('description').value;
    const prix = document.getElementById('prix').value;

    const csrfToken = await getCSRFToken();

    try {
        const res = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
            'x-csrf-token': csrfToken
        },
        body: JSON.stringify({ libelle, categorie, description, prix })
        });

        if (res.ok) {
        alert('Produit ajouté avec succès !');
        window.location.href = 'index.html';
        } else {
        const err = await res.json();
        alert('Erreur : ' + err.message);
        }
    } catch (err) {
        console.error(err);
        alert("Erreur réseau.");
    }
});
