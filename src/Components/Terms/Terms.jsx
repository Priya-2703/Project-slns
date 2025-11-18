import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const terms = [
  {
    head: "Acceptance of Terms:",
    body: "By using this website, you agree to comply with and be bound by all of our Terms and Conditions. If you do not agree to these Terms and Conditions, please do not use this site.",
  },
  {
    head: "Privacy Policy:",
    body: "We are committed to protecting the privacy of your personal data in accordance with our Privacy Policy. By using this site, you consent to the collection, use, and disclosure of your personal data in accordance with this policy.",
  },
  {
    head: "Copyright and Intellectual Property:",
    body: "All copyrights and intellectual property rights to the content and materials on this site are owned by Store or its partners. Unauthorized use of these materials is prohibited and may constitute a violation of copyright laws.",
  },
  {
    head: "Orders and Payments:",
    body: "By placing an order on this site, you confirm that you are legally eligible to enter into a contract and make payments for the goods or services ordered.",
  },
  {
    head: "Delivery and Returns:",
    body: "Details regarding delivery options, associated costs, and return policies are specified in the dedicated sections of our site. Please review this information before placing your order.",
  },
  {
    head: "Limitation of Liability:",
    body: "Store shall not be liable for any loss or damage incurred as a result of the use or inability to use this website.",
  },
  {
    head: "Changes to Terms and Conditions:",
    body: "We reserve the right to update or modify these Terms and Conditions at any time. Any changes will be effective immediately upon posting on the site. Your continued use of the site after any such changes constitutes your acceptance of those changes.",
  },
];

const Terms = () => {
  //dynamic title
  useEffect(() => {
    document.title = `Terms and Conditions - SLNS Sarees`;
  }, []);
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
            <p className="text-white text-[10px] lg:text-[12px] tracking-wide capitalize font-body">
              <Link to={"/"} className="text-white/80 hover:text-white">
                Home
              </Link>{" "}
              / terms and conditions
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
            <h1 className="font-heading capitalize text-[35px] md:text-[65px] font-[950]">
              terms and conditions
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
              Welcome to Store, an online fashion retailer specializing in
              contemporary fashion and accessories. Please read these Terms and
              Conditions carefully before using our website.
            </motion.p>

            <div className="flex flex-col text-justify py-4">
              {terms.map((item, id) => {
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
              By using this website, you agree to abide by and be subject to
              these Terms and Conditions. For further questions or
              clarifications, please contact us through our contact page.
            </motion.p>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Terms;
