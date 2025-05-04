import React, { useRef } from 'react'
import Button from '../Common/Button'
import Bot from './Widgets/Bot';
import './styles.css';

function QueuePanel({ bots, addBot, destroyBot, doneOrder }) {
    const timerRefs = useRef({});
    return (
        <>
            <div class="row align-right">
                <Button buttonText="+ Bot" onClick={addBot} />
                <Button buttonType="btn-danger" buttonText="- Bot" onClick={() => {
                    clearInterval(timerRefs.current[bots[0]?.id]?.intervalId);
                    destroyBot();
                }} />
            </div>
            <div className="row">
                {bots.map((bot) => {
                    return <Bot
                        key={bot?.id}
                        id={bot?.id}
                        status={bot?.status}
                        currentOrder={bot?.order}
                        processTime={bot?.processTime}
                        doneOrder={(currentOrder) => {
                            if (bot?.id != null) {
                                doneOrder(bot?.id, currentOrder)
                            }
                        }}
                        timerRefs={timerRefs}
                    />
                })}
            </div>
        </>
    )
}

export default QueuePanel