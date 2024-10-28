// Sprint Mission API

const BASE_URL = new URL('https://sprint-mission-api.vercel.app/articles');

// GET Method
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

async function getArticle() {
  return fetch(BASE_URL)
    .then(response => response.json())
    .then( data => {
      data,
      console.log(data)})
    .catch( error => console.error('에러가 났습니다.', error))
    .finally(() => console.log('GET FINISH') );
  }

// POST Method
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

// PATCH Method(동작 확인)
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


// DELETE Method(동작확인)
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