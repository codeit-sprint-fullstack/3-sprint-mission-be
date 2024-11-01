import * as s from 'superstruct';
import { PRODUCT_VALIDATION_MESSAGES } from '../constants/messages';

const validateName = s.refine(
  s.string(),
  'min-length',
  (value) => value.length >= 1 || PRODUCT_VALIDATION_MESSAGES.invalidNameLength,
);

const validatePrice = s.refine(
  s.number(),
  'price',
  (value) => (value >= 0 && Number.isInteger(value)) || PRODUCT_VALIDATION_MESSAGES.invalidPrice,
);

const validateInteger = s.refine(
  s.number(),
  'is integer',
  (value) => value > 0 && Number.isInteger(value),
);

const validateSort = s.refine(
  s.enums(['desc', 'asc']),
  'sort',
  () => PRODUCT_VALIDATION_MESSAGES.invalidSortOption,
);

export const validateId = s.object({
  id: s.refine(s.string(), 'id', () => PRODUCT_VALIDATION_MESSAGES.invalidId),
});

export const CreateProduct = s.object({
  name: validateName,
  price: validatePrice,
  description: s.optional(s.string()),
  tags: s.optional(s.array(s.string())),
  images: s.optional(s.array(s.string())),
});

export const GetProductList = s.object({
  name: s.optional(validateName),
  price: s.optional(validatePrice),
  page: s.optional(validateInteger),
  pageSize: s.optional(validateInteger),
  order: s.optional(validateSort),
});
