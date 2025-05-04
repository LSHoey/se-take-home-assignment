import React from 'react'
import Order from './Widgets/Order'
import './styles.css';

function RightPanel({ completedOrders }) {
    return (
        <div id="mainRightPanel">COMPLETE
            <div>
                {completedOrders?.map((order) => {
                    return <Order
                        id={order?.id}
                        type={order?.type}
                        status={order?.status}
                        processedBy={order?.processedBy} />
                })}
            </div>
        </div>
    )
}

export default RightPanel