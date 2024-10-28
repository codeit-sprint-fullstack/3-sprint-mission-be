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
  const getSurveyData = await ProductService.getProduct() // 아규먼트로 id 값인 숫자 입력.
  console.log(getSurveyData)
  
} catch (err) {
  if (err.response) {
    console.log(err.response.status);
    console.log(err.response.data);
  } else {
    console.log('리퀘스트가 실패했습니다.');
  }
}

// await ProductService.createProduct()
// await ProductService.patchProduct()
// await ProductService.deleteProduct()

