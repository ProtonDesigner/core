import React, { RefObject, useEffect, useRef, useState } from "react"
import "./TabbedSidebar.scss"

export interface Tab {
    title: string
    content: JSX.Element
}

interface Props {
    tabs: (ref: RefObject<HTMLInputElement>, state: ReturnType<typeof useState<string>>) => Tab[]
    title?: string
}

function TabButton(props: {
    onClick: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => any
    isActive: boolean
    text: string
}) {
    const { onClick, isActive, text } = props
    return <div className={`tab__button ${isActive ? "active" : ""}`}>
        <button onClick={onClick}>
            {text}
        </button>
        <div className="line" />
    </div>
}

function TabbedSidebar(props: Props) {
    const [currentTab, setCurrentTab] = useState(0)
    const [tabs, setTabs] = useState<Tab[]>([])

    const inputRef = useRef() as RefObject<HTMLInputElement>
    const inputState = useState<string | undefined>("")

    let { tabs: _tabs, title } = props
    let loaded = false

    useEffect(() => {
        if (!loaded) {
            const tabs = _tabs(inputRef, inputState)
            console.log(tabs)
            setTabs(tabs)
            loaded = true
        }
    }, [])

    const ContentComponent = tabs.length === 0 ? <></> : tabs[currentTab].content

    return <div className="sidebar__tabbed">
        <div className="tabs">
            <h3>{title}</h3>
            {tabs && tabs.map((tab, index) => {
                return <TabButton text={tab.title} isActive={index === currentTab} onClick={(e) => {
                    setCurrentTab(index)
                }} />
            })}
        </div>
        <div className="content">
            { tabs && ContentComponent }
        </div>
    </div>
}

export default TabbedSidebar
