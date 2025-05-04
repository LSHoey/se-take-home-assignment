import React from 'react'
import './styles.css';


function Button({ buttonType, buttonText, onClick }) {
    return (
        <div className={`col-2 btn ${buttonType ?? 'btn-primary'} p-2`} onClick={onClick}>{buttonText}</div>
    )
}

export default Button