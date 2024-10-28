// Article, Product Service 실행
import ArticleService from './ArticleService.js'
import ProductService from './ProductService.js'

// Article Service
// await ArticleService.getArticleList(1, 100, '웃음')
// await ArticleService.getArticle()
// await ArticleService.createArticle()
// await ArticleService.patchArticle()
// await ArticleService.deleteArticle()

// // Product Service

// 상품 목록 조회.
try {
  // const getSurveyData = await ProductService.getProductList()
  console.log(getSurveyData)
  
} catch (err) {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
}

// 상품 상세 조회.
try {
  // const getSurveyData = await ProductService.getProduct() // 아규먼트로 id 값인 숫자 입력.
  console.log(getSurveyData)
  
} catch (err) {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
}

// 상품 등록.
const surveyDataPost = {
  "name": '배진han', // String
  "description": '저는 노드를 이용해 api를 공부하고 있습니다.', // String
  "price": 999999, // Number
  "tags": [
    'tags', '무슨 태그를 달아야 하나' // String
  ],
  "images": [
    'https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png' // URL
  ]
}

try {
  // const postSurveyData = await ProductService.createProduct(surveyDataPost) // surveyDataPost만 있으면 됩니다.
  console.log(postSurveyData)
} catch (err) {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
}

// 상품 수정.
const surveyDataPatch = {
  "name": '배진han', // String
  "description": '저는 노드를 이용해 api를 공부하고 있습니다. 지금은 다시 수정하고 있고요 patch를 이용해서요.', // String
  "price": 999999, // Number
  "tags": [
    'tags', '무슨 태그를 달아야 하나' // String
  ],
  "images": [
    'https://helpx.adobe.com/content/dam/help/en/photoshop/using/quick-actions/remove-background-before-qa1.png' // URL
  ]
}

try {
  const patchSurveyDawait = await ProductService.patchProduct(568, surveyDataPatch) // 아규먼트로 id와 surveyDataPatch를 넣어야 합니다.
  console.log(patchSurveyDawait)
} catch (err) {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
};

// await ProductService.deleteProduct()
