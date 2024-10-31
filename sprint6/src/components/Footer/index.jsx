import faceBookImg from '../../img/social/ic_facebook.png';
import twitterImg from '../../img/social/ic_twitter.png';
import youtubeImg from '../../img/social/ic_youtube.png';
import instagramImg from '../../img/social/ic_instargram.png';
import './index.css';

function Footer() {
  return (
    <footer>
      <div id="footerContent">
        <div id="copyright">© Codeit 2024</div>

        <div id="info">
          <div><a href="/privacy">Privacy Policy</a></div>
          <div id='faq'><a href="/faq">FAQ</a></div>
        </div>

        <div id="socialIcons">
          <a href="https://www.facebook.com/?locale=ko_KR"><img src={faceBookImg} alt="Facebook" /></a>
          <a href="https://x.com/?lang=ko"><img src={twitterImg} alt="Twitter" /></a>
          <a href="https://www.youtube.com/"><img src={youtubeImg} alt="YouTube" /></a>
          <a href="https://www.instagram.com/sem/campaign/emailsignup/?campaign_id=13530338586&extra_1=s%7Cc%7C547419126947%7Ce%7Cinstagram%20c%7C&placement=&creative=547419126947&keyword=instagram%20c&partner_id=googlesem&extra_2=campaignid%3D13530338586%26adgroupid%3D126262419014%26matchtype%3De%26network%3Dg%26source%3Dnotmobile%26search_or_content%3Ds%26device%3Dc%26devicemodel%3D%26adposition%3D%26target%3D%26targetid%3Dkwd-1321618852491%26loc_physical_ms%3D1009866%26loc_interest_ms%3D%26feeditemid%3D%26param1%3D%26param2%3D&gad_source=1&gclid=CjwKCAjw_4S3BhAAEiwA_64YhgkFInpQexBqyLXjThDfjkEHXMlvBam2vK2b7L7e_xsKy934puQxuBoCe7IQAvD_BwE"><img src={instagramImg} alt="Instagram" /></a>
        </div>
      </div>
    </footer>
  )
}

export default Footer;