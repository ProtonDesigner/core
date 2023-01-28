import React, { useRef, RefObject, useEffect } from 'react';

interface ConsoleProps {
    messages: any
    setMessages: any
    currentElementUID: string
}

interface ConsoleMessageProps {
    message: string
    type: string
}

function ConsoleMessage(props: ConsoleMessageProps) {
    const compRef = useRef() as RefObject<HTMLDivElement>

    useEffect(() => {
        compRef.current?.scrollIntoView()
    })

    return <div key={Math.random()} className={`console__message ${props.type}`} ref={compRef}>
        {props.message}
    </div>
}

export default function Console(props: ConsoleProps) {
    return <div className={`console ${props.currentElementUID ? "dextend" : ""}`}>
        {props.messages && Object.keys(props.messages).map(key => {
            const msg = props.messages[key];
            return <ConsoleMessage type={msg["type"]} message={msg["message"]} />
        })}
    </div>
}
