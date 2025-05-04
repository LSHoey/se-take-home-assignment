import React from 'react'
import './styles.css';
import Order from './Widgets/Order';

function LeftPanel({ orders }) {
    return (
        <div id="mainLeftPanel">
            PENDING
            {orders?.map((order) => {
                return <Order
                    type={order?.type}
                    id={order?.id}
                    status={order?.status}
                    processedBy={order?.processedBy}
                />
            })}
        </div>
    )
}

export default LeftPanel