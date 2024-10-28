import axios from "axios";

const ARTICLE_BASE_URL = 'https://sprint-mission-api.vercel.app/articles';

axios.interceptors.request.use (
  function(request) {
    console.log('Request Interceptor 성공: ',request.method);
    return request;
  },
  function(error) {
    if(error.response) {
      console.log('Request Interceptor 에러 발생: ',error.response.status);
      return error;
    }
  }
)

axios.interceptors.response.use (
  function(response) {
    console.log('Response Interceptor 성공: ',response.status);
    console.log(response.data);
    return response;
  },
  function(error) {
    if(error.response) {
      console.log('Response Interceptor 에러 발생: ',error.response.status);
      return error;
    }
  }
)

export async function apiRequest(method,url,data = {},params = {}) {
  const config = {method, url, data, params};
  const response = await axios(config);
  return response.data;
}

export async function getArticleList(keyword) {
  return apiRequest('GET', ARTICLE_BASE_URL, {},{page:'1',pageSize:'100',keyword});  
}

export async function getArticle(id) {
  return apiRequest('GET',`${ARTICLE_BASE_URL}/${id}`);
}

export async function createArticle(title,content,image) {
  return apiRequest('POST',ARTICLE_BASE_URL,{title,content,image});
}

export async function patchArticle(id,title,content,image) {
  return apiRequest('PATCH',`${ARTICLE_BASE_URL}/${id}`,{title,content,image});
}

export async function deleteArticle(id) {
  return apiRequest('DELETE',`${ARTICLE_BASE_URL}/${id}`);
}
