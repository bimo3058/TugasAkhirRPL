import React from 'react';  
const Button = (props) => {
    const {children, variant = "bg-black"} = props;
    return (
        <button type="submit" className={`h-10 px-6 font-semibold rounded-md ${variant} text-white`}>{children}</button>
    )
};

export default Button;