import React from 'react';

interface HierarchyProps {}
interface HierarchyItemProps {
    name: string
    icon: JSX.Element
    onClick?: (e: any) => void
}

function HierarchyItem(props: HierarchyItemProps) {
    return <div className="item">
        {props.icon}
        <h5>{props.name}</h5>
    </div>
}

export default function Hierarchy(props: HierarchyProps) {
    return <div className="hierarchy">
        <HierarchyItem name="Text" icon={<>Icon</>} />
    </div>
}
