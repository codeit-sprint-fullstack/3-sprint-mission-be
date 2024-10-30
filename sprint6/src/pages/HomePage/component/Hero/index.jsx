import '../../../../styles/global.css';
import './index.css';
import '../common/common.css';

const Hero = () => {
  return (
    <section class="skyColorSection">
      <div class="skyColorContent">
        <div class="textBox">
          <div class="text">
            <div class="text1">일상의 모든 물건을</div>
            <div class="text1">거래해 보세요</div>
          </div>
          <div class="button">
            <a href="/items">구경하러 가기</a>
          </div>
        </div>
        <div class="imgBox">
          <img src="/img/home/hero-image.png" />
        </div>
      </div>
    </section>
  );
};

export default Hero;