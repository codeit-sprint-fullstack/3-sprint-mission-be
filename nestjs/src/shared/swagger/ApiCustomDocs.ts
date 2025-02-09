import { applyDecorators } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

// export const ApiCustomDocs = (params: {
//   summary?: string;
//   description?: {
//     title?: string;
//     contents?: string[];
//   };
//   required?: boolean;
//   requestType?: any;
//   responseType?: any;
// }): MethodDecorator => {
//   const apiOperation = ApiOperation({
//     summary: params.summary,
//     description:
//       params?.description?.title +
//         (params?.description?.title ? '\n\n' : '') +
//         params?.description?.contents
//           ?.map((str) => ' - ' + str)
//           ?.join('\n\n') || '',
//   });

//   const apiBody = ApiBody({
//     type: params.requestType,
//     required: params.required,
//   })
//     ? ApiBody
//     : null;

//   const response200 = ApiResponse({
//     status: 200,
//     type: params.responseType,
//   });

//   return applyDecorators(
//     apiOperation,
//     response200,
//     ...(apiBody ? [apiBody] : []), // apiBody가 존재할 때만 배열에 추가
//   );
// };
