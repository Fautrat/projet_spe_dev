import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from '/src/csrf.js';

document.getElementById('add-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('libelle', document.getElementById('libelle').value);
    formData.append('categorie', document.getElementById('categorie').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('prix', document.getElementById('prix').value);
    formData.append('image', document.getElementById('image').files[0]);

    const csrfToken = await getCSRFToken();

    try {
        const res = await fetch('http://localhost:3000/api/products', {
            method: 'POST',
            credentials: 'include',
            headers: { 'x-csrf-token': csrfToken },
            body: formData
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
        alert("Erreur serveur.");
    }
});

