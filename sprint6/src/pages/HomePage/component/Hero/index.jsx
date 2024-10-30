import '../../../../styles/global.css';
import './index.css';
import '../common/common.css';
import heroImg from '../../../../img/home/hero-image.png';

const Hero = () => {
  return (
    <section className="skyColorSection">
      <div className="skyColorContent">
        <div className="textBox">
          <div className="text">
            <div className="text1">일상의 모든 물건을</div>
            <div className="text1">거래해 보세요</div>
          </div>
          <div className="button">
            <a href="/items">구경하러 가기</a>
          </div>
        </div>
        <div className="imgBox">
          <img src={heroImg} />
        </div>
      </div>
    </section>
  );
};

export default Hero;