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
  array,
  refine,
} from 'superstruct';

export const CreateArticleRequestStruct = object({
  title: coerce(nonempty(string()), string(), (value) => value.trim()),
  content: refine(
    nonempty(string()),
    '내용은 10자 이상 100자 이하로 입력해주세요.',
    (Value) => Value.length >= 10 && Value.length <= 100,
  ),
  images: refine(
    array(string()),
    '이미지는 최대 3개 업로드 가능합니다.',
    (value) => value.length <= 3,
  ),
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
