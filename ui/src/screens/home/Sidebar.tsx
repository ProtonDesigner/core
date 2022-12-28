import React from 'react';

import * as path from "path"

const baseAssetPath = path.join(".", "assets", "home")

export function getAsset(assetName: string) {
    return path.join(baseAssetPath, assetName)
}

export function SidebarItem (props: any) {
    return <div className="item" onClick={props.onClick} style={props.style}>
        <div className="icon" style={{
            borderRadius: props.rounded ? "50rem" : 0
        }}>{props.icon}</div>
        <p>{props.children}</p>
    </div>
}

export default function Sidebar(props: any) {
    return <div className='sidebar'>
        {props.children}
    </div>
}