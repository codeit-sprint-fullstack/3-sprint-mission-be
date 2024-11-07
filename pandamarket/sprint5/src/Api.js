import axios from 'axios';

// 스프린트5 URL
const PRODUCTS_BASE_URL = 'https://panda-market-api.vercel.app/products';

// 백엔드 구현 URL
const ITEMS_URL = 'https://products-api-g3ry.onrender.com/products';

async function apiRequest(method,url,data = {},params = {}) {
  try {
    const config = {method, url, data, params};
    const response = await axios(config);
    return response.data;
  } catch(error) {
    console.log('API 요청 오류: ',error);
    throw error;
  }
};

async function getProduct(page = 1, pageSize = 10, orderBy = 'recent', keyword) {
  const params = {page,pageSize,orderBy,keyword}
  return apiRequest('GET',PRODUCTS_BASE_URL,{},params);   
};

export async function getProductList(page = 1, limit = 10, sort = 'recent', search) {
  const params = {page, limit, sort, search};
  return apiRequest('GET',ITEMS_URL,{},params);
};

export async function postProduct(data) {
  return apiRequest('POST',ITEMS_URL,data);
}

export default getProduct;