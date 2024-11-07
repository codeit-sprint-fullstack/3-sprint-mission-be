import express from 'express';
import ProductModel from '../schemas/ProductModel.js';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const newProduct = await ProductModel.create(req.body);
    res.status(201).send(newProduct);
} catch(err) {
  res.status(500).send({error: "전송 실패"});
}
});

router.get('/:id', async (req,res) => {
  try {
    const { id } = req.params;
    const product = await ProductModel.findOne({id});
    res.status(200).send(product);
  } catch(err) {
    res.status(500).send({error:'조회 실패'});
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {name, description, price, tags } = req.body;

    const updatedProduct = await ProductModel.findOneAndUpdate(
      {id,}, {    //findByIdAndUpdate는 고유ID로 탐색
      name,
      description,
      price,
      tags,
    },
    { new :true }   //변경된 값을 반환하도록 설정
  );
    res.status(200).send(updatedProduct);
  } catch(err) {
    res.status(500).send({error:'에러발생'});
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await ProductModel.findOneAndDelete({id});
    if(!result) {
      return res.status(404).send({message:'Product not found'});
    }

    res.status(200).send({message: '삭제 성공'});
  } catch(err) {
    res.status(500).send({error:'삭제 실패'});
  }
});

router.get('/', async (req,res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'recent',
      search = '',
    } = req.query;

    const offset = (page - 1) * limit;

    const sortCondition = sort === 'recent' ? {createdAt: -1} : {};

    const searchCondition = {
      $or: [
        {name: {$regex: search, $options:'i'}},
        {description:{$regex: search, $options:'i'}}
      ]
    };

    const products = await ProductModel.find(searchCondition)
      .sort(sortCondition)
      .skip(offset)
      .limit(parseInt(limit))
      .select('id name price createdAt');

    res.status(200).send(products);
  } catch(err) {
    res.status(500).send({message:"에러 발생"});
  }
});

export default router;