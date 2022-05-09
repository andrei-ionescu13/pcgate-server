export const getCartPrices = (items) => {
  const fullPrice = {};
  const price = {};
  const currencies = ['JPY', 'EUR', 'USD', 'GBP']

  items.forEach((item) => {
    currencies.forEach((currency) => {
      if (fullPrice[currency]) {
        fullPrice[currency] += item.product.fullPrice[currency];
      } else {
        fullPrice[currency] = item.product.fullPrice[currency];
      }

      if (price[currency]) {
        price[currency] += item.product.price[currency];
      } else {
        price[currency] = item.product.price[currency];
      }
    })
  });

  return { price: fullPrice, currentPrice: price };
}