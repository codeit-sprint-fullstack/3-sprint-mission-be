import React from 'react';
import './footer.css';
import facebookIcon from './icons/ic_facebook.png';
import twitterIcon from './icons/ic_twitter.png';
import youtubeIcon from './icons/ic_youtube.png';
import instagramIcon from './icons/ic_instagram.png';

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-left">
                    ©codeit - 2024
                </div>
                <div className="footer-center">
                    <a href="/privacy-policy">Privacy Policy</a>
                    <a href="/faq">FAQ</a>
                </div>
                <div className="footer-right">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                        <img src={facebookIcon} alt="Facebook" className="social-icon" />
                    </a>
                    <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                        <img src={twitterIcon} alt="Twitter" className="social-icon" />
                    </a>
                    <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                        <img src={youtubeIcon} alt="YouTube" className="social-icon" />
                    </a>
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                        <img src={instagramIcon} alt="Instagram" className="social-icon" />
                    </a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
