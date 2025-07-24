import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

const productList = document.getElementById('product-list');
let allProducts = [];
let isConnected = false;

function updateUIForAuth() {
    fetch('http://localhost:3000/api/auth/me', {
        method: 'GET',
        credentials: 'include'
    })
    .then(res => {
        if (res.status === 200) {
            isConnected = true; 
            renderProducts(allProducts, true);
            showAuthUI();
        } else {
            isConnected = false;
            renderProducts(allProducts, false);
            showGuestUI();
        }
    })
    .catch(() => {
        isConnected = false;
        renderProducts(allProducts, false);
        showGuestUI();
    });
}


// Fonction pour créer une card Bootstrap pour un produit
function createProductCard(product, isConnected) 
{
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
        <img src="https://picsum.photos/id/237/400/300" class="card-img-top" alt="${product.libelle}">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title">${product.libelle}</h5>
            <p class="card-text text-muted">${product.categorie}</p>
            <p class="card-text">${product.description}</p>
            <div class="mt-auto">
            <p class="fw-bold text-end">${product.prix} €</p>
            <div class="d-flex gap-2 flex-wrap">
                <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm flex-fill">Voir</a>
                <a href="#" class="btn btn-outline-secondary btn-sm flex-fill">+</a>
                ${isConnected
                ? `
                <a href="modify-product.html?id=${product.id}" class="btn btn-warning btn-sm flex-fill">Modifier</a>
                <a href="delete-product.html?id=${product.id}" class="btn btn-danger btn-sm flex-fill">Supprimer</a>
                ` : ''
                }
            </div>
            </div>
        </div>
        </div>
    `;
    return col;
}

// Fonction pour afficher une liste de produits
function renderProducts(products, isConnected = false) {
    productList.innerHTML = '';
    products.forEach((product) => {
        const card = createProductCard(product, isConnected);
        productList.appendChild(card);
    });
}


// Chargement initial des produits
fetch('http://localhost:3000/api/products')
    .then((res) => res.json())
    .then((products) => {
        allProducts = products;
        updateUIForAuth();
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
    renderProducts(filtered, isConnected);
});

function showAuthUI() {
    document.getElementById('navbar-auth').classList.add('d-none');
    document.getElementById('navbar-logout').classList.remove('d-none');
    document.getElementById('add-product-container').classList.remove('d-none');

    const logoutBtn = document.getElementById('logout-btn');
    logoutBtn.addEventListener('click', async () => {
        await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        });
        location.reload();
    });
}

function showGuestUI() {
    document.getElementById('navbar-auth').classList.remove('d-none');
    document.getElementById('navbar-logout').classList.add('d-none');
    document.getElementById('add-product-container').classList.add('d-none');
}


updateUIForAuth();