function parsePrice(price) {
    if (!price) return 0;
    const cleanPrice = price.replace(',', '.').replace(/[^0-9.]/g, '');
    return parseFloat(cleanPrice);
}

function getPriceToUse(product) {
    const priceToUse = (product.discount_price && product.discount_price.trim() !== '')
        ? product.discount_price
        : product.price;
    return priceToUse;
}

const testCases = [
    { name: "Regular price only", price: "39€", discount_price: null, expected: 39 },
    { name: "Promo price set", price: "39€", discount_price: "29€", expected: 29 },
    { name: "Promo price with comma", price: "39,99€", discount_price: "29,99€", expected: 29.99 },
    { name: "Empty promo price", price: "39€", discount_price: "  ", expected: 39 },
    { name: "Promo price without symbol", price: "39€", discount_price: "25", expected: 25 },
];

console.log("Running Price Parsing Logic Verification (Synchronized)...");
let allPassed = true;

testCases.forEach(tc => {
    const product = { price: tc.price, discount_price: tc.discount_price };
    const priceToUse = getPriceToUse(product);
    const result = parsePrice(priceToUse);
    const passed = result === tc.expected;
    console.log(`${passed ? '✅' : '❌'} ${tc.name}: Got ${result}, Expected ${tc.expected}`);
    if (!passed) allPassed = false;
});

if (allPassed) {
    console.log("\n✅ All tests passed!");
} else {
    console.log("\n❌ Some tests failed.");
    process.exit(1);
}
