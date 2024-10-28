import axios from 'axios';

const PRODUCTS_BASE_URL = 'https://panda-market-api.vercel.app/products';

async function apiRequest(method,url,data = {},params = {}) {
  try {
    const config = {method, url, data, params};
    const response = await axios(config);
    return response.data;
  } catch(error) {
    console.log('API 요청 오류: ',error);
    throw error;
  }
}

async function getProduct(page = 1, pageSize = 10, orderBy = 'recent', keyword) {
  const params = {page,pageSize,orderBy,keyword}
  return apiRequest('GET',PRODUCTS_BASE_URL,{},params);   
}

export default getProduct;