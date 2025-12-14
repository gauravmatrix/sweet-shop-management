import React from 'react';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';

/**
 * Reusable Input Component
 * Supports various input types with validation and icons
 */

const Input = React.forwardRef((props, ref) => {
  const {
    label,
    type = 'text',
    error,
    success,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    placeholder,
    icon: Icon,
    iconPosition = 'left',
    fullWidth = true,
    className = '',
    showPasswordToggle = false,
    ...inputProps
  } = props;

  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);

  const inputType = type === 'password' && showPassword ? 'text' : type;

  const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  const inputClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200
    ${error ? 'border-red-300 bg-red-50' : ''}
    ${success ? 'border-green-300 bg-green-50' : ''}
    ${!error && !success ? 'border-sweet-light bg-white' : ''}
    ${isFocused && !error && !success ? 'border-sweet-primary ring-2 ring-sweet-primary/20' : ''}
    ${disabled ? 'bg-sweet-light cursor-not-allowed' : ''}
    ${readOnly ? 'bg-sweet-light/50 cursor-default' : ''}
    ${Icon || showPasswordToggle ? (iconPosition === 'left' ? 'pl-12' : 'pr-12') : ''}
    focus:outline-none focus:border-sweet-primary
    placeholder:text-sweet-dark/40
    text-sweet-dark
  `;

  const labelClasses = `
    block text-sm font-semibold mb-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark' : ''}
    ${disabled ? 'text-sweet-dark/60' : ''}
  `;

  const helperClasses = `
    text-xs mt-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark/60' : ''}
  `;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Left Icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <Icon size={20} className={error ? 'text-red-400' : success ? 'text-green-400' : 'text-sweet-dark/60'} />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={inputType}
          className={inputClasses}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!error}
          aria-describedby={helperText ? `${inputProps.id || ''}-helper` : undefined}
          {...inputProps}
        />

        {/* Right Icon - Password Toggle */}
        {type === 'password' && showPasswordToggle && (
          <button
            type="button"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-sweet-dark/60 hover:text-sweet-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}

        {/* Right Icon - Custom Icon */}
        {Icon && iconPosition === 'right' && !showPasswordToggle && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <Icon size={20} className={error ? 'text-red-400' : success ? 'text-green-400' : 'text-sweet-dark/60'} />
          </div>
        )}

        {/* Error/Success Icon */}
        {error && !Icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <AlertCircle size={20} className="text-red-500" />
          </div>
        )}
        {success && !error && !Icon && (
          <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
            <CheckCircle size={20} className="text-green-500" />
          </div>
        )}
      </div>

      {/* Helper Text / Error Message */}
      {(helperText || error || success) && (
        <div className={helperClasses} id={inputProps.id ? `${inputProps.id}-helper` : undefined}>
          {error && <span className="flex items-center gap-1"><AlertCircle size={14} /> {error}</span>}
          {success && !error && <span className="flex items-center gap-1"><CheckCircle size={14} /> {success}</span>}
          {helperText && !error && !success && <span>{helperText}</span>}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

/**
 * TextArea Component
 */
export const TextArea = React.forwardRef((props, ref) => {
  const {
    label,
    error,
    success,
    helperText,
    required = false,
    disabled = false,
    readOnly = false,
    placeholder,
    rows = 4,
    fullWidth = true,
    className = '',
    ...textareaProps
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);

  const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  const textareaClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200 resize-none
    ${error ? 'border-red-300 bg-red-50' : ''}
    ${success ? 'border-green-300 bg-green-50' : ''}
    ${!error && !success ? 'border-sweet-light bg-white' : ''}
    ${isFocused && !error && !success ? 'border-sweet-primary ring-2 ring-sweet-primary/20' : ''}
    ${disabled ? 'bg-sweet-light cursor-not-allowed' : ''}
    ${readOnly ? 'bg-sweet-light/50 cursor-default' : ''}
    focus:outline-none focus:border-sweet-primary
    placeholder:text-sweet-dark/40
    text-sweet-dark
  `;

  const labelClasses = `
    block text-sm font-semibold mb-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark' : ''}
    ${disabled ? 'text-sweet-dark/60' : ''}
  `;

  const helperClasses = `
    text-xs mt-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark/60' : ''}
  `;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* TextArea */}
      <textarea
        ref={ref}
        className={textareaClasses}
        placeholder={placeholder}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        rows={rows}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${textareaProps.id || ''}-helper` : undefined}
        {...textareaProps}
      />

      {/* Helper Text / Error Message */}
      {(helperText || error || success) && (
        <div className={helperClasses} id={textareaProps.id ? `${textareaProps.id}-helper` : undefined}>
          {error && <span className="flex items-center gap-1"><AlertCircle size={14} /> {error}</span>}
          {success && !error && <span className="flex items-center gap-1"><CheckCircle size={14} /> {success}</span>}
          {helperText && !error && !success && <span>{helperText}</span>}
        </div>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

/**
 * Select Component
 */
export const Select = React.forwardRef((props, ref) => {
  const {
    label,
    options = [],
    error,
    success,
    helperText,
    required = false,
    disabled = false,
    placeholder = 'Select an option',
    fullWidth = true,
    className = '',
    ...selectProps
  } = props;

  const [isFocused, setIsFocused] = React.useState(false);

  const containerClasses = `
    ${fullWidth ? 'w-full' : ''}
    ${disabled ? 'opacity-60 cursor-not-allowed' : ''}
    ${className}
  `;

  const selectClasses = `
    w-full px-4 py-3 rounded-lg border transition-all duration-200 appearance-none
    ${error ? 'border-red-300 bg-red-50' : ''}
    ${success ? 'border-green-300 bg-green-50' : ''}
    ${!error && !success ? 'border-sweet-light bg-white' : ''}
    ${isFocused && !error && !success ? 'border-sweet-primary ring-2 ring-sweet-primary/20' : ''}
    ${disabled ? 'bg-sweet-light cursor-not-allowed' : ''}
    focus:outline-none focus:border-sweet-primary
    text-sweet-dark
    bg-no-repeat bg-[right_1rem_center] bg-[length:1.5em_1.5em]
    bg-[url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")]
  `;

  const labelClasses = `
    block text-sm font-semibold mb-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark' : ''}
    ${disabled ? 'text-sweet-dark/60' : ''}
  `;

  const helperClasses = `
    text-xs mt-2
    ${error ? 'text-red-600' : ''}
    ${success ? 'text-green-600' : ''}
    ${!error && !success ? 'text-sweet-dark/60' : ''}
  `;

  return (
    <div className={containerClasses}>
      {/* Label */}
      {label && (
        <label className={labelClasses}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Select */}
      <select
        ref={ref}
        className={selectClasses}
        disabled={disabled}
        required={required}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        aria-invalid={!!error}
        aria-describedby={helperText ? `${selectProps.id || ''}-helper` : undefined}
        defaultValue=""
        {...selectProps}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option
            key={option.value || option}
            value={option.value || option}
            disabled={option.disabled}
          >
            {option.label || option}
          </option>
        ))}
      </select>

      {/* Helper Text / Error Message */}
      {(helperText || error || success) && (
        <div className={helperClasses} id={selectProps.id ? `${selectProps.id}-helper` : undefined}>
          {error && <span className="flex items-center gap-1"><AlertCircle size={14} /> {error}</span>}
          {success && !error && <span className="flex items-center gap-1"><CheckCircle size={14} /> {success}</span>}
          {helperText && !error && !success && <span>{helperText}</span>}
        </div>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export default Input;
export { TextArea, Select };