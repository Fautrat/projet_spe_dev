import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { getCSRFToken } from './csrf.js';

const productList = document.getElementById('product-list');

async function loadBasket() {
    try {
        const res = await fetch('http://localhost:3000/api/basket', {
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            throw new Error('Erreur lors du chargement du panier');
        }

        const basket = await res.json();
        renderBasket(basket.BasketItems);
    } catch (err) {
        console.error(err);
        productList.innerHTML = `<div class="alert alert-danger">Erreur : ${err.message}</div>`;
    }
}

// Fonction pour créer une card Bootstrap pour un item de panier
function createProductCard(item) 
{
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

async function renderBasket(items) {
    productList.innerHTML = '';

    const csrfToken = await getCSRFToken();

    items.forEach((item) => {
        const card = createProductCard(item);
        productList.appendChild(card);
    });

    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
        const productId = btn.getAttribute('data-id');
        if (!confirm('Supprimer ce produit du panier ?')) return;

        try {
            const res = await fetch(`http://localhost:3000/api/basket/${productId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'x-csrf-token': csrfToken
            }
            });

            if (res.ok) {
            alert('Produit supprimé du panier.');
            loadBasket();
            } else {
            const error = await res.json();
            alert('Erreur : ' + error.message);
            }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau.');
        }
        });
    });
}

// Clear entierement le panier
const clearBtn = document.getElementById('clear-basket-btn');
if (clearBtn) {
    clearBtn.addEventListener('click', async () => {
        if (!confirm('Vider entièrement le panier ?')) return;
        const csrfToken = await getCSRFToken();

        try {
        const res = await fetch('http://localhost:3000/api/basket/clear', {
            method: 'DELETE',
            credentials: 'include',
            headers: { 'x-csrf-token': csrfToken }
        });

        if (res.ok) {
            alert('Panier vidé.');
            loadBasket();
        } else {
            const error = await res.json();
            alert('Erreur : ' + error.message);
        }
        } catch (err) {
            console.error(err);
            alert('Erreur réseau.');
        }
    });
}


// Déconnexion
const logoutBtn = document.getElementById('logout-btn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
        await fetch('http://localhost:3000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
        });
        window.location.href = '/index.html';
    });
}

document.getElementById('navbar-logout').classList.remove('d-none');
loadBasket();
