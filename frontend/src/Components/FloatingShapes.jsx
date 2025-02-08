import { motion } from "framer-motion";
const FloatingShapes = ({ color, size, left, top, delay }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color} ${size} opacity-20 blur-xl`}
      style={{ left, top }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "mirror",
        delay,
      }}
    />
  );
};

export default FloatingShapes;
