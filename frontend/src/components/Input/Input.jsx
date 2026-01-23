import React from 'react';
import './Input.css';

const Input = ({ label, error, className = '', ...props }) => {
    return (
        <div className={`input-group ${className}`}>
            {label && <label className="input-label" htmlFor={props.id}>{label}</label>}
            <div className="input-wrapper">
                <input
                    className={`input-field ${error ? 'input-error' : ''}`}
                    {...props}
                />
            </div>
            {error && <span className="error-message">{error}</span>}
        </div>
    );
};

export default Input;
