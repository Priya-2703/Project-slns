import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const policy = [
  {
    head: "Information We Collect:",
    body: "When you visit our website, we may collect certain information about your device, including your IP address, browser type, and operating system. We also collect information about your browsing behavior on our site, such as the pages you visit and the products you view.",
  },
  {
    head: "Use of Information:",
    body: "We use the information we collect to provide and improve our services, communicate with you, process your orders, and personalize your shopping experience. We may also use your information to send you promotional offers and marketing communications.",
  },
  {
    head: "Disclosure of Information:",
    body: "We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you. We may also share your information when required by law or to protect our rights, property, or safety.",
  },
  {
    head: "Data Security:",
    body: "We take reasonable measures to protect the security of your personal information and prevent unauthorized access, use, or disclosure. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.",
  },
  {
    head: "Your Rights:",
    body: "You have the right to access, correct, or delete your personal information at any time. You may also opt-out of receiving promotional communications from us by following the instructions provided in those communications.",
  },
  {
    head: "Changes to This Policy:",
    body: "We reserve the right to update or change this Privacy Policy at any time. Any changes will be effective immediately upon posting on our website. We encourage you to review this Privacy Policy periodically for any updates or changes.",
  },
];

const Privacy = () => {
  return (
    <>
      <motion.div
        className="w-full mx-auto bg-black mt-20 md:mt-28 py-3 md:py-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-[85%] lg:w-[80%] mx-auto">
          <motion.div
            className="flex justify-start items-start"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <p className="text-white text-[10px] lg:text-[12px] tracking-wide font-body">
              <Link to={"/"} className="text-white/80 hover:text-white">
                Home
              </Link>{" "}
              / Privacy Policy
            </p>
          </motion.div>
        </div>

        <div className="w-full lg:w-[75%] text-white mx-auto mt-6">
          <motion.div
            className="w-[80%] mx-auto grid grid-cols-1"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="font-heading text-[35px] md:text-[65px] font-[950]">
              Privacy Policy
            </h1>
          </motion.div>

          <div className="w-[80%] mx-auto flex flex-col text-justify font-body mt-3 md:mt-6">
            <motion.p
              className="text-[12px] md:text-[16px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              At Store, we are committed to protecting your privacy and ensuring
              the security of your personal information. This Privacy Policy
              outlines how we collect, use, disclose, and protect your
              information when you visit our website or make a purchase from us.
            </motion.p>

            <div className="flex flex-col text-justify py-4">
              {policy.map((item, id) => {
                return (
                  <motion.div
                    key={id}
                    className="pb-5"
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: id * 0.1 }}
                  >
                    <p className="text-[16px] md:text-[22px] font-bold py-2">
                      {item.head}
                    </p>
                    <ul className="list-disc md:pl-10">
                      <li className="text-[12px] md:text-[16px] font-medium">
                        {item.body}
                      </li>
                    </ul>
                  </motion.div>
                );
              })}
            </div>

            <motion.p
              className="text-[12px] md:text-[16px]"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              By using our website, you consent to the terms of this Privacy
              Policy. If you have any questions or concerns about our Privacy
              Policy or the handling of your personal information, please
              contact us through our contact page.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Privacy;
