import { url } from './endpoint.js';

async function getProducts(query) {

  try {
    const response = await fetch(`${url}${query}`, {
      headers: {
        'Content-type': 'application/json'
      }
    }
    );
    const data = await response.json();
    return data
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export default getProducts;
