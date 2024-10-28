import { apiRequest } from "./ArticleService.js";

const PRODUCTS_BASE_URL = 'https://sprint-mission-api.vercel.app/products';

export async function getProductList(keyword) {
  return apiRequest('GET', PRODUCTS_BASE_URL, {}, {page:'1', pagsSize:'100', keyword});
}

export async function getProduct(id) {
  return apiRequest('GET',`${PRODUCTS_BASE_URL}/${id}`);
}

export async function createProduct(name,description,price,manufacturer,tags,images) {
  return apiRequest('POST',PRODUCTS_BASE_URL,{name,description,price,manufacturer,tags,images});
}

export async function patchProduct(id,name,description,price,tags,images) {
  return apiRequest('PATCH',`${PRODUCTS_BASE_URL}/${id}`,{name,description,price,tags,images});
}

export async function deleteProduct(id) {
  return apiRequest('DELETE',`${PRODUCTS_BASE_URL}/${id}`);
}

