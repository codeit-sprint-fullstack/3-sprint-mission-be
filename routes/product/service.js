// import Product from "../../model/product.js";
// const Items = async (req, res) => {
//   const query = req.query;
//   let pageSize = !!query.pageSize ? Number(query.pageSize) : 10;
//   let page = !!query.page ? Number(query.page) : 1;
//   let orderBy = {};
//   switch (query.orderBy) {
//     case "recent":
//       orderBy = { createdAt: -1 };
//       break;
//     case "favorite":
//       orderBy = { favorite: -1 };
//       break;
//     default:
//       orderBy = { createdAt: -1 };
//       break;
//   }
//   let body = {};
//   if (!!query.keyword) {
//     body = {
//       $or: [
//         { name: { $regex: query.keyword } },
//         { description: { $regex: query.keyword } },
//       ],
//     };
//   }
//   try {
//     const items = await Product.find(body)
//       .skip((page - 1) * 10)
//       .sort(orderBy)
//       .limit(pageSize);
//     const totalCount = await Product.find(body);
//     res.status(200).send({
//       success: true,
//       data: items,
//       totalCount: totalCount.length,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// const ItemOne = async (req, res) => {
//   let body = req.body;
//   try {
//     const id = await Product.findById();
//     const item = await Product.findOne();
//     res.status(200).send({
//       success: true,
//       data: item,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
// const Create = async (req, res) => {
//   const body = { ...req.body, favorite: 0 };
//   try {
//     const products = await Product.create(body);
//     res.status(201).send({
//       success: true,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
// const Patch = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const result = await Product.updateOne(
//       {
//         id,
//       },
//       { $set: req.bdoy }
//     );
//     res.status(203).send({
//       success: true,
//       msg: result.length > 0 ? "업데이트 성공" : "업데이트할 문서 없음",
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
// const Delete = async (req, res) => {
//   const id = req.params.id;
//   try {
//     const deleteInfo = await Product.deleteOne({
//       id,
//     });
//     res.status(204).send({
//       success: true,
//       deleteInfo,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };
// const service = {
//   Create,
//   Items,
//   ItemOne,
//   Patch,
//   Delete,
// };

// export default service;
