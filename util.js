import mongoose from 'mongoose';

/**
 * @param {*} id mongoose ObjectId
 * @returns Boolean if id is valid ObjectId true, else false
 */
// id가 유효한 ObjectId인지 확인하는 함수
export const isValidObjectId = id => mongoose.isValidObjectId(id);

// 현재 시간을 한국 시간으로 표시
const timestamp = new Intl.DateTimeFormat('ja-JP', {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  fractionalSecondDigits: 3,
  hour12: false,
}).format(new Date());

// 에러 메시지와 함께 에러 상태를 반환하는 함수
export const sendError = (res, status, message) => res.status(status).send({ message, timestamp });

// Object에서 특정 key만 추출하는 함수
export const filteredObj = (source, filtered) =>
  Object.fromEntries(Object.entries(source.toObject()).filter(([k, v]) => filtered.includes(k)));
// 위 코드는 아래 코드와 동일한 결과를 반환한다
// const filteredObj = (source, filtered) => Object.entries(source.toObject()).reduce((obj, [k, v]) => {
//   if (filtered.includes(k)) obj[k] = v;
//   return obj;
// }, {});

// 필드별 타입 검사(fieldTypeValidator)를 정의한다.
// name, description은 string 타입(문자열 최대 길이는 255자)이며 null이 아니어야 한다.
// price는 number 타입(정수, 0 이상, Number.MAX_SAFE_INTEGER 미만)
// tag는 array 타입이며 array에 포함된 값은 string 타입이며 적어도 하나 이상 최대 10개의 요소를 가져야 한다.
export const fieldTypeValidator = (value, type) => {
  switch (type) {
    case 'string':
      return value !== null && typeof value === 'string' && value.length > 0 && value.length <= 255;
      break;
    case 'number':
      return (
        value !== null &&
        typeof value === 'number' &&
        !isNaN(value) &&
        value >= 0 &&
        value < Number.MAX_SAFE_INTEGER &&
        value % 1 === 0
      );
      break;
    case 'array':
      return (
        value !== null &&
        Array.isArray(value) &&
        value.every(tag => typeof tag === 'string') &&
        value.length > 0 &&
        value.length <= 10
      );
      break;
    default:
      break;
  }
  // string: value => value !== null && typeof value === 'string' && value.length > 0 && value.length <= 255,
  // number: value =>
  //   value !== null &&
  //   typeof value === 'number' &&
  //   !isNaN(value) &&
  //   value >= 0 &&
  //   value < Number.MAX_SAFE_INTEGER &&
  //   value % 1 === 0,
  // array: value =>
  //   value !== null && Array.isArray(value) && value.every(tag => typeof tag === 'string') && value.length > 0,
};
