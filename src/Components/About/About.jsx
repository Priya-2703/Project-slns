import React, { useLayoutEffect, useRef } from "react";
import { assets } from "../../../public/assets/asset";
import { gsap } from "gsap";

const About = () => {
  const container = useRef(null); // <-- ref object

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
      <div ref={container} className="w-full mx-auto bg-black mt-20 md:mt-28 py-5">
        <div className="flex justify-center items-center">
          <h1 className="about-reveal text-[28px] md:text-[45px] md:py-3 font1 font-[200] uppercase text-white">
            About us
          </h1>
        </div>

        <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-20 md:mt-4 py-3 lg:py-10">
          <div className="about-reveal flex justify-center items-center flex-col gap-2 md:gap-4 order-2 lg:order-1">
            <img
              src={assets.owner}
              alt="owner img"
              className="md:w-[450px] md:h-[500px] w-[300px] h-[350px] object-cover rounded-[10px]"
            />
            <p className="text-[25px] md:text-[45px] py-1 font1 font-[200] uppercase text-white">
              Ashok
            </p>
          </div>

          <div className="about-reveal w-[90%] lg:w-[32%] flex flex-col justify-center items-center gap-5 py-2 md:py-7 order-1 lg:order-2">
            <h1 className="text-[24px] md:text-[45px] py-3 font1 text-center font-[200] uppercase leading-snug text-white">
              Sri Lakshmi <br className="hidden lg:block"/> Narayana <br className="hidden md:block"/> Sarees
            </h1>
            <p className="text-[14px] leading-snug tracking-wide font2 text-justify font-[700] text-white">
              Sri Lakshmi Narayana Sarees has been a prominent and trusted name
              in the saree business for over 40 years. Based in Elampillai,
              Salem, the company is recognized as the leading wholesaler in the
              region. The company has cultivated a reputation for its authentic
              handloom sarees and commitment to customer satisfaction. Sri
              Lakshmi Narayana Sarees boasts a network of over 50,000 satisfied
              customers and offers worldwide shipping, extending its reach
              beyond India's borders
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center py-5">
          <p className="about-reveal w-[90%] lg:w-[70%] text-[12px] md:text-[14px] leading-normal tracking-wide font2 text-justify  font-[700] text-white">
            Preserving Tradition: Sri Lakshmi Narayana Sarees is dedicated to
            safeguarding the rich heritage of Elampillai Silk and producing
            sarees of unmatched elegance. Purest Quality: The company takes
            pride in using only the finest mulberry silk, known for its
            softness, luster, and durability, ensuring that each saree exudes
            luxury and comfort. Timeless Designs: Weavers at Sri Lakshmi
            Narayana Sarees meticulously craft each saree using traditional
            motifs, temple borders, and artistic patterns, reflecting the rich
            cultural heritage of Tamil Nadu. Sarees for Every Occasion: Sri
            Lakshmi Narayana Sarees offers a diverse collection of sarees
            suitable for various occasions, from grand weddings to festive
            gatherings and formal events. Blending Tradition with Innovation:
            While upholding traditional craftsmanship, Sri Lakshmi Narayana
            Sarees embraces innovation by exploring new techniques and design
            elements to meet the evolving preferences of contemporary saree
            enthusiasts. Commitment to Sustainability.
          </p>
        </div>

        <div className="flex justify-center items-center py-10 lg:py-20">
          <div className="about-reveal w-[90%] lg:w-[30%] flex flex-col justify-center items-center px-3 py-3">
            <p className="text-[16px] md:text-[26px] leading-snug font2  text-center font-[400] text-white">
              We'd love to hear from you. Send us a message.
            </p>
            <p className="text-[16px] md:text-[26px] leading-snug font2 text-center font-[400] text-white mt-3 md:mt-10">
              J256+6M4, Salem Main Rd, Elumathanoor, Elampillai, Tamil Nadu 637502
            </p>
            <p className="text-[16px] md:text-[26px] leading-snug font2 font-[400] text-white">
              +91 97862 87848
            </p>
            <p className="text-[16px] md:text-[26px] leading-snug font2 font-[400] text-[#955E30]">
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
