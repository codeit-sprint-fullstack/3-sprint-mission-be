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
  Infer,
} from 'superstruct';

export const CreateArticleRequestStruct = object({
  title: refine(
    coerce(nonempty(string()), string(), (value) => value.trim()),
    '제목을 입력해주세요.',
    () => true,
  ),
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
  page: defaulted(
    refine(
      coerce(min(integer(), 1), string(), (value) => Number.parseInt(value, 10)),
      'page는 1이상의 정수로 입력해주세요.',
      () => true,
    ),
    1,
  ),
  pageSize: defaulted(
    refine(
      coerce(max(min(integer(), 1), 10), string(), (value) => Number.parseInt(value, 10)),
      'pageSize는 1이상 10이하의 정수로 입력해주세요.',
      () => true,
    ),
    10,
  ),
  orderBy: defaulted(
    refine(enums(['recent', 'like']), 'orderBy는 recent,like중 하나를 입력해주세요.', () => true),
    'recent',
  ),
  word: optional(nonempty(string())),
});

export type CreateArticleRequest = Infer<typeof CreateArticleRequestStruct>;
export type EditArticleRequest = Infer<typeof EditArticleRequestStruct>;
export type GetArticleListRequest = Infer<typeof GetArticleListRequestStruct>;
