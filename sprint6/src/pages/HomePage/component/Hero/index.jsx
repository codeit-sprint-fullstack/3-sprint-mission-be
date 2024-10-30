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
            <span className="text1">일상의 모든 물건을</span>
            <span className="text1" id='textCenter'>거래해 보세요</span>
          </div>
          <div className="button">
            <a href="/items">구경하러 가기</a>
          </div>
        </div>
        <div className="imgBox">
          <img src={heroImg} alt='heroImg' />
        </div>
      </div>
    </section>
  );
};

export default Hero;