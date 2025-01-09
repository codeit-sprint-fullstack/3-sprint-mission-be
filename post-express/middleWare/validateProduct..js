import { body, validationResult } from 'express-validator';

const validateProduct = [
  body('name').notEmpty().withMessage('10자 이내로 입력해주세요요.'),
  body('description').notEmpty().withMessage('10자 이상 입력해주세요요.'),
  body('price').isFloat({ min: 0 }).withMessage('숫자로 입력해주세요.'),
  body('tags').isArray().withMessage('5글자 이내로 입력해주세요요.'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export { validateProduct };
