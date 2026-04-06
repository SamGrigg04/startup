import React from 'react';
import { GameEvent, GameNotifier } from '../gameNotifier';
import './messages.css';

export function Messages({ currentUser }) {
    const [messages, setMessages] = React.useState([]);
    const POPUP_LIFESPAN = 5000;

    React.useEffect(() => {
        GameNotifier.addHandler(handleTopTenEvent);
        return () => {
        GameNotifier.removeHandler(handleTopTenEvent);
        };
    }, [currentUser]);

    function handleTopTenEvent(event) {
        if (event.type !== GameEvent.TopTen) return; // only display for the top 10
        if (event.from === currentUser) return; // only display for other users

        // gets the latest existing state
        // appends the new event, copies all old events and adds the new one to the end
        // keeps only the newest 5 events
        const id = Date.now() + Math.random();
        const text = `${event.from} moved into global top 10 at #${event.value.rank} (${event.value.time})`;
        setMessages((prev) => [...prev, { id, text }].slice(-5));

        // disappears after 5 seconds
        setTimeout(() => {
            setMessages((prev) => prev.filter((m) => m.id !== id));
        }, POPUP_TTL_MS);
    }

    function createMessageArray() {
        const messageArray = [];

        for (const [i, message] of messages.entries()) {
            // <NAME> moved into global top 10 at #<RANK> (<TIME>)
            const text = `${message.from} moved into global top 10 at #${message.value.rank} (${message.value.time})`;

            messageArray.push(
            <div key={i} className="message-item">
                {text}
            </div>
            );
        }

        return messageArray;
    }

    return <aside className="messages-popup">{createMessageArray()}</aside>;
}
