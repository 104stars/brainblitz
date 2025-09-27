import { SpinnerGapIcon } from '@phosphor-icons/react/ssr'

export default function LoadingButton({ 
  children, 
  loading = false, 
  disabled = false, 
  variant = 'primary', 
  size = 'md',
  type = 'button',
  className = '',
  ...props 
}) {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const variants = {
    primary: 'bg-gradient-to-r from-brand to-brand-600 text-white hover:from-brand-600 hover:to-brand-700 focus:ring-brand shadow-lg hover:shadow-xl',
    secondary: 'bg-white text-gray-900 border border-gray-300 hover:bg-gray-50 focus:ring-gray-500 shadow-sm hover:shadow-md',
    outline: 'border-2 border-brand text-brand hover:bg-brand hover:text-white focus:ring-brand'
  }
  
  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  }

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <SpinnerGapIcon 
          size={size === 'sm' ? 16 : size === 'lg' ? 24 : 20} 
          className="animate-spin mr-2" 
        />
      )}
      {children}
    </button>
  )
}
