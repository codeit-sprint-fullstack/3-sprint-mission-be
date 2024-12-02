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
} from 'superstruct';

export const CreateCommentStruct = object({
  content: nonempty(string()),
});

export const EditCommentStruct = partial(CreateCommentStruct);

export const GetCommentListStruct = object({
  cursor: defaulted(string(), ''),
  take: defaulted(
    coerce(max(min(integer(), 1), 10), string(), (value) => Number.parseInt(value, 10)),
    10,
  ),
});
