import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const faqSections = [
  {
    title: "Placing an Order",
    prefix: "po",
    items: [
      { id: "po-1", q: "How can I search and browse products on the website?", a: "You can search for products using the search bar located at the top of the page or browse through the available product categories on the homepage." },
      { id: "po-2", q: "Can I modify or cancel an already placed order?", a: "Unfortunately, we are unable to modify or cancel orders once they have been placed for security and efficiency reasons in order processing. Please contact us as soon as possible if you need assistance." },
      { id: "po-3", q: "How can I check the stock of a product?", a: 'Product stock availability is displayed on each product page. If a product is in stock, it will be indicated as "In Stock." If it\'s unavailable, it will be marked as "Out of Stock."' },
    ],
  },
  {
    title: "Shipping and Delivery",
    prefix: "sd",
    items: [
      { id: "sd-1", q: "What delivery options are available and what are the associated costs?", a: "We offer multiple delivery options, including standard, express, or free shipping, depending on your location and order value. Exact costs will be displayed during the checkout process." },
      { id: "sd-2", q: "Can I avail international delivery?", a: "Yes, we do offer international delivery. Costs and delivery times may vary depending on your exact location." },
    ],
  },
  {
    title: "Returns and Exchanges",
    prefix: "re",
    items: [
      { id: "re-1", q: "What is the return policy for products?", a: "We accept returns within 30 days of receiving your order. Products must be in new, unused condition, and have the original packaging intact." },
      { id: "re-2", q: "How can I initiate a return or exchange process?", a: "To initiate a return or exchange process, please contact us through our contact page or send an email to [email protected] We will respond with further instructions." },
    ],
  },
  {
    title: "Support and Contact",
    prefix: "sc",
    items: [
      { id: "sc-1", q: "How can I contact our customer service for further questions?", a: "You can contact our customer service team through our contact page or by email at [email protected] We'll be happy to assist you with any questions or concerns you may have." },
      { id: "sc-2", q: "What are the working hours of our customer service?", a: "Our customer service team is available Monday through Friday, between 9:00 AM and 6:00 PM, to assist you with any issues or inquiries." },
      { id: "sc-3", q: "How long does it take to receive a response from customer service?", a: "We strive to respond to all inquiries as quickly as possible. Typically, you can expect a response within 24-48 hours during regular business days." },
      { id: "sc-4", q: "Is there a phone number I can call for immediate assistance?", a: 'Yes, we have a dedicated customer service hotline available during business hours for immediate assistance. You can find our contact number on the "Contact Us" page.' },
      { id: "sc-5", q: "Do you offer live chat support for real-time assistance?", a: "Yes, we provide live chat support for real-time assistance during specified hours. Look for the chat icon in the bottom corner of the website to start a chat session with one of our representatives." },
    ],
  },
];

function AccordionItem({ id, question, answer, isOpen, onToggle }) {
  return (
    <div className="flex justify-center flex-col items-center text-[15px] font-['Poppins'] px-8">
      <button
        onClick={() => onToggle(id)}
        className="w-full flex justify-between items-center text-[15px] tracking-wide text-white cursor-pointer select-none text-left"
        aria-expanded={isOpen}
        aria-controls={`panel-${id}`}
        id={`accordion-${id}`}
      >
        {question}
        <svg
          className={`h-6 w-6 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
        className={`mt-3 py-1 overflow-hidden transition-[max-height,opacity] font2 text-[12px] duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p>{answer}</p>
      </div>
    </div>
  );
}

const Faq = () => {
  // Accordion open state
  const [openMap, setOpenMap] = useState({});

  // ScrollSpy + indicator state
  const [activeIndex, setActiveIndex] = useState(0);
  const [indicatorY, setIndicatorY] = useState(0);

  // Refs for measuring
  const trackRef = useRef(null);
  const indicatorRef = useRef(null);
  const navItemRefs = useRef([]);      // left topic <p> elements
  const sectionRefs = useRef([]);       // right <section> blocks
  const navYPositionsRef = useRef([]);  // computed Y offsets per topic
  const indicatorHRef = useRef(40);

  const toggle = (id) => {
    setOpenMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Compute nav item centers relative to the track (for precise alignment)
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
      // Translate so the indicator's center lines up with the topic center
      const y = Math.round(centerY - trackRect.top - indicatorH / 2);
      return y;
    });

    navYPositionsRef.current = positions;

    // Clamp and set current position immediately
    const trackH = trackRect.height;
    let y = positions[activeIndex] ?? 0;
    y = Math.max(0, Math.min(trackH - indicatorH, y));
    setIndicatorY(y);
  };

  // Pick the section whose center is closest to viewport center
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

  // Update indicator translateY whenever activeIndex changes
  useEffect(() => {
    const trackEl = trackRef.current;
    if (!trackEl) return;

    const trackRect = trackEl.getBoundingClientRect();
    const trackH = trackRect.height;
    const indicatorH = indicatorHRef.current;
    const positions = navYPositionsRef.current;

    let y = positions?.[activeIndex];

    // Fallback: equal-step spacing if measurement missing
    if (typeof y !== "number" || Number.isNaN(y)) {
      const steps = Math.max(1, faqSections.length - 1);
      const step = (trackH - indicatorH) / steps;
      y = Math.round(activeIndex * step);
    }

    // Clamp into track bounds
    y = Math.max(0, Math.min(trackH - indicatorH, y));
    setIndicatorY(y);
  }, [activeIndex]);

  // Attach scroll + resize listeners and do first measurements
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
      // Re-measure nav offsets and recompute active section on resize
      computeNavOffsets();
      onScroll();
    };

    // Initial measure (after paint)
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

  return (
    <>
      <div className="w-full mx-auto bg-black mt-2 py-5">
        <div className="w-[80%] mx-auto">
          <div className="flex justify-start items-start">
            <p className="text-white text-[12px] tracking-wide font2">
              <Link to={"/"} className="text-white/80 hover:text-white">
                Home
              </Link>{" "}
              / FAQ
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center">
          <h1 className="about-reveal text-[45px] py-3 font1 font-[200] uppercase text-white">
            FAQ
          </h1>
        </div>

        {/* content */}
        <div className="w-[70%] mx-auto flex justify-center items-start py-10 gap-10">
          {/* Short topic */}
          <div className="w-[30%] flex justify-center items-center gap-8 sticky top-24">
            <span
              ref={trackRef}
              className="h-[170px] w-[2px] relative bg-white/10 rounded-4xl overflow-hidden"
            >
              <span
                ref={indicatorRef}
                className="absolute top-0 w-[2px] bg-white h-[40px] transition-transform duration-300 ease-out will-change-transform"
                style={{ transform: `translateY(${indicatorY}px)` }}
              />
            </span>

            <div className="flex flex-col justify-center items-start gap-8">
              {faqSections.map((sec, idx) => (
                <p
                  key={sec.title}
                  ref={(el) => (navItemRefs.current[idx] = el)}
                  onClick={() => {
                    // Optional: click topic → scroll that section to center
                    sectionRefs.current[idx]?.scrollIntoView({
                      behavior: "smooth",
                      block: "center",
                    });
                    // Immediate visual feedback:
                    setActiveIndex(idx);
                  }}
                  className={`uppercase font2 text-[11px] tracking-wider cursor-pointer
                    ${idx === activeIndex ? "text-white opacity-100 font-medium" : "text-white/70 hover:text-white opacity-80"}`}
                >
                  {sec.title}
                </p>
              ))}
            </div>
          </div>

          {/* Right side: Qs and As */}
          <div className="w-[70%] flex flex-col justify-center items-center px-8">
            {faqSections.map((section, idx) => (
              <section
                key={section.title}
                id={`section-${section.prefix}`}
                ref={(el) => (sectionRefs.current[idx] = el)}
                className="w-full text-white flex flex-col gap-6 pb-8"
              >
                <h1 className="w-full bg-white/10 text-[15px] px-8 py-6 font2-bold">
                  {section.title}
                </h1>

                {section.items.map((item) => (
                  <AccordionItem
                    key={item.id}
                    id={item.id}
                    question={item.q}
                    answer={item.a}
                    isOpen={!!openMap[item.id]}
                    onToggle={toggle}
                  />
                ))}
              </section>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Faq;