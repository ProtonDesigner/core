import React, { useState } from 'react'
import "./Tabs.scss"

export interface Tab {
    title: string
    content: JSX.Element
}

interface TabsProps {
    tabs: Array<Tab>
    currentIndex?: number
    setCurrentIndex?: (index: number) => void
    isEditor?: boolean
    className?: string
}

export default function Tabs(props: TabsProps) {
    let currentIndex: number;
    let setCurrentIndex: ((index: number) => void);
    if (props.currentIndex) {
        currentIndex = props.currentIndex;
        setCurrentIndex = props.setCurrentIndex || useState(0)[1]
    } else {
        [currentIndex, setCurrentIndex] = useState(0)
    }

    return <div className={`tabs ${props.className && props.className}`}>
        <div className="bar">
            {props.tabs.map((tab: Tab, index: number) => {
                return <div
                    className={`item ${currentIndex === index ? "active" : ""}`}
                    onClick={(e) => setCurrentIndex(index)}
                    key={tab.title}
                >
                    {tab.title}
                </div>
            })}
        </div>
        <div className={`content ${props.isEditor ? "editor" : ""}`}>
            {props.tabs.length > 0 && props.tabs[currentIndex]?.content}
        </div>
    </div>
}
