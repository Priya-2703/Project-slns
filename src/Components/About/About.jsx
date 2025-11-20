import React, { useEffect, useLayoutEffect, useRef } from "react";
import { assets } from "../../../public/assets/asset";
import { gsap } from "gsap";
import { useTranslation } from "react-i18next";

const About = () => {
  const {t} = useTranslation()
  const container = useRef(null); // <-- ref object

    //dynamic title
  useEffect(() => {
  document.title = `About - SLNS Sarees`;
}, []);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".about-reveal", {
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.15,
      });
    }, container); // <-- pass the ref object, not container.current

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div ref={container} className="w-full mx-auto bg-black mt-20 py-5">
        <div className="flex justify-center items-center">
          <h1 className="about-reveal text-[28px] md:text-[48px] font-heading font-[800] capitalize text-white">
            {t('about.title')}
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center lg:items-start gap-8 lg:gap-20 py-3 lg:py-10">
          <div className="about-reveal flex justify-center items-center flex-col order-2 lg:order-1">
            <img
              src={assets.owner}
              alt="owner img"
              loading="lazy"
              className="md:w-[450px] md:h-[500px] w-[300px] h-[350px] object-cover rounded-[10px]"
            />
            <p className="text-[20px] md:text-[35px] font-heading font-extrabold capitalize text-white">
              {t('about.owner_name')}
            </p>
          </div>

          <div className="about-reveal w-[90%] lg:w-[32%] flex flex-col justify-center items-center gap-5 py-2 md:py-7 order-1 lg:order-2">
            <h1 className="text-[24px] md:text-[45px] py-3 font-heading text-center font-extrabold capitalize leading-none text-accet">
              {t('about.company_name')}
            </h1>
            <p className="text-[16px] leading-normal tracking-normal capitalize font-body text-justify font-normal text-white/90">
              {t('about.description_main')}
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center py-5">
          <p className="about-reveal w-[90%] lg:w-[70%] text-[12px] md:text-[16px] leading-normal tracking-normal font-body text-justify  font-[300] text-white/90">
            {t('about.description_sub')}
          </p>
        </div>

        <div className="flex justify-center items-center">
          <div className="about-reveal w-[90%] lg:w-[30%] flex flex-col uppercase justify-center items-center gap-2 px-3 py-3">
            {/* <p className="text-[16px] md:text-[26px] leading-snug font-body  text-center font-[400] text-white">
              We'd love to hear from you. Send us a message.
            </p> */}
            <p className="text-[16px] md:text-[20px] leading-snug font-body text-center font-[400] text-white mt-3 md:mt-10">
             {t('about.address')}
            </p>
            <p className="text-[16px] md:text-[20px] leading-snug font-body font-[400] text-white">
              +91 97862 87848
            </p>
            <p className="text-[16px] md:text-[20px] leading-snug font-body font-[400] text-[#955E30]">
              slns@email.com
            </p>
          </div>

          {/* <div className="about-reveal w-[30%] flex justify-center items-center px-3 py-3">
            <div className="w-[100%] grid grid-cols-1 gap-2">
              <form className="flex flex-col gap-3">
                <div className="w-[100%] flex justify-center items-center gap-2">
                  <input
                    type="text"
                    className="w-[300px] bg-white/10 text-white rounded-[10px] capitalize text-[15px] px-3 py-2"
                    placeholder="Jane Smith"
                  />
                  <input
                    type="email"
                    className="w-[300px] bg-white/10 text-white capitalize rounded-[10px] text-[15px] px-3 py-2"
                    placeholder="Jane@gmail.com"
                  />
                </div>
                <textarea
                  name="Message"
                  className="w-full min-h-[200px] bg-white/10 text-white capitalize rounded-[10px] text-[15px] px-3 py-2"
                  placeholder="Message"
                />
                <button className='w-full text-black text-[15px] font-["Poppins"] font-[600] bg-gradient-to-t from-[#7D441A] to-[#8D653D] px-3 py-3 hover:bg-[#7D441A] hover:text-white transition-all duration-300 rounded-[10px]'>
                  Send
                </button>
              </form>
            </div>
          </div> */}
        </div>
      </div>
    </>
  );
};

export default About;
