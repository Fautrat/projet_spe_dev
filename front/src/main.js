import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { getCSRFToken } from '/src/csrf.js';
import {IsAuthenticated} from '/src/auth.js';
import { addToGuestBasket, getGuestBasket } from './guest-basket.js';

const productList = document.getElementById('product-list');
let allProducts = [];
let isConnected = false;
(async () => {
    isConnected = await IsAuthenticated();
    updateCartBadge();
    updateUIForAuth();
})();

function updateUIForAuth() 
{
    renderProducts(allProducts, isConnected);
    if (isConnected) showAuthUI();
    else  showGuestUI();
}


// Fonction pour créer une card Bootstrap pour un produit
function createProductCard(product, isConnected) 
{
    const col = document.createElement('div');
    col.className = 'col';

    col.innerHTML = `
        <div class="card h-100 shadow-sm">
        <img src=${product.imagePath ? "http://localhost:3000" +product.imagePath : "https://picsum.photos/id/237/400/300"} class="card-img-top" alt="${product.libelle}">
        <div class="card-body d-flex flex-column">
            <h5 class="card-title text-center">${product.libelle}</h5>
            <p class="card-text text-muted text-center">${product.categorie}</p>
            <p class="card-text">${product.description}</p>
            <div class="mt-auto">
            <p class="fw-bold text-end">${product.prix} €</p>
            <div class="d-flex gap-2 flex-wrap">
                <a href="product.html?id=${product.id}" class="btn btn-primary btn-sm flex-fill">Voir</a>
                <a href="#" class="btn btn-outline-secondary btn-sm flex-fill basket-btn" data-id="${product.id}">+</a>
                ${isConnected
                ? `
                <a href="modify-product.html?id=${product.id}" class="btn btn-warning btn-sm flex-fill">Modifier</a>
                <a href="#" class="btn btn-danger btn-sm flex-fill delete-btn" data-id="${product.id}">Supprimer</a>
                ` : ''
                }
            </div>
            </div>
        </div>
        </div>
    `;
    return col;
}

// Fonction pour afficher une liste de produits avec de la logique
async function renderProducts(products, isConnected = false) {
    productList.innerHTML = '';
    products.forEach((product) => {
        const card = createProductCard(product, isConnected);
        productList.appendChild(card);
    });

    const deleteButtons = document.querySelectorAll('.delete-btn');
    const basketButtons = document.querySelectorAll('.basket-btn');

    const csrfToken = await getCSRFToken();

    deleteButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');

            if (!confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) return;

            try {
                const res = await fetch(`http://localhost:3000/api/products/${id}`, {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-csrf-token': csrfToken
                    }
                });

                if (res.ok) {
                    alert('Produit supprimé avec succès.');
                    // Met à jour la liste localement
                    allProducts = allProducts.filter(p => p.id != id);
                    await renderProducts(allProducts, isConnected);
                    updateCartBadge();
                } else {
                    const error = await res.json();
                    alert('Erreur lors de la suppression : ' + error.message);
                }
            } catch (err) {
                console.error(err);
                alert("Erreur côté client.");
            }
        });
    });

    basketButtons.forEach((btn) => {
        btn.addEventListener('click', async (e) => {
            e.preventDefault();
            const id = btn.getAttribute('data-id');

            // utilisateur connecté
            if (isConnected) {
                try {
                    const res = await fetch(`http://localhost:3000/api/basket`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: {
                            'Content-Type': 'application/json',
                            'x-csrf-token': csrfToken
                        },
                        body: JSON.stringify({ productId: id })
                    });

                    if (res.ok) {
                        alert('Produit ajouté au panier avec succès.');
                        updateCartBadge();
                    } else {
                        const error = await res.json();
                        alert('Erreur lors de l\'ajout au panier : ' + error.message);
                    }
                } catch (err) {
                    console.error(err);
                    alert("Erreur côté client.");
                }
            }
            else
            {
                // Utilisateur non connecté → localStorage
                addToGuestBasket(id);
                alert("Produit ajouté au panier.");
                updateCartBadge();
            }
        });
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
    const logoutBtn = document.getElementById('logout-btn');

    document.getElementById('login-btn').classList.add('d-none');
    document.getElementById('register-btn').classList.add('d-none');
    logoutBtn.classList.remove('d-none');
    document.getElementById('add-product-container').classList.remove('d-none');

    logoutBtn.addEventListener('click', async () => {

        try {
            const csrfToken = await getCSRFToken();

            await fetch('http://localhost:3000/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-csrf-token': csrfToken
                }
            });
            location.reload();
        } catch (err) {
            console.error('Erreur lors de la déconnexion :', err);
            alert("Impossible de se déconnecter.");
        }
    });
}

function showGuestUI() {
    document.getElementById('login-btn').classList.remove('d-none');
    document.getElementById('register-btn').classList.remove('d-none');
    document.getElementById('logout-btn').classList.add('d-none');
    document.getElementById('add-product-container').classList.add('d-none');
}

async function updateCartBadge() {
    const badge = document.getElementById('cart-badge');

    if (isConnected) {
        try {
            const res = await fetch('http://localhost:3000/api/basket', {
                credentials: 'include',
            });

            if (!res.ok) {
                badge.classList.add('d-none');
                return;
            }

            const basket = await res.json();
            const totalItems = basket.BasketItems.reduce((sum, item) => sum + item.quantity, 0);
            console.log(totalItems);
            console.log(badge);
            badge.textContent = totalItems;
            badge.classList.remove('d-none');
        } catch (err) {
            badge.classList.add('d-none');
        }
    } else {
        const guestBasket = getGuestBasket();
        const totalItems = guestBasket.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = totalItems;
        badge.classList.remove('d-none');
    }
}

