import React from 'react';
import './Button.css';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    className = '',
    isLoading = false,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn-${variant}`;
    const sizeClass = size !== 'md' ? `btn-${size}` : '';
    const widthClass = fullWidth ? 'btn-full' : '';

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${widthClass} ${className}`}
            disabled={isLoading || props.disabled}
            {...props}
        >
            {isLoading ? <span className="spinner">...</span> : children}
        </button>
    );
};

export default Button;
