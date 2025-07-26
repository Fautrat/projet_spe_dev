import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { getCSRFToken } from './csrf.js';
import { IsAuthenticated } from './auth.js';
import { getGuestBasket, removeFromGuestBasket, clearGuestBasket } from './guest-basket.js';

const productList = document.getElementById('product-list');
const clearBtn = document.getElementById('clear-basket-btn');
const logoutBtn = document.getElementById('logout-btn');

let isConnected = false;

(async () => {
    isConnected = await IsAuthenticated();

    if (isConnected) {
        document.getElementById('navbar-logout').classList.remove('d-none');
        loadBasketFromServer();
    } else {
        document.getElementById('navbar-logout').classList.add('d-none');
        loadBasketFromLocalStorage();
    }
})();

// Pour utilisateur connecté
async function loadBasketFromServer() {
    try {
        const res = await fetch('http://localhost:3000/api/basket', {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!res.ok) throw new Error('Erreur serveur panier');

        const basket = await res.json();
        renderBasket(basket.BasketItems, true);
    } catch (err) {
        console.error(err);
        productList.innerHTML = `<div class="alert alert-danger">Erreur : ${err.message}</div>`;
    }
}

// Pour utilisateur invité
async function loadBasketFromLocalStorage() {
    const guestItems = getGuestBasket();
    const fullItems = [];

    for (const item of guestItems) {
        try {
            const res = await fetch(`http://localhost:3000/api/products/${item.productId}`);
            if (res.ok) {
                const product = await res.json();
                fullItems.push({ Product: product, quantity: item.quantity });
            }
        } catch (err) {
            console.warn('Erreur produit :', item.productId);
        }
    }

    renderBasket(fullItems, false);
}

async function renderBasket(items, connected) {
    productList.innerHTML = '';
    const csrfToken = connected ? await getCSRFToken() : null;

    items.forEach((item) => {
        const card = createProductCard(item);
        productList.appendChild(card);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const productId = btn.getAttribute('data-id');
            if (!confirm('Supprimer ce produit du panier ?')) return;

            if (connected) {
                try {
                    const res = await fetch(`http://localhost:3000/api/basket/${productId}`, {
                        method: 'DELETE',
                        credentials: 'include',
                        headers: { 'x-csrf-token': csrfToken }
                    });

                    if (res.ok) {
                        alert('Produit supprimé.');
                        loadBasketFromServer();
                    } else {
                        const err = await res.json();
                        alert('Erreur : ' + err.message);
                    }
                } catch (err) {
                    alert('Erreur réseau.');
                }
            } else {
                removeFromGuestBasket(productId);
                alert('Produit supprimé.');
                loadBasketFromLocalStorage();
            }
        });
    });
}

function createProductCard(item) {
    const col = document.createElement('div');
    const product = item.Product;
    col.className = 'col';

    col.innerHTML = `
      <div class="card h-100 shadow-sm">
        <img src="${product.imagePath ? `http://localhost:3000${product.imagePath}` : 'https://picsum.photos/id/237/400/300'}" 
             class="card-img-top" 
             alt="${product.libelle}">
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${product.libelle}</h5>
          <p class="card-text text-muted">${product.categorie}</p>
          <p class="card-text">${product.description}</p>
          <div class="mt-auto">
            <p class="fw-bold text-end">${product.prix} €</p>
            <p class="text-muted">Quantité : ${item.quantity}</p>
            <button class="btn btn-danger btn-sm w-100 remove-btn" data-id="${product.id}">
              Supprimer du panier
            </button>
          </div>
        </div>
      </div>
    `;
    return col;
}

if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
        if (!confirm('Vider entièrement le panier ?')) return;

        if (isConnected) {
            const csrfToken = await getCSRFToken();
            try {
                const res = await fetch('http://localhost:3000/api/basket/clear', {
                    method: 'DELETE',
                    credentials: 'include',
                    headers: { 'x-csrf-token': csrfToken }
                });

                if (res.ok) {
                    alert('Panier vidé.');
                    loadBasketFromServer();
                } else {
                    const err = await res.json();
                    alert('Erreur : ' + err.message);
                }
            } catch (err) {
                alert('Erreur réseau.');
            }
        } else {
            clearGuestBasket();
            alert('Panier vidé.');
            loadBasketFromLocalStorage();
        }
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('http://localhost:3000/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = '/index.html';
    });
}
