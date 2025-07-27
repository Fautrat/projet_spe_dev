import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';

import { getCSRFToken } from '/src/csrf.js';

const getFormValues = () => ({
  username: document.getElementById('username').value,
  email: document.getElementById('email').value,
  password: document.getElementById('password').value,
});

const isPasswordValid = (password) =>
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password);

const registerUser = (user, csrfToken) =>
  fetch('http://localhost:3000/api/auth', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify(user),
  });

const loginUser = (email, password, csrfToken) =>
  fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'x-csrf-token': csrfToken,
    },
    body: JSON.stringify({ email, password }),
  });

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('register-form');

  getCSRFToken()
    .then((csrfToken) => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();

        const { username, email, password } = getFormValues();

        return isPasswordValid(password) ?
            registerUser({ username, email, password }, csrfToken)
              .then((res) => res.json().then((data) => ({ res, data })))
              .then(({ res, data }) => {
                if (!res.ok) throw new Error(data.message);

                return loginUser(email, password, csrfToken)
                  .then((res) => res.json().then((data) => ({ res, data })))
                  .then(({ res, data }) => {
                    if (!res.ok) throw new Error(data.message);
                    alert('Connexion réussie !');
                    window.location.href = 'index.html';
                  });
              })
          : Promise.reject(
              new Error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un symbole.")
            );
      });
    })
    .catch((err) => {
      console.error('Erreur :', err.message);
      alert(err.message.includes('CSRF') ? 'Erreur lors de la récupération du token CSRF.' : err.message);
    });
});
