import "./RegisterPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../apis/productService.mjs";

function RegisterPage() {
  //다음에 컴포먼트로 각각 분리해서 만들자..
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  // const [tags, setTags] =useState([]); 태그 미완

  //새로운 상품 객체
  const newProduct = {
    name: name,
    description: description,
    price: price,
  };

  //navigate 이용
  const navigate = useNavigate();

  //등록 버튼 누르면 백엔드에 객체 전달하고 db에 상품 저장 후
  // /registration 페이지로 이동 근데 이제 아직 미정인
  const handleClick = async () => {
    await createProduct(newProduct);
    navigate("/registration");
  };

  return (
    <div className="registerPage">
      <section className="registerCon">
        <div className="registerButtonCon">
          <div className="registerPageText1">상품 등록하기</div>
          <button className="registerPageBt" onClick={handleClick}>
            등록
          </button>
        </div>

        <div className="registerPageInputCon">
          <div>
            <div className="registerPageText2">상품명</div>
            <input
              className="registerPageInput small"
              placeholder="상품명을 입력해주세요"
              onChange={(e) => setName(e.target.value)}
            ></input>
          </div>
          <div>
            <div className="registerPageText2">상품소개</div>
            <textarea
              className="registerPageInput big"
              placeholder="상품 소개를 입력해주세요"
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          <div>
            <div className="registerPageText2">판매가격</div>
            <input
              className="registerPageInput small"
              placeholder="판매 가격을 입력해주세요"
              onChange={(e) => setPrice(e.target.value)}
            ></input>
          </div>
          {/* 아직 태그는 미완 */}
          <div>
            <div className="registerPageText2">태그</div>
            <input
              className="registerPageInput small"
              placeholder="태그를 입력해주세요"
            ></input>
          </div>
        </div>
      </section>
    </div>
  );
}

export default RegisterPage;
