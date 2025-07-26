export async function IsAuthenticated() {
    try {
        const response = await fetch('http://localhost:3000/api/auth/isConnected', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            return false;
        }
        return true;
    } catch (error) {
        console.error('Error while fetching', error);
        return false;
    }
}
