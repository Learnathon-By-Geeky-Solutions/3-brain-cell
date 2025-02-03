import { motion } from "framer-motion";

const VerticalLogoScroll = ({ organizations }) => {
  const scrollAnimation = {
    animate: {
      x: ["0%", "100%"],
      transition: {
        duration: 20,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <section className="h-100 my-10 mx-5">
      <p className="text-center text-3xl my-15">Organization Working with Us</p>
      <div className="relative overflow-hidden">
        <motion.div {...scrollAnimation} className="flex">
          <div className="flex space-x-10">
            {organizations.map((org, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 w-24 h-24 rounded-full bg-gray-300 flex items-center justify-center shadow-md"
              >
                <img
                  src={org.logo}
                  alt={`Organization ${org.id} logo`}
                  className="w-12 h-12 object-contain"
                />
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default VerticalLogoScroll;
