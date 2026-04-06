import React from 'react';
import { GameEvent, GameNotifier } from '../gameNotifier';
import './messages.css';

export function Messages({ currentUser }) {
    const [events, setEvents] = React.useState([]);

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
        setEvents((prev) => [...prev, event].slice(-5));
    }

    function createMessageArray() {
        const messageArray = [];

        for (const [i, event] of events.entries()) {
            // <NAME> moved into global top 10 at #<RANK> (<TIME>)
            const text = `${event.from} moved into global top 10 at #${event.value.rank} (${event.value.time})`;

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
