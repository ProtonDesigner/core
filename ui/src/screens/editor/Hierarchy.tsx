import React from 'react';
import getAsset from '../../libs/getAsset';

interface HierarchyProps {
    elements?: any
    setElementDialog?: any
    currentElementUID: string
    setCurrentElementUID: any
}
interface HierarchyItemProps {
    name: string
    icon: JSX.Element
    onClick?: (e: any) => void
    active: boolean
}

function HierarchyItem(props: HierarchyItemProps) {
    return <div className={`item ${props.active ? "active" : ""}`} onClick={props.onClick}>
        {props.icon}
        <h4>{props.name}</h4>
    </div>
}

export default function Hierarchy(props: HierarchyProps) {
    return <div className="hierarchy">
        {/* <HierarchyItem name="Text" icon={<>Icon</>} /> */}
        {props.elements && Object.keys(props.elements).map(key => {
            let element = props.elements[key];
            return <HierarchyItem
                name={element.name}
                active={element.uid === props.currentElementUID}
                icon={<img src={getAsset(".", "element.png")} />}
                onClick={(e) => {
                    if (element.uid === props.currentElementUID) {
                        props.setCurrentElementUID(null)
                    } else {
                        props.setCurrentElementUID(element.uid)
                    }
                }}
            />
        })}
        <button onClick={() => props.setElementDialog(true)}>Add element</button>
    </div>
}
