const { JSDOM } = require('jsdom');

//Teste que le bon libellé est inséré dans la carte
function createProductCard(product) {
    const col = document.createElement('div');
    col.className = 'col';
    col.innerHTML = `<div>${product.libelle}</div>`;
    return col;
}

// Teste le bon formatage numérique
describe('createProductCard', () => {
    beforeAll(() => {
        const dom = new JSDOM('<!DOCTYPE html><body></body>');
        global.document = dom.window.document;
    });

    it('crée une carte produit avec le bon libellé', () => {
        const product = { libelle: 'Test Produit' };
        const card = createProductCard(product);
        expect(card.querySelector('div').textContent).toBe('Test Produit');
    });
});

function formatPrice(price) {
    return `${price.toFixed(2)} €`;
}

describe('formatPrice', () => {
    it('formate le prix avec deux décimales et le symbole euro', () => {
        expect(formatPrice(12)).toBe('12.00 €');
        expect(formatPrice(5.5)).toBe('5.50 €');
    });
});