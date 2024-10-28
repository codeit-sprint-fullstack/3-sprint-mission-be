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
  const url = await axios.delete(`${BASE_URL}/${id}`);
  return url.data;
}

// Export
const ProductService = {
  getProductList, getProduct, createProduct, patchProduct, deleteProduct
}

export default ProductService;