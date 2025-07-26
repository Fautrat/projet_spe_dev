const GUEST_BASKET_KEY = 'guestBasket';

export function getGuestBasket() {
    const raw = localStorage.getItem(GUEST_BASKET_KEY);
    return raw ? JSON.parse(raw) : [];
}

export function addToGuestBasket(productId) {
    const basket = getGuestBasket();
    const existing = basket.find(p => p.productId === productId);

    if (existing) {
        existing.quantity += 1;
    } else {
        basket.push({ productId, quantity: 1 });
    }

    localStorage.setItem(GUEST_BASKET_KEY, JSON.stringify(basket));
}

export function removeFromGuestBasket(productId) {
    const basket = getGuestBasket().filter(p => p.productId != productId);
    localStorage.setItem(GUEST_BASKET_KEY, JSON.stringify(basket));
}

export function clearGuestBasket() {
    localStorage.removeItem(GUEST_BASKET_KEY);
}
