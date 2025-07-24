import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from '/src/csrf.js';

document.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('register-form');

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

        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Vérification du mot de passe
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.");
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/auth', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-xsrf-token': csrfToken
                },
                body: JSON.stringify({
                    username,
                    email,
                    password
                })
            });

            const data = await res.json();

            if (res.ok) {
                const res = await fetch('http://localhost:3000/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'x-xsrf-token': csrfToken
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
            } else {
                console.error('Erreur serveur :', data);
                alert('Erreur : ' + data.message);
            }
        } catch (error) {
            console.error('Erreur fetch :', error);
            alert('Erreur réseau ou serveur.');
        }
    });
});
