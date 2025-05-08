'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { FiChevronDown } from 'react-icons/fi';

// Select Root
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
  value: string;
  onValueChange: (value: string) => void;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  ({ children, value, onValueChange, ...props }, ref) => {
    const [open, setOpen] = React.useState(false);
    
    // Close on click outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (ref && 'current' in ref && ref.current && !(ref.current as HTMLElement).contains(event.target as Node)) {
          setOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [ref]);
    
    return (
      <div className="relative" ref={ref}>
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            if (child.type === SelectTrigger) {
              return React.cloneElement(child as React.ReactElement<any>, {
                onClick: () => setOpen(!open),
                open,
              });
            }
            if (child.type === SelectContent) {
              return open ? React.cloneElement(child as React.ReactElement<any>, {
                value,
                onValueChange: (newValue: string) => {
                  onValueChange(newValue);
                  setOpen(false);
                },
              }) : null;
            }
            return child;
          }
        })}
      </div>
    );
  }
);

Select.displayName = 'Select';

// Select Trigger
interface SelectTriggerProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  open?: boolean;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ children, className, onClick, open }, ref) => {
    return (
      <button
        ref={ref}
        onClick={onClick}
        className={cn(
          'flex h-10 w-full items-center justify-between rounded-lg border border-theme bg-tertiary px-3 py-2 text-sm',
          'focus:outline-none focus:ring-2 focus:ring-accent',
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
      >
        {children}
        <FiChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
      </button>
    );
  }
);

SelectTrigger.displayName = 'SelectTrigger';

// Select Value
interface SelectValueProps {
  children?: React.ReactNode;
  placeholder?: string;
}

export const SelectValue = ({ children, placeholder }: SelectValueProps) => {
  return (
    <span className={cn('text-primary', !children && 'text-muted')}>
      {children || placeholder}
    </span>
  );
};

SelectValue.displayName = 'SelectValue';

// Select Content
interface SelectContentProps {
  children: React.ReactNode;
  className?: string;
  value?: string;
  onValueChange?: (value: string) => void;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  ({ children, className, value, onValueChange }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-theme bg-secondary p-1 shadow-lg',
          className
        )}
      >
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child) && child.type === SelectItem) {
            return React.cloneElement(child as React.ReactElement<any>, {
              active: child.props.value === value,
              onClick: () => onValueChange?.(child.props.value),
            });
          }
          return child;
        })}
      </div>
    );
  }
);

SelectContent.displayName = 'SelectContent';

// Select Item
interface SelectItemProps {
  children: React.ReactNode;
  className?: string;
  value: string;
  active?: boolean;
  onClick?: () => void;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  ({ children, className, active, onClick }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'relative flex cursor-pointer select-none items-center rounded-md py-1.5 px-2 text-sm outline-none transition-colors',
          active ? 'bg-accent text-black' : 'text-primary hover:bg-tertiary',
          className
        )}
        onClick={onClick}
      >
        {children}
      </div>
    );
  }
);

SelectItem.displayName = 'SelectItem'; 