import * as dotenv from "dotenv";
import express from "express";
import {PrismaClient} from "@prisma/client";
dotenv.config();


const prisma = new PrismaClient();

const app = express();
app.use(express.json());

function asyncHandler(handler) {
    return async function (req, res) {
        try{
            await handler(req,res);
        }catch(err){
            res.status(400).send({
                message: err.message,
            })
        }
        
    }
}

app.post("/board", asyncHandler(async (req, res) => {
    const createdArticle = await prisma.article.create({
        data: req.body,
    });
    res.status(201).send(createdArticle);
}));

app.get("/board/:id", asyncHandler(async (req, res) => {
    const {id} = req.params;
    const article = await prisma.article.findUnique({
        where:{
            id,
        },
        select: {
            id: true,
            title:true,
            content:true,
            createdAt:true,
        },
    });
    res.send(article);
}));

app.patch("/board/:id", asyncHandler(async (req, res) => {
    const {id} = req.params
    const updateArticle = await prisma.article.update({
        data:req.body,
        where:{
            id,
        },
    });
    res.status(201).send(updateArticle);
}));

app.delete("/board/:id", asyncHandler(async (req, res) => {
    const {id} =req.params
    await prisma.article.delete({
        where: {
            id,
        },
    }),
    res.sendStatus(204);
}));

app.get("/board", asyncHandler(async (req, res) => {
    const { searchKeyword, offset = 0, limit = 10} = req.query;
    const articles = await prisma.article.findMany({
        orderBy: {createdAt: "asc"},
        skip: parseInt(offset),
        take: parseInt(limit),
        OR: [ 
            { titel: { contains: searchKeyword} }, 
            { content: { contains: searchKeyword} },
        ],
        select:{
            id:true,
            title:true,
            content:true,
            createdAt:true,
        },
    });
    res.status(201).send(articles);
}));

app.post("/product/comment", asyncHandler(async (req, res) => {
    const createComment = await prisma.productComment.create({
        data: req.body
    });
    res.status(201).send(createComment);
}))

app.patch("/prodcut/comment/:id" , asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updateProductComment = await prisma.productComment.update({
        data: req.body,
        where: {
            id,
        },
    });
    res.status(201).send(updateProductComment);
}));

app.delete("/product/comment/:id", asyncHandler(async (req, res) => {
    const {id } = req.params;
    await prisma.productComment.delete({
        where: {
            id,
        },
    });
    res.sendStatus(204);
}));

app.get("/product/comment", asyncHandler(async (req, res) => {
    const {limit = 10} = req.query;
    const comments = await prisma.productComment.findMany({
        orderBy: {createdAt: "asc"},
        take: parseInt(limit),
    });
    res.status(201).send(comments);
}));

app.post("/board/comment", asyncHandler(async (req, res) => {
    const createComment = await prisma.articleComment.create({
        data: req.body,
    })
    res.status(201).send(createComment);
}));

app.patch("/board/comment/:id", asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updateArticleComment = await prisma.articleComment.update({
        data: req.body,
        where: {
            id,
        },
    })
    res.status(201).send(updateArticleComment);
}));

app.delete("/board/comment/:id", asyncHandler(async (req, res) => {
    const {id} =req.params;
    await prisma.articleComment.delete({
        where: {
            id,
        }
    })
    res.sendStatus(204);
}));

app.get("/board/comment", asyncHandler(async (req, res) => {
    const {limit = 10} = req.query;
    const comments = await prisma.boardComment.findMany({
        orderBy: {createdAt: "asc"},
        take: parseInt(limit),
    });
    res.status(201).send(comments);
}))

app.post("/product", asyncHandler(async (req, res) => {
    const createProduct = await prisma.product.create({
        data: req.body,
    })
    res.status(201).send(createProduct);
}));

app.patch("/product/:id", asyncHandler(async (req, res) => {
    const {id} = req.params;
    const updatedProduct = await prisma.product.update({
        data:req.body,
        where: {
            id,
        },
    });
    res.status(201).send(updatedProduct);
}));

app.delete("/product/:id", asyncHandler(async (req, res) => {
    const {id} = req.params;
    await prisma.product.delete({
        where: {
            id,
        },
    });
    res.sendStatus(201);
}));

app.get("/product/:id", asyncHandler(async (req, res) => {
    const { searchKeyword, offset = 0, limit = 10} = req.query;
    const product = await prisma.product.findUnique({
        orderBy: {createdAt: "asc"},
        skip: parseInt(offset),
        take: parseInt(limit),
        OR: [ 
            { name: { contains: searchKeyword} }, 
            { description: { contains: searchKeyword} },
        ],
        select:{
            id:true,
            name:true,
            description:true,
            price:true,
            tags:true,
            createdAt:true,
        },
    });
    res.status(201).send(product);
}));

app.get("/prodcut", asyncHandler(async (req, res) => {
    const {searchKeyword, limit = 10, offset = 0} = req.query;
    const products = await prisma.product.findMany({
        skip:Number(offset),
        take:Number(limit),
        orderBy: {createdAt: "asc"},
        select:{
            id:true,
            name:true,
            price:true,
            createdAt:true,
        },
    });
    res.status(201).send(products);
}))

const port = process.env.PORT || 8000;

app.listen(port, () => console.log(`Server Started :${port}`));