import React from 'react'
import Button from '../Common/Button'
import "./styles.css"

function ControlPanel({ addOrders }) {
    return (
        <div class="row align-right">
            <Button buttonText="New Normal Order" onClick={() => { addOrders('normal') }} />
            <Button buttonText="New VIP Order" onClick={() => { addOrders('vip') }} />
        </div>
    )
}

export default ControlPanel