import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from '/src/csrf.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('login-form');

    // Récupère le token CSRF
    let csrfToken = '';
    try {
        csrfToken = await getCSRFToken();
        console.log('CSRF Token reçu :', csrfToken);
    } catch (err) {
        console.error('Erreur CSRF :', err);
        alert("Erreur lors de la récupération du token CSRF.");
        return;
    }

    // Envoie les données
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        const res = await fetch('http://localhost:3000/api/auth/login', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'x-csrf-token': csrfToken
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if (res.ok) {
            alert('Connexion réussie !');
            window.location.href = 'index.html';
        } else {
            const error = await res.json();
            alert('Erreur : ' + error.message);
        }
    });
});
