import { FiLoader } from 'react-icons/fi';
import { motion } from 'framer-motion';

type LoadingStateProps = {
  message?: string;
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
  variant?: 'default' | 'overlay';
};

export default function LoadingState({
  message = 'Loading...',
  size = 'medium',
  fullScreen = false,
  variant = 'default'
}: LoadingStateProps) {
  const sizeMap = {
    small: {
      icon: 24,
      height: 'h-32',
      text: 'text-sm'
    },
    medium: {
      icon: 32,
      height: 'h-64',
      text: 'text-base'
    },
    large: {
      icon: 48,
      height: 'h-96',
      text: 'text-lg'
    }
  };

  const selectedSize = sizeMap[size];
  
  const content = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex flex-col items-center justify-center ${fullScreen ? 'fixed inset-0 z-50' : selectedSize.height}`}
    >
      <FiLoader className="animate-spin text-yellow-500 mb-4" size={selectedSize.icon} />
      {message && <p className={`text-gray-300 ${selectedSize.text}`}>{message}</p>}
    </motion.div>
  );
  
  if (variant === 'overlay') {
    return (
      <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-40">
        {content}
      </div>
    );
  }
  
  return content;
} 