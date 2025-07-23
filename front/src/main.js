import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const productList = document.getElementById('product-list');
let allProducts = [];

// Fonction pour créer une card Bootstrap pour un produit
function createProductCard(product) 
{
    const col = document.createElement('div');
    col.className = 'col';

    // ${product.image[0]}

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
        <img src="https://picsum.photos/id/237/400/300" class="card-img-top" alt="${product.libelle}">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.libelle}</h5>
            <p class="card-text text-muted">${product.categorie}</p>
            <p class="card-text">${product.description}</p>
            <div class="mt-auto">
            <p class="fw-bold text-end">${product.prix} €</p>
            <a href="product.html?id=${product.id}" class="btn btn-primary w-100">Voir le produit</a>
            </div>
        </div>
        </div>
    `;
    return col;
}

// Fonction pour afficher une liste de produits
function renderProducts(products) 
{
    productList.innerHTML = '';
    products.forEach((product) => {
        const card = createProductCard(product);
        productList.appendChild(card);
    });
}

// Chargement initial des produits
fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((products) => {
        allProducts = products;
        renderProducts(allProducts);
    })
    .catch((err) => {
        productList.innerHTML = `<div class="alert alert-danger">Erreur lors du chargement des produits.</div>`;
        console.error(err);
    });

// Événement sur la recherche
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    const filtered = allProducts.filter((p) =>
        p.libelle.toLowerCase().includes(query)
    );
    renderProducts(filtered);
});
