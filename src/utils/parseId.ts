export const parseId = (paramId: string) => {
  const id = parseInt(paramId);
  if (Number.isNaN(id)) throw new Error('id는 숫자를 입력해주세요.');
  return id;
};
