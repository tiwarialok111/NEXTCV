import { twMerge } from 'tailwind-merge';

const variants = {
  default: 'bg-surface-highlight text-content-muted border border-surface-border',
  success: 'bg-success/10 text-success border border-success/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  error: 'bg-error/10 text-error border border-error/20',
  primary: 'bg-primary/10 text-primary-light border border-primary/20',
};

export function Badge({ children, variant = 'default', className }) {
  return (
    <span className={twMerge(
      'px-2.5 py-0.5 rounded-full text-xs font-medium',
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}
