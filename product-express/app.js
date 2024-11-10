import express, { application } from "express";
import mongoose from "mongoose";
import { DATABASE_URL } from "./env.js";
import Product from "./models/product.js";
import cors from 'cors';

const app = express();

const corsOptions = {
  origin: ['http://127.0.0.1:3000', 'https://panda-product.com'],
};

app.use(cors());
app.use(express.json());

mongoose
  .connect(DATABASE_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.post("/product", async(req, res) => {
  try{
    const newProduct = await Product.create(req.body);
    res.status(201).send(newProduct);
  }catch (err) {
    res.status(400).send({ message : 'Cannot post.'})
  }
})

app.get("/product/:id", async (req, res) => {
  const data = await Product.findById(req.params.id);
  if(data) {
    res.status(200).send(data);
  }else{
    res.status(404).send({message: "Cannot find given id"});
  }
})

app.get("/product", async (req, res) => {
  const sort = req.query.sort;
  const count = Number(req.query.count);

  const sortOption = {
    createdAt: sort || "desc",
  };
  const allData = await Product.find().sort(sortOption).limit(count);
  res.send(allData);
})

app.patch("/product/:id", async (req, res) => {
  try{
    const id = req.params.id;
    const product = await Product.findById(id);
    if  (product) {
      product.name = req.body.name;
      product.description = req.body.description;
      product.price = req.body.price;
      product.tags = req.body.tags;
    }
    await product.save();
  }catch (err) {
    res.status(400).send({ message : 'Cannot patch given id.'})
  }
})



app.delete("/product/:id", async (req, res) => {
    const id = req.params.id;
    const product = await Product.findById(id);
    if(product){
      Product.splice(product, 1);
      res.sendStatus(204);
    }else{
      res.status(404).send({message : "Cannot delete given id."})
    }
  }
)

app.listen(8000, () => console.log('작동시작'));
 