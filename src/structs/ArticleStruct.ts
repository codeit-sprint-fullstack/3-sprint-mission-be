import {
  coerce,
  object,
  nonempty,
  string,
  partial,
  defaulted,
  integer,
  min,
  max,
  enums,
  optional,
} from 'superstruct';

export const CreateArticleRequestStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: nonempty(string()),
});

export const EditArticleRequestStruct = partial(CreateArticleRequestStruct);

export const GetArticleListRequestStruct = object({
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
