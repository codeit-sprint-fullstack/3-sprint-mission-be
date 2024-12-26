const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  // 클라이언트 오류 (400 시리즈)
  if (err.name === 'ValidationError' || err.name === 'BadRequest') {
    return res.status(400).json({ message: err.message });
  }

  // 리소스를 찾을 수 없음 (404)
  if (err.name === 'NotFound') {
    return res.status(404).json({ message: err.message });
  }

  // 서버 오류 (500 시리즈)
  res.status(500).json({ message: '서버 오류가 발생했습니다.' });
};

export default errorHandler;
