import {
  string,
  min,
  max,
  enums,
  object,
  array,
  optional,
  integer,
  coerce,
  defaulted,
  partial,
  nonempty,
} from 'superstruct';

export const CreateProductRequestStruct = object({
  name: coerce(nonempty(string()), string(), (value) => value.trim()),
  price: min(integer(), 0),
  description: nonempty(string()),
  tags: array(nonempty(string())),
});

export const EditProductStruct = partial(CreateProductRequestStruct);

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
