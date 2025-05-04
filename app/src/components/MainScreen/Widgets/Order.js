import React from 'react'
import "../styles.css";

function Order({ id, type, status, processedBy }) {
    return (
        <div id="orderDiv" className={type === 'vip' ? 'vip' : `${type} ${status}`}>
            {type} order #{id}
            <div>
                Status: {status}
            </div>
            <div>
                Processed by: {processedBy ? `Bot #${processedBy}` : '-'}
            </div>
        </div>
    )
}

export default Order