import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

// Lire l'ID du produit depuis l'URL
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get('id');

// Fonction pour afficher un produit dans la page
function displayProduct(product) {
    const container = document.createElement('div');
    container.className = 'container my-5 d-flex justify-content-center';

    container.innerHTML = `
        <div class="card shadow style="max-width: 600px; width: 100%;">
            <img src=${product.imagePath ? "http://localhost:3000" +product.imagePath : "https://picsum.photos/id/237/400/300"} class="card-img-top" alt="${product.libelle}">
            <div class="card-body">
                <h3 class="card-title text-center">${product.libelle}</h3>
                <p class="card-text text-muted text-center">${product.categorie}</p>
                <p class="card-text">${product.description}</p>
                <h4 class="fw-bold text-end">${product.prix} €</h4>
                <a href="index.html" class="btn btn-secondary mt-3">Retour</a>
            </div>
        </div>`;

    document.body.appendChild(container);
}

// Si on a bien un ID, on récupère le produit
if (productId) {
    fetch(`http://localhost:3000/api/products/${productId}`)
        .then(res => {
            if (!res.ok) {
                throw new Error('Produit non trouvé');
            }
            return res.json();
        })
        .then(product => {
            displayProduct(product);
        })
        .catch(err => {
            document.body.innerHTML = `<div class="alert alert-danger m-5">Erreur lors du chargement du produit.</div>`;
            console.error(err);
        });
} else {
    document.body.innerHTML = `<div class="alert alert-warning m-5">Aucun produit sélectionné.</div>`;
}