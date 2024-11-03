import "./Footer.css";
import facebookImg from "../imgs/facebook-logo.svg";
import youtubeImg from "../imgs/youtube-logo.svg";
import twitterImg from "../imgs/twitter-logo.svg";
import instarImg from "../imgs/instagram-logo.svg";

export function Footer() {
  return (
    <div className="footerBanner">
      <div className="footerBannerContent">
        <div style={{ color: "#9CA3AF" }}> ©codeit - 2024</div>
        <div className="footerBannerMiddleContent">
          <a href="privacy.html" className="footerA">
            Frame 2609405
          </a>
          <a href="faq.html" className="footerA">
            FAQ
          </a>
        </div>
        <div className="footerBannerImgs">
          <a
            href="https://www.facebook.com/?locale=ko_KR"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebookImg} alt="facebook" />
          </a>
          <a
            href="https://x.com/?lang=ko"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={twitterImg} alt="twitter" />
          </a>
          <a
            href="https://www.youtube.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={youtubeImg} alt="youtube" />
          </a>
          <a
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instarImg} alt="instar" />
          </a>
        </div>
      </div>
    </div>
  );
}
