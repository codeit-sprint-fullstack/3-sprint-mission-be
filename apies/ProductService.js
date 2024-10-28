// Sprint Mission API - Product Service
import axios from 'axios';

const BASE_URL = new URL('https://sprint-mission-api.vercel.app/products');

// GET Method
async function getProductList(params = {}) {
  const res = await axios.get(BASE_URL, {
    params,
  });
  return res.data;
}

async function getProduct(id) {
  const url = `${BASE_URL}/${id}`;
  const res = await axios.get(url);
  return res.data;
}

// POST Method
async function createProduct(surveyData) {
  const res = await axios.post(BASE_URL, surveyData);
  return res.data;
}
// const surveyData = {
//   "name": name,
//   "description": description,
//   "price": price,
//   "tags": [tags],
//   "images": [images]
// }

// PATCH Method
async function patchProduct(id, surveyData) {
  const res = await axios.patch(
    `${BASE_URL}/${id}`,
    surveyData,
  );
  return res.data
}

// const surveyData = {
//   "name": name,
//   "description": description,
//   "price": price,
//   "tags": [tags],
//   "images": [images]
// }

// DELETE Method
async function deleteProduct(id) {
  const url = `${BASE_URL}/${id}`;

  try {
    const response = await fetch(BASE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    });
    const data = await response.json();
    return data, console.log(data)
  } catch (error) {
    console.error('에러가 났습니다.', error)
  } finally { console.log('DELETE FINISH') }
}

// Export
const ProductService = {
  getProductList, getProduct, createProduct, patchProduct, deleteProduct
}

export default ProductService;