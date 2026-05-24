import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

export function Card({ children, className, hover = false, ...props }) {
  return (
    <motion.div
      whileHover={hover ? { y: -4 } : {}}
      className={twMerge(
        'glass-card p-6 transition-all duration-300',
        hover && 'hover:shadow-primary/10 hover:border-primary/30 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
