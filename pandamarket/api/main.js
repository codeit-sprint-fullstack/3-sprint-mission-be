import { getArticle,  getArticleList, createArticle, patchArticle, deleteArticle } from "./ArticleService.js";
import { getProduct,getProductList,createProduct, patchProduct, deleteProduct } from "./ProductService.js";

getArticle(90);
getArticleList('정몽규');
createArticle('정해찬','test','test_image');
patchArticle(776,'patch_정해찬','patch_test','patch_image');
deleteArticle(776);