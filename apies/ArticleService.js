// Sprint Mission API - Article Service

const BASE_URL = new URL('https://sprint-mission-api.vercel.app/articles');

// GET Method - 모든 상품 목록 조회
async function getArticleList(page = 1, pageSize = 100, keyword) {
  const url = `${BASE_URL}?page=${page}&pageSize=${pageSize}&keyword=${keyword}`;
  return fetch(url)
    .then(response => response.json())
    .then( data => {
      data,
      console.log(data)})
    .catch( error => console.error('에러가 났습니다.', error))
    .finally(() => console.log('GET FINISH') );
}

async function getArticle(id) {
  const url = `${BASE_URL}/${id}`;
  return fetch(url)
    .then(response => response.json())
    .then( data => {
      data,
      console.log(data)})
    .catch( error => console.error('에러가 났습니다.', error))
    .finally(() => console.log('GET FINISH') );
  }

// POST Method - 상품 등록
async function createArticle(title, content, image) {
  const surveyData = {
    "title": title,
    "content": content,
    "image": image
  }

  return fetch(BASE_URL, {
    method: "POST",
    body: JSON.stringify(surveyData),
    headers: { "Content-Type": "application/json", },
  })
    .then(response => response.json())
    .then(data => {
      data,
      console.log(data)})
    .catch(error => console.err('에러가 났습니다.', error))
    .finally(() => console.log('POST FINISH') );
}

// PATCH Method - 상품 수정
async function patchArticle(id, title, content, image) {
  const url = `${BASE_URL}/${id}`;
  const surveyData = {
    "title": title,
    "content": content,
    "image": image
  }

  return fetch(url, {
    method: "PATCH",
    body: JSON.stringify(surveyData),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(response => response.json())
    .then(data => {
      data,
      console.log(data)})
    .catch(error => console.error('에러가 났습니다.', error))
    .finally(() => console.log('PATCH FINISH') );
}


// DELETE Method - 상품 삭제
async function deleteArticle(id) {
  const url = `${BASE_URL}/${id}`;

  return fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
  })
    .then(response => response.json())
    .then(data => {
      data,
      console.log(data)})
    .catch(error => console.error('에러가 났습니다.', error))
    .finally(() => console.log('DELETE FINISH') );
}

// Export
const ArticleService = {
  getArticleList, getArticle, createArticle, patchArticle, deleteArticle
}

export default ArticleService;