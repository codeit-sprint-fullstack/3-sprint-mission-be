import "../../../../styles/global.css";
import "./index.css";
import "../common/common.css";
import section2Img from "../../../../img/home/feature2-image.png";

const Section2 = () => {
  return (
    <section class="whiteColorSection">
    <div class="content2">
      <div class="textBox">
        <div class="search">
          Search
        </div>
        <div class="text">
          <div class="bigtext">
            <div class="text1">구매를 원하는</div>
            <div class="text1">상품을 검색하세요</div>
          </div>
        </div>
        <div class="smalltext">
          <div class="text1">구매하고 싶은 물품은 검색해서</div>
          <div class="text1">쉽게 찾아보세요</div>
        </div>
      </div>
      <div class="imgBox">
        <img src={section2Img} alt="section2Img"/>
      </div>
    </div>
  </section>
  );
};

export default Section2;
