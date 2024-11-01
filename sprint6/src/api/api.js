import { url } from './endpoint.js';

async function getProducts(params = []) {
  const query = new URLSearchParams(params).toString();
  // 파라미터를 자동으로 정리해서 인코딩

  try {
    const response = await fetch(`${url}${query}`);
    const data = await response.json();
    return data
  } catch (err) {
    console.error('Fetch error:', err);
  }
}

export default getProducts;
