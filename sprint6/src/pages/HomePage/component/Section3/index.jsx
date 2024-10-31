import "../../../../styles/global.css";
import "./index.css";
import "../common/common.css";
import section3Img from "../../../../img/home/feature3-image.png";

const Section2 = () => {
  return (
    <section class="whiteColorSection">
      <div class="content3">
        <div class="imgBox">
          <img src={section3Img} alt="section3Img" />
        </div>
        <div class="textBox">
          <div class="register">
            Rigister
          </div>
          <div class="text">
            <div class="bigtext">
              <div class="text1">판매를 원하는</div>
              <div class="text1">상품을 등록하세요</div>
            </div>
          </div>
          <div class="smalltext">
            <div class="text1">어떤 물건이든 판매하고 싶은 상품을</div>
            <div class="text1">쉽게 등록하세요</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section2;
