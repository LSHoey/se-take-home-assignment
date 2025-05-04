import React, { useEffect, useState } from 'react'
import "../styles.css";

function Bot({ id, status, currentOrder, processTime, doneOrder, timerRefs }) {
    const [processing, setProcessing] = useState(processTime);

    useEffect(() => {
        // update timer ui
    }, [processing])

    const timerFunc = () => {
        let currentProcessTime = processTime;
        const intervalId = setInterval(() => {
            if (currentProcessTime === 0) {
                clearInterval(timerRefs.current[id].intervalId);
                doneOrder(currentOrder);
            } else {
                currentProcessTime -= 1000;
                setProcessing(prev => prev - 1000)
            }
        }, 1000);
        timerRefs.current[id].intervalId = intervalId;
        timerRefs.current[id].orderId = currentOrder;
    }

    useEffect(() => {
        if (currentOrder == null) {
            return;
        }
        if (!timerRefs.current[id]) {
            timerRefs.current[id] = {};
        }
        if (currentOrder !== timerRefs.current[id]?.orderId) {
            clearInterval(timerRefs.current[id]?.intervalId);
            console.log('newwwww', processTime)
            setProcessing(processTime);
            timerFunc();

        } else {
            setProcessing(processTime);
            timerFunc();
        }

    }, [currentOrder]);


    const processInSeconds = processing / 1000;
    return (
        <div id="bot" className={status}>
            <div>Bot {id}</div>
            <div> Status: {status} </div>
            <div> Order: {currentOrder != null ? `#${currentOrder}` : '-'}</div>
            <div>Time Left: {currentOrder != null ? `${processInSeconds} seconds` : '-'}</div>
        </div>
    )
}

export default Bot