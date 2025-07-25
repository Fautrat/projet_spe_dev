import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from './csrf.js';

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

async function loadProduct() {
    try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
            credentials: 'include'
        });
        const product = await res.json();

        document.getElementById('libelle').value = product.libelle;
        document.getElementById('categorie').value = product.categorie;
        document.getElementById('description').value = product.description;
        document.getElementById('prix').value = product.prix;
    } catch (err) {
        console.error(err);
        alert("Impossible de charger le produit.");
    }
}

document.getElementById('modify-product-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('libelle', document.getElementById('libelle').value);
    formData.append('categorie', document.getElementById('categorie').value);
    formData.append('description', document.getElementById('description').value);
    formData.append('prix', document.getElementById('prix').value);
    formData.append('image', document.getElementById('image').files[0]);

    const csrfToken = await getCSRFToken();

    try {
        const res = await fetch(`http://localhost:3000/api/products/${productId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: { 'x-csrf-token': csrfToken },
            body: formData
        });

        if (res.ok) {
            alert('Produit modifié avec succès.');
            window.location.href = 'index.html';
        } else {
            const err = await res.json();
            alert('Erreur : ' + err.message);
        }
    } catch (err) {
        console.error(err);
        alert("Erreur lors de la mise à jour.");
    }
});


loadProduct();
