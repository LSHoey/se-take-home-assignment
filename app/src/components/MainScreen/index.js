import React, { useState } from 'react'
import LeftPanel from './LeftPanel'
import QueuePanel from './QueuePanel'
import RightPanel from './RightPanel'
import './styles.css';
import ControlPanel from './ControlPanel';

const ORDER_PROCESS_TIME = 10000;

function MainScreen() {
    const [currentBots, setCurrentBots] = useState([]);
    const [currentOrders, setCurrentOrders] = useState([]);

    const newVipOrders = async (newOrderId) => {
        let assignedBot;
        let oldOrder;
        // update bot to handle the new order
        const activeBot = currentBots.find(bot => bot.status === 'idle');
        const busyBots = currentBots.filter(bot => bot.status === 'processing');
        if (activeBot) {
            setCurrentBots((prevBots) => prevBots?.map((bot) => {
                return bot?.id === activeBot?.id ? {
                    ...bot,
                    order: newOrderId,
                    status: 'processing',
                    processTime: ORDER_PROCESS_TIME,
                } : bot;
            }));
            assignedBot = activeBot;
        } else if (busyBots?.length > 0) {
            // cut off current active bots
            // find busy bots that are not handling vip orders
            const vipOrders = currentOrders?.filter((order) => {
                return order?.type === 'vip';
            }).map((order) => { return order.id });
            assignedBot = busyBots?.find((bot) => {
                return !vipOrders?.includes(bot.order ?? 0);
            });
            oldOrder = assignedBot?.order;
            setCurrentBots((prevBots) => prevBots?.map((bot) => {
                return bot?.id === assignedBot?.id ? {
                    ...bot,
                    order: newOrderId,
                    status: 'processing',
                    processTime: ORDER_PROCESS_TIME,
                } : bot;
            }));

        }
        // update currentOrders
        const newOrder = {
            id: newOrderId,
            processTime: 10000, // 10 seconds
            processedBy: assignedBot ? assignedBot?.id : null,
            status: assignedBot ? 'processing' : 'idle',
            type: 'vip',
        }
        const normalOrders = [];
        const vipOrders = [];
        // split currentOrders into vip and normal
        currentOrders?.map((order) => {
            order?.type === 'vip' ?
                vipOrders.push(order) :
                normalOrders.push(order);
        });
        vipOrders.push(newOrder);
        const finalUpdated = [...vipOrders, ...normalOrders]?.map((order) => {
            return order?.id === oldOrder ? {
                ...order,
                status: 'idle',
                processedBy: null,
            } : order;
        })
        setCurrentOrders(finalUpdated);
    }

    const newNormalOrders = (newOrderId) => {
        // update bot to handle the new order
        const activeBot = currentBots.find(bot => bot.status === 'idle');
        if (activeBot) {
            setCurrentBots((prevBots) => prevBots?.map((bot) => {
                return bot?.id === activeBot?.id ? {
                    ...bot,
                    order: newOrderId,
                    status: 'processing',
                    processTime: ORDER_PROCESS_TIME
                } : bot;
            }));
        }

        const newOrder = {
            id: newOrderId,
            processTime: ORDER_PROCESS_TIME,
            processedBy: activeBot ? activeBot?.id : null,
            status: activeBot ? 'processing' : 'idle',
            type: 'normal',
        }
        setCurrentOrders([...currentOrders, newOrder]);
    }

    const addOrders = (type) => {
        const newOrderId = (currentOrders?.length ?? 0) + 1;
        if (type === 'vip') {
            newVipOrders(newOrderId)
        } else {
            newNormalOrders(newOrderId);
        }
    }

    const addBot = () => {
        let idleOrder = currentOrders.find(order => order.status === 'idle') ?? null;
        const newBot = {
            id: (currentBots?.length ?? 0) + 1,
            status: idleOrder != null ? 'processing' : 'idle',
            order: idleOrder?.id,
            processTime: idleOrder?.processTime,
        }
        if (idleOrder) {
            const newOrders = currentOrders?.map((order) => {
                return order?.id === idleOrder?.id ? {
                    ...order,
                    status: 'processing',
                    processedBy: newBot?.id,
                } : order;
            });
            setCurrentOrders(newOrders)
        }
        setCurrentBots([...currentBots, newBot]);
    }

    const destroyBot = () => {
        const firstBot = currentBots[0] ?? null;
        let otherActiveBot = currentBots?.find(bot => bot.status === 'idle' && bot?.order == null);

        // bot is active, revert back the order
        const destroyedBotOrder = firstBot?.order;
        if (destroyedBotOrder != null) {
            const updatedOrders = currentOrders?.map((order) => {
                return order?.id === destroyedBotOrder ?
                    {
                        ...order,
                        status: otherActiveBot ? 'processing' : 'idle',
                        processedBy: otherActiveBot ? otherActiveBot?.id : null,
                    }
                    : order;
            })
            setCurrentOrders(updatedOrders)
        }
        const updatedBots = [...currentBots];

        updatedBots.splice(0, 1);
        if (updatedBots?.length > 0) {
            setCurrentBots(updatedBots?.map((bot) => {
                return bot?.id === otherActiveBot?.id ? {
                    ...bot,
                    order: destroyedBotOrder,
                    status: 'processing',
                    processTime: ORDER_PROCESS_TIME,
                } : bot;
            }))
        }
    }


    const doneOrder = (botId, orderId) => {
        let newOrderToAssign;
        setCurrentOrders(prevState => {
            const updatedOrders = prevState;
            const orderIndex = updatedOrders?.findIndex((order) => {
                return order?.id === orderId;
            })
            if (orderIndex !== -1) {
                updatedOrders[orderIndex].status = 'completed';
                const newOrderToAssignIndex = prevState.findIndex(order => order.status === 'idle');

                if (newOrderToAssignIndex !== -1) {
                    newOrderToAssign = updatedOrders[newOrderToAssignIndex];
                    updatedOrders[newOrderToAssignIndex] = {
                        ...updatedOrders[newOrderToAssignIndex],
                        processTime: ORDER_PROCESS_TIME, // 10 seconds
                        processedBy: botId,
                        status: 'processing',
                    }
                    return updatedOrders;
                }
                return prevState;
            }
        })

        setCurrentBots((lastBotState) => lastBotState?.map((bot) => {
            return bot?.id === botId ? {
                ...bot,
                order: newOrderToAssign ? newOrderToAssign?.id : null,
                status: newOrderToAssign ? 'processing' : 'idle',
                processTime: newOrderToAssign ? newOrderToAssign?.processTime : null,
            } : bot;
        }))
    }

    const incompleteOrders = currentOrders?.filter((order) => {
        return order.status !== 'completed';
    })
    const completedOrders = currentOrders?.filter((order) => {
        return order.status === 'completed';
    })
    return (
        <div id="mainScreenDiv">
            <ControlPanel addOrders={addOrders} />
            <div id="mainScreenPanels">
                <LeftPanel orders={incompleteOrders} />
                <RightPanel completedOrders={completedOrders} />
            </div>
            <QueuePanel
                bots={currentBots}
                addBot={addBot}
                destroyBot={destroyBot}
                doneOrder={(botId, orderId) => { doneOrder(botId, orderId) }}
            />
        </div>
    )
}

export default MainScreen