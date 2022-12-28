import React, { FC } from 'react';

import * as path from "path"

const baseAssetPath = path.join(".", "assets", "home")

export function getAsset(assetName: string) {
    return path.join(baseAssetPath, assetName)
}

interface SidebarItemProps {
    onClick?: any
    style?: Object
    rounded?: boolean
    icon?: any
    children?: any
}

interface SidebarProps {
    children?: any
}

export function SidebarItem<FC>(props: SidebarItemProps) {
    return <div className="item" onClick={props.onClick} style={props.style}>
        <div className="icon" style={{
            borderRadius: props.rounded ? "50rem" : 0
        }}>{props.icon}</div>
        <p>{props.children}</p>
    </div>
}

export default function Sidebar<FC>(props: SidebarProps) {
    return <div className='sidebar'>
        {props.children}
    </div>
}