export const getCartPrices = (items) => {
  const price = {};
  const currentPrice = {};
  const currencies = ['JPY', 'RUB', 'AUD', 'CAD', 'EUR', 'USD', 'GBP']

  items.forEach((item) => {
    currencies.forEach((currency) => {
      if (price[currency]) {
        price[currency] += item.product.price[currency];
      } else {
        price[currency] = item.product.price[currency];
      }

      if (currentPrice[currency]) {
        currentPrice[currency] += item.product.currentPrice[currency];
      } else {
        currentPrice[currency] = item.product.currentPrice[currency];
      }
    })
  });

  return { price, currentPrice };
}