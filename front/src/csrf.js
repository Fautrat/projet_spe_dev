export async function getCSRFToken() {
  const res = await fetch('http://localhost:3000/api/csrf-token', {
    credentials: 'include',
  });
  const data = await res.json();
  return data.csrfToken;
}
