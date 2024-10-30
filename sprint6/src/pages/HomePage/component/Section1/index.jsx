import "../../../../styles/global.css";
import "./index.css";
import "../common/common.css";
import section1Img from "../../../../img/home/feature1-image.png";

const Section1 = () => {
  return (
    <section class="whiteColorSection">
      <div class="content2">
        <div class="imgBox">
          <img src={section1Img} alt="section1Img" />
        </div>
        <div class="textBox">
          <div class="hotItem">Hot item</div>
          <div class="text">
            <div class="bigtext">
              <div class="text1">인기 상품을</div>
              <div class="text1">확인해 보세요</div>
            </div>
          </div>
          <div class="smalltext">
            <div class="text1">가장 HOT한 중고거래 물품을</div>
            <div class="text1">판다 마켓에서 확인해 보세요</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Section1;
