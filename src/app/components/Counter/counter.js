import { motion } from 'framer-motion';

const Counter = ({ end, title }) => {
  return (
    <div className="bg-green-50 p-6 m-4 rounded-lg text-center shadow-lg">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="text-2xl font-bold text-green-600"
      >
        <motion.span
          initial={{ count: 0 }}
          animate={{ count: end }}
          transition={{ duration: 2, ease: 'easeInOut' }}
        >
          {({ count }) => Math.floor(count)}
        </motion.span>
      </motion.div>
      <div>{title}</div>
    </div>
  );
};

export default Counter;