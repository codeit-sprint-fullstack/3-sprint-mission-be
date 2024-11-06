export default function errorHandler(err, req, res, next) {
  console.error(err.stack);
  res.status(err.statusCode || 500).json( {
    message: err.message || "서버 오류 발생"
  })
}