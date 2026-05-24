import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-gradient-primary text-white hover:opacity-90 shadow-lg shadow-primary/25 border-transparent',
  secondary: 'bg-surface-highlight text-content hover:bg-surface-border border-surface-border border',
  outline: 'bg-transparent text-content-muted border border-surface-border hover:border-content-muted hover:text-content',
  danger: 'bg-error/10 text-error hover:bg-error/20 border-error/20 border',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

export function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className,
  icon: Icon,
  ...props 
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      className={twMerge(
        'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {Icon && <Icon size={size === 'sm' ? 14 : 18} className="mr-2 shrink-0" />}
      {children}
    </motion.button>
  );
}
