import "../../../../styles/global.css";
import "./index.css";
import "../common/common.css";
import bottomBannerImg from "../../../../img/home/bottom-banner-image.png";

const BottomBanner = () => {
  return (
    <div class="skyColorSection">
    <div class="skyColorContent">
      <div class="textBox5">
        <div class="text1">믿을 수 있는</div>
        <div class="text1">판다마켓 중고 거래</div>
      </div>
      <div class="imgBox">
        <img src={bottomBannerImg} alt="bottomBannerImg" />
      </div>
    </div>
  </div>
  );
};

export default BottomBanner;
