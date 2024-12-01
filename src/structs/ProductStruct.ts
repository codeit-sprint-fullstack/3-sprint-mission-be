import {
  string,
  min,
  max,
  number,
  enums,
  refine,
  object,
  array,
  optional,
  integer,
  coerce,
  defaulted,
  partial,
  nonempty,
} from 'superstruct';
import { PRODUCT_VALIDATION_MESSAGES } from '../constants/messages';

const validateName = refine(
  string(),
  'min-length',
  (value) => value.length >= 1 || PRODUCT_VALIDATION_MESSAGES.invalidNameLength,
);

const validatePrice = refine(
  number(),
  'price',
  (value) => (value >= 0 && Number.isInteger(value)) || PRODUCT_VALIDATION_MESSAGES.invalidPrice,
);

const validatePage = refine(
  number(),
  'page',
  (value) => (value > 0 && Number.isInteger(value)) || PRODUCT_VALIDATION_MESSAGES.invalidPage,
);

const validateSort = refine(
  enums(['desc', 'asc']),
  'sort',
  () => PRODUCT_VALIDATION_MESSAGES.invalidSortOption,
);

export const validateId = refine(
  string(),
  'id',
  (value) => value.length > 1 || PRODUCT_VALIDATION_MESSAGES.invalidId,
);

export const CreateProductStruct = object({
  name: validateName,
  price: validatePrice,
  description: string(),
  tags: array(string()),
});

export const EditProductStruct = partial(CreateProductStruct);

export const GetProductList = object({
  name: optional(validateName),
  price: optional(validatePrice),
  page: optional(validatePage),
  pageSize: optional(validatePage),
  order: optional(validateSort),
});

export const GetProductListRequestStruct = object({
  skip: defaulted(
    coerce(min(integer(), 0), string(), (value) => Number.parseInt(value, 10)),
    0,
  ),
  take: defaulted(
    coerce(max(min(integer(), 1), 10), string(), (value) => Number.parseInt(value, 10)),
    10,
  ),
  orderBy: optional(enums(['recent'])),
  word: optional(nonempty(string())),
});
