import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";

const faqSections = [
  {
    title: "Placing an Order",
    prefix: "po",
    items: [
      {
        id: "po-1",
        q: "How can I search and browse products on the website?",
        a: "You can search for products using the search bar located at the top of the page or browse through the available product categories on the homepage.",
      },
      {
        id: "po-2",
        q: "Can I modify or cancel an already placed order?",
        a: "Unfortunately, we are unable to modify or cancel orders once they have been placed for security and efficiency reasons in order processing. Please contact us as soon as possible if you need assistance.",
      },
      {
        id: "po-3",
        q: "How can I check the stock of a product?",
        a: 'Product stock availability is displayed on each product page. If a product is in stock, it will be indicated as "In Stock." If it\'s unavailable, it will be marked as "Out of Stock."',
      },
    ],
  },
  {
    title: "Shipping and Delivery",
    prefix: "sd",
    items: [
      {
        id: "sd-1",
        q: "What delivery options are available and what are the associated costs?",
        a: "We offer multiple delivery options, including standard, express, or free shipping, depending on your location and order value. Exact costs will be displayed during the checkout process.",
      },
      {
        id: "sd-2",
        q: "Can I avail international delivery?",
        a: "Yes, we do offer international delivery. Costs and delivery times may vary depending on your exact location.",
      },
    ],
  },
  {
    title: "Returns and Exchanges",
    prefix: "re",
    items: [
      {
        id: "re-1",
        q: "What is the return policy for products?",
        a: "We accept returns within 30 days of receiving your order. Products must be in new, unused condition, and have the original packaging intact.",
      },
      {
        id: "re-2",
        q: "How can I initiate a return or exchange process?",
        a: "To initiate a return or exchange process, please contact us through our contact page or send an email to [email protected] We will respond with further instructions.",
      },
    ],
  },
  {
    title: "Support and Contact",
    prefix: "sc",
    items: [
      {
        id: "sc-1",
        q: "How can I contact our customer service for further questions?",
        a: "You can contact our customer service team through our contact page or by email at [email protected] We'll be happy to assist you with any questions or concerns you may have.",
      },
      {
        id: "sc-2",
        q: "What are the working hours of our customer service?",
        a: "Our customer service team is available Monday through Friday, between 9:00 AM and 6:00 PM, to assist you with any issues or inquiries.",
      },
      {
        id: "sc-3",
        q: "How long does it take to receive a response from customer service?",
        a: "We strive to respond to all inquiries as quickly as possible. Typically, you can expect a response within 24-48 hours during regular business days.",
      },
      {
        id: "sc-4",
        q: "Is there a phone number I can call for immediate assistance?",
        a: 'Yes, we have a dedicated customer service hotline available during business hours for immediate assistance. You can find our contact number on the "Contact Us" page.',
      },
      {
        id: "sc-5",
        q: "Do you offer live chat support for real-time assistance?",
        a: "Yes, we provide live chat support for real-time assistance during specified hours. Look for the chat icon in the bottom corner of the website to start a chat session with one of our representatives.",
      },
    ],
  },
];

function AccordionItem({ id, question, answer, isOpen, onToggle, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0,
    margin: "0px 0px -50px 0px",
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.7,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex justify-center flex-col items-center md:text-[15px] font-body px-3 md:px-8"
    >
      <button
        onClick={() => onToggle(id)}
        className="w-full flex justify-between items-center text-[12px] md:text-[15px] tracking-wide text-white cursor-pointer select-none text-left"
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        id={`accordion-${id}`}
      >
        {question}
        <svg
          className={`md:h-6 md:w-6 w-4 h-4 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>
      <div
        id={`panel-${id}`}
        role="region"
        aria-labelledby={`accordion-${id}`}
        className={`mt-3 py-1 overflow-hidden transition-[max-height,opacity] font-body text-[10px] md:text-[12px] duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p>{answer}</p>
      </div>
    </motion.div>
  );
}

// Section Wrapper with Scroll Animation
const FaqSection = ({ section, idx, sectionRefs, openMap, toggle }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, {
    once: false,
    amount: 0,
    margin: "0px 0px -50px 0px",
  });

  // Assign ref to both local and parent refs array
  useEffect(() => {
    if (ref.current) {
      sectionRefs.current[idx] = ref.current;
    }
  }, [idx, sectionRefs]);

  return (
    <motion.section
      ref={ref}
      id={`section-${section.prefix}`}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="w-full text-white flex flex-col gap-3 md:gap-6 pb-3 md:pb-8"
    >
      <motion.h1
        initial={{ opacity: 0, x: -30 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
        transition={{
          duration: 0.5,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="w-full bg-white/10 text-[12px] md:text-[15px] px-8 py-4 md:py-6 font-medium uppercase font-body"
      >
        {section.title}
      </motion.h1>

      {section.items.map((item, itemIdx) => (
        <AccordionItem
          key={item.id}
          id={item.id}
          question={item.q}
          answer={item.a}
          isOpen={!!openMap[item.id]}
          onToggle={toggle}
          index={itemIdx}
        />
      ))}
    </motion.section>
  );
};

const Faq = () => {
  // Accordion open state
  const [openMap, setOpenMap] = useState({});

  // ScrollSpy + indicator state
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);

  // Refs for measuring
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const navItemRefs = useRef([]);
  const sectionRefs = useRef([]);
  const navYPositionsRef = useRef([]);
  const indicatorHRef = useRef(40);

  const toggle = (id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const computeNavOffsets = () => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const indicatorH = indicatorRef.current?.offsetHeight ?? 40;
    indicatorHRef.current = indicatorH;

    const positions = faqSections.map((_, i) => {
      const itemEl = navItemRefs.current[i];
      if (!itemEl) return 0;
      const rect = itemEl.getBoundingClientRect();
      const centerY = rect.top + rect.height / 2;
      const y = Math.round(centerY - trackRect.top - indicatorH / 2);
      return y;
    });

    navYPositionsRef.current = positions;

    const trackH = trackRect.height;
    let y = positions[activeIndex] ?? 0;
    y = Math.max(0, Math.min(trackH - indicatorH, y));
    setIndicatorY(y);
  };

  const updateActiveNearest = () => {
    const centerY = window.innerHeight / 2;
    let minDist = Infinity;
    let closest = 0;
    sectionRefs.current.forEach((el, i) => {
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const mid = rect.top + rect.height / 2;
      const dist = Math.abs(mid - centerY);
      if (dist < minDist) {
        minDist = dist;
        closest = i;
      }
    });
    setActiveIndex(closest);
  };

  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const trackH = trackRect.height;
    const indicatorH = indicatorHRef.current;
    const positions = navYPositionsRef.current;

    let y = positions?.[activeIndex];

    if (typeof y !== "number" || Number.isNaN(y)) {
      const steps = Math.max(1, faqSections.length - 1);
      const step = (trackH - indicatorH) / steps;
      y = Math.round(activeIndex * step);
    }

    y = Math.max(0, Math.min(trackH - indicatorH, y));
    setIndicatorY(y);
  }, [activeIndex]);

  useEffect(() => {
    let ticking = false;

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          updateActiveNearest();
          ticking = false;
        });
      }
    };

    const onResize = () => {
      computeNavOffsets();
      onScroll();
    };

    const raf = requestAnimationFrame(() => {
      computeNavOffsets();
      updateActiveNearest();
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🎨 Animation Variants
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.5,
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const breadcrumbVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const navVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const navItemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (index) => ({
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="w-full mx-auto bg-black mt-20 md:mt-28 py-3 md:py-5"
    >
      <div className="w-[85%] lg:w-[80%] mx-auto">
        <motion.div
          variants={breadcrumbVariants}
          className="flex justify-start items-start"
        >
          <p className="text-white text-[10px] lg:text-[12px] tracking-wide font-body">
            <Link to={"/"} className="text-white/80 hover:text-white">
              Home
            </Link>{" "}
            / FAQ
          </p>
        </motion.div>
      </div>

      <div className="flex justify-center items-center">
        <motion.h1
          variants={titleVariants}
          className="text-[26px] md:text-[32px] lg:text-[65px] py-2 md:py-3 font-heading font-[950] uppercase text-white"
        >
          FAQ
        </motion.h1>
      </div>

      {/* content */}
      <div className="w-[90%] lg:w-[70%] mx-auto flex justify-center items-start py-5 md:py-10 gap-10">
        {/* Short topic */}
        <motion.div
          variants={navVariants}
          className="w-[30%] justify-center items-center gap-8 sticky top-24 hidden lg:flex"
        >
          <span
            ref={trackRef}
            className="h-[170px] w-[2px] relative bg-white/10 rounded-4xl overflow-hidden"
          >
            <motion.span
              ref={indicatorRef}
              initial={{ opacity: 0, scaleY: 0 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-0 w-[2px] bg-white h-[40px] transition-transform duration-300 ease-out will-change-transform"
              style={{
                transform: `translateY(${indicatorY}px)`,
                transformOrigin: "top",
              }}
            />
          </span>

          <div className="flex flex-col justify-center items-start gap-8">
            {faqSections.map((sec, idx) => (
              <motion.p
                key={sec.title}
                custom={idx}
                variants={navItemVariants}
                ref={(el) => (navItemRefs.current[idx] = el)}
                onClick={() => {
                  sectionRefs.current[idx]?.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  setActiveIndex(idx);
                }}
                whileHover={{ x: 5, scale: 1.05 }}
                transition={{ duration: 0.2 }}
                className={`uppercase font-body text-[11px] tracking-wider cursor-pointer
                  ${
                    idx === activeIndex
                      ? "text-white opacity-100 font-medium"
                      : "text-white/70 hover:text-white opacity-80"
                  }`}
              >
                {sec.title}
              </motion.p>
            ))}
          </div>
        </motion.div>

        {/* Right side: Qs and As */}
        <div className="w-full lg:w-[70%] flex flex-col justify-center items-center lg:px-8">
          {faqSections.map((section, idx) => (
            <FaqSection
              key={section.title}
              section={section}
              idx={idx}
              sectionRefs={sectionRefs}
              openMap={openMap}
              toggle={toggle}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Faq;
