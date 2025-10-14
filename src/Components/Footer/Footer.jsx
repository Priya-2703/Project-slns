import React, { useEffect, useRef } from "react";
import "./Footer.css"
import { assets } from "../../../public/assets/asset";
import gsap from "gsap";
import _ScrollTrigger from "gsap/ScrollTrigger";
import { Link } from "react-router-dom";

gsap.registerPlugin(_ScrollTrigger);

const Footer = () => {
 const logoRef = useRef(null);

 useEffect(()=>{
  //logo animation
  gsap.fromTo(
      logoRef.current,
      { scale: 0.1 },
      {
        scale: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: logoRef.current,
          start: "top 80%",
          end: "bottom 40%",
          scrub: true,
        },
      }
    );

 },[])



  return (
    <>
      <>
        {/* Footer */}
        <footer className="footer bg-black">
          <div className="w-full flex justify-center items-center pb-20">
              <img ref={logoRef} src={assets.logo} alt="logo" className="w-40"/>
          </div>
          <div className="footer-content">
            <div className="footer-brand">
              <div className="social-icons">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  className="social-icon"
                >
                  <svg viewBox="0 0 24 24" fill="#fff">
                    <path d="M 4 8.667 C 4 6.089 6.089 4 8.667 4 L 15.333 4 C 17.911 4 20 6.089 20 8.667 L 20 15.333 C 20 17.911 17.911 20 15.333 20 L 8.667 20 C 6.089 20 4 17.911 4 15.333 Z M 15.333 7.333 C 15.322 7.817 15.574 8.268 15.991 8.513 C 16.408 8.758 16.924 8.758 17.341 8.513 C 17.758 8.269 18.01 7.817 17.999 7.334 C 17.983 6.609 17.391 6.03 16.667 6.03 C 15.942 6.03 15.35 6.609 15.333 7.333 Z M 8.667 12 C 8.667 13.841 10.16 15.334 12.001 15.333 C 13.842 15.333 15.334 13.84 15.334 11.999 C 15.334 10.158 13.841 8.666 12 8.666 C 10.159 8.666 8.666 10.159 8.667 12 Z" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/"
                  target="_blank"
                  className="social-icon"
                >
                  <svg viewBox="0 0 20 20" fill="#fff">
                    <path d="M 20 4.55 C 19.988 4.119 19.955 3.688 19.9 3.26 C 19.825 2.885 19.701 2.522 19.53 2.18 C 19.351 1.809 19.111 1.472 18.82 1.18 C 18.526 0.892 18.189 0.652 17.82 0.47 C 17.477 0.303 17.114 0.182 16.74 0.11 C 16.316 0.046 15.889 0.009 15.46 0 L 4.55 0 C 4.119 0.012 3.688 0.045 3.26 0.1 C 2.885 0.175 2.522 0.299 2.18 0.47 C 1.809 0.649 1.472 0.889 1.18 1.18 C 0.892 1.474 0.652 1.811 0.47 2.18 C 0.303 2.522 0.182 2.886 0.11 3.26 C 0.046 3.684 0.009 4.111 0 4.54 L 0 15.45 C 0.012 15.881 0.045 16.312 0.1 16.74 C 0.175 17.115 0.299 17.478 0.47 17.82 C 0.649 18.191 0.889 18.529 1.18 18.82 C 1.474 19.108 1.811 19.348 2.18 19.53 C 2.522 19.697 2.886 19.818 3.26 19.89 C 3.684 19.954 4.111 19.991 4.54 20 L 15.45 20 C 15.881 19.988 16.312 19.955 16.74 19.9 C 17.115 19.825 17.478 19.701 17.82 19.53 C 18.191 19.351 18.529 19.111 18.82 18.82 C 19.108 18.526 19.348 18.189 19.53 17.82 C 19.697 17.477 19.818 17.114 19.89 16.74 C 19.954 16.316 19.991 15.889 20 15.46 Z M 10.23 17 C 9.029 16.995 7.849 16.685 6.8 16.1 L 3 17.1 L 4 13.38 C 3.355 12.297 3.01 11.061 3 9.8 C 3.004 8.383 3.427 6.999 4.216 5.822 C 5.006 4.645 6.125 3.728 7.435 3.186 C 8.744 2.644 10.185 2.502 11.575 2.777 C 12.965 3.052 14.242 3.733 15.246 4.733 C 16.25 5.733 16.936 7.007 17.217 8.396 C 17.498 9.785 17.362 11.226 16.826 12.538 C 16.289 13.85 15.377 14.973 14.203 15.767 C 13.03 16.561 11.647 16.99 10.23 17 Z M 10.23 3.87 C 9.17 3.882 8.132 4.175 7.222 4.719 C 6.311 5.262 5.561 6.038 5.048 6.966 C 4.535 7.893 4.277 8.941 4.3 10 C 4.323 11.06 4.627 12.095 5.18 13 L 5.32 13.23 L 4.72 15.42 L 7 14.8 L 7.22 14.93 C 8.13 15.466 9.164 15.752 10.22 15.76 C 11.811 15.76 13.337 15.128 14.463 14.003 C 15.588 12.877 16.22 11.351 16.22 9.76 C 16.22 8.169 15.588 6.643 14.463 5.517 C 13.337 4.392 11.811 3.76 10.22 3.76 Z M 13.73 12.39 C 13.599 12.608 13.424 12.797 13.215 12.943 C 13.007 13.09 12.77 13.191 12.52 13.24 C 12.147 13.309 11.762 13.285 11.4 13.17 C 11.059 13.063 10.725 12.936 10.4 12.79 C 9.164 12.17 8.109 11.239 7.34 10.09 C 6.923 9.557 6.669 8.914 6.61 8.24 C 6.604 7.96 6.657 7.681 6.766 7.423 C 6.874 7.165 7.036 6.932 7.24 6.74 C 7.3 6.672 7.374 6.617 7.457 6.579 C 7.539 6.541 7.629 6.521 7.72 6.52 L 8 6.52 C 8.11 6.52 8.26 6.52 8.4 6.83 C 8.54 7.14 8.91 8.07 8.96 8.16 C 8.985 8.208 8.997 8.261 8.997 8.315 C 8.997 8.369 8.985 8.422 8.96 8.47 C 8.916 8.579 8.856 8.68 8.78 8.77 C 8.69 8.88 8.59 9.01 8.51 9.09 C 8.43 9.17 8.33 9.27 8.43 9.45 C 8.703 9.909 9.039 10.326 9.43 10.69 C 9.856 11.066 10.343 11.367 10.87 11.58 C 11.05 11.67 11.16 11.66 11.26 11.58 C 11.36 11.5 11.71 11.06 11.83 10.88 C 11.95 10.7 12.07 10.73 12.23 10.79 C 12.39 10.85 13.28 11.28 13.46 11.37 C 13.64 11.46 13.75 11.5 13.8 11.58 C 13.843 11.842 13.819 12.11 13.73 12.36 Z" />
                  </svg>
                </a>
                <a
                  href="https://www.facebook.com/"
                  target="_blank"
                  className="social-icon"
                >
                  <svg width={18} height={18} viewBox="0 0 18 18" fill="#fff">
                    <path d="M16 0H2C0.9 0 0 0.9 0 2V16C0 17.101 0.9 18 2 18H9V11H7V8.525H9V6.475C9 4.311 10.212 2.791 12.766 2.791L14.569 2.793V5.398H13.372C12.378 5.398 12 6.144 12 6.836V8.526H14.568L14 11H12V18H16C17.1 18 18 17.101 18 16V2C18 0.9 17.1 0 16 0Z" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com/"
                  target="_blank"
                  className="social-icon"
                >
                  <svg viewBox="0 0 24 24" fill="#fff">
                    <path d="M 23 12 C 23 12 23 15.487 22.54 17.158 C 22.285 18.082 21.544 18.804 20.595 19.052 C 18.88 19.5 12 19.5 12 19.5 C 12 19.5 5.12 19.5 3.405 19.052 C 2.456 18.803 1.715 18.082 1.46 17.158 C 1 15.487 1 12 1 12 C 1 12 1 8.513 1.46 6.842 C 1.715 5.918 2.456 5.197 3.405 4.948 C 5.12 4.5 12 4.5 12 4.5 C 12 4.5 18.88 4.5 20.595 4.948 C 21.544 5.197 22.285 5.918 22.54 6.842 C 22.998 8.513 23 12 23 12 Z M 9.798 14.359 C 9.798 14.742 10.21 14.983 10.543 14.795 L 14.738 12.436 C 15.078 12.245 15.078 11.756 14.738 11.564 L 10.543 9.205 C 10.21 9.018 9.798 9.259 9.798 9.641 Z" />
                  </svg>
                </a>
              </div>
              <p className="footer-text">
                Timeless traditions, modern elegance. Discover our collection of
                hand-picked sarees and find the perfect piece to tell your
                story.
              </p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h4>Product</h4>
                <Link to={"/"}><a >Home</a></Link>
                <a href="./sort-by/all-products">Advisable</a>
                <a href="./sort-by/churidars">Promotions</a>
              </div>
              <div className="footer-column">
                <h4>Company</h4>
                <Link to={"/contact"}><a>Contact</a></Link>
                <Link to={"/faq"}><a >FAQ</a></Link>
              </div>
              <div className="footer-column">
                <h4>Legal</h4>
                <a href="./privacy-policy">Privacy</a>
                <a href="./terms-and-conditions">Terms</a>
                <a href="./404">404</a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p className="copyright">© 2025 lunai. All rights reserved.</p>
            <div className="payment-methods">
              <div className="payment-icon" >
                <img src={assets.visa} alt="visa" />
              </div>
              <div className="payment-icon" >
                <img src={assets.mastercard} alt="mastercard" />
              </div>
              <div className="payment-icon" >
                <img src={assets.ipay} alt="ipay" />
              </div>
              <div className="payment-icon" >
                <img src={assets.gpay} alt="gpay" />
              </div>
              <div className="payment-icon" >
                <img src={assets.paypal} alt="paypal" />
              </div>
              <div className="payment-icon" >
                <img src={assets.stripe} alt="stripe" />
              </div>
            </div>
          </div>
        </footer>
      </>
    </>
  );
};

export default Footer;
