import express from 'express';
import service from './service.js';

const Router = express.Router();

Router.get('/', service.getProducts);
Router.get('/:id', service.getProduct);
Router.post('/', service.postProduct);
Router.patch('/:id', service.patchProduct);
Router.delete('/:id', service.deleteProduct);

export default Router;
