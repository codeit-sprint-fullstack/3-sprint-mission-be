export async function getProductsByOrder(
  order = "recent",
  page = 1,
  pageSize = 10,
  keyword = ""
) {
  try {
    const response = await fetch(
      `https://panda-market-api.vercel.app/products?page=${page}&pageSize=${pageSize}&orderBy=${order}&keyword=${keyword}`,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    if (response.ok) {
      console.log(`상품 불러오기 성공`);
    } else {
      console.log(`상품 불러오기 실패` + response.statusText);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    return `먼가 오류 발생!!! => ${err}`;
  }
}

const data = await getProductsByOrder();
console.log(data);

export async function getProductByLike() {
  const response = await fetch(
    `https://panda-market-api.vercel.app/products?page=1&pageSize=4&orderBy=favorite`,
    {
      method: "GET",
      headers: {
        "Content-type": "application/json",
      },
    }
  );
  const data = await response.json();
  return data;
}
// const data2 = await getProductByLike();
// console.log(data2);

// 새로운 상품 생성 api
export async function createProduct(newProduct) {
  const response = await fetch(`https://localhost:8000/product/register`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newProduct),
  });
  const data = await response.json();
  console.log(newProduct);
  return data;
}
