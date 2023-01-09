import React from 'react';
import * as path from 'path';

const baseAssetPath = path.join(".", "assets")

export function getAsset(assetName: string) {
    return path.join(baseAssetPath, assetName)
}

interface ToolsProps {
    currentPage: number
    setCurrentPage: (newPage: number) => void
}

interface ToolButtonProps {
    children: any
    onClick: () => void
}

function ToolButton(props: ToolButtonProps) {
    return <div className="toolButton" onClick={props.onClick}>
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
    </div>
}
