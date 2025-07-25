export async function IsAuthenticated() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            window.location.href = '/login';
            return;
        }
    } catch (error) {
        console.error('Error while fetching', error);
        window.location.href = '/login';
    }
}
