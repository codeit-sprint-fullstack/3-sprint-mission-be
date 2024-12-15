import * as s from 'superstruct';

/** Products Routes **/

export const CreateProduct = s.object({
  name: s.size(s.string(), 1, 10),
  description: s.size(s.string(), 10, 100),
  price: s.number(),
  tags: s.array(s.string()),
});

export const PatchProduct = s.partial(CreateProduct);

/** Articles Routes **/

export const CreateArticle = s.object({
  title: s.size(s.string(), 1, Infinity),
  content: s.size(s.string(), 1, Infinity),
});

export const PatchArticle = s.partial(CreateArticle);


/** Comments Routes **/

export const CreateComment = s.object({
  content: s.size(s.string(), 1, Infinity),
});

export const PatchComment = s.partial(CreateComment);