import React from 'react';
import * as path from 'path';

const baseAssetPath = path.join(".", "assets")

export function getAsset(assetName: string) {
    return `/${assetName}`
}

interface ToolsProps {
    currentPage: number
    setCurrentPage: (newPage: number) => void
    setRunning: (newState: boolean) => void
    running: boolean
}

interface ToolButtonProps {
    children: any
    onClick: () => void
}

function ToolButton(props: ToolButtonProps) {
    return <div className="toolButton"
    
    onClick={props.onClick}>
        {props.children}
    </div>
}

export default function Tools(props: ToolsProps) {
    return <div className="tools">
        <ToolButton onClick={() => props.setCurrentPage(0)}>
            <img src={getAsset("editor.png")} />
        </ToolButton>
        <ToolButton onClick={() => props.setCurrentPage(1)}>
            <img src={getAsset("script.png")} />
        </ToolButton>
        <ToolButton onClick={() => {
            props.setRunning(!props.running)
        }}>
            <img src={getAsset("run-app.png")} />
        </ToolButton>
    </div>
}
