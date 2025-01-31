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
} from 'superstruct';

export const CreateCommentStruct = object({
  content: nonempty(string()),
});

export const EditCommentStruct = partial(CreateCommentStruct);

export const GetCommentListStruct = object({
  cursor: optional(integer()),
  take: defaulted(
    coerce(max(min(integer(), 1), 100), string(), (value) => Number.parseInt(value, 10)),
    100,
  ),
});

export type CreateCommentRequest = Infer<typeof CreateCommentStruct>;
export type EditCommentRequest = Infer<typeof EditCommentStruct>;
export type GetCommentListRequest = Infer<typeof GetCommentListStruct>;
