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
  optional,
  Infer,
  refine,
} from 'superstruct';

export const CreateCommentStruct = object({
  content: refine(nonempty(string()), '내용을 입력해주세요.', () => true),
});

export const EditCommentStruct = partial(CreateCommentStruct);

export const GetCommentListStruct = object({
  cursor: optional(refine(integer(), 'cursor는 정수여야 합니다.', () => true)),
  take: defaulted(
    refine(
      coerce(max(min(integer(), 1), 100), string(), (value) => Number.parseInt(value, 10)),
      'take는 1에서 100까지 입력 가능합니다.',
      () => true,
    ),
    100,
  ),
});

export type CreateCommentRequest = Infer<typeof CreateCommentStruct>;
export type EditCommentRequest = Infer<typeof EditCommentStruct>;
export type GetCommentListRequest = Infer<typeof GetCommentListStruct>;
