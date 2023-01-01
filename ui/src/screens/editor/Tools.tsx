import React from 'react';
import * as path from 'path';

const baseAssetPath = path.join(".", "assets", "home")

export function getAsset(assetName: string) {
    return path.join(baseAssetPath, assetName)
}

interface ToolsProps {}

function ToolButton(props: any) {
    return <div className="toolButton">
        {props.children}
    </div>
}

export default function Tools(props: ToolsProps) {
    return <div className="tools">
        <ToolButton>
            <img src={getAsset("cogwheel.png")} />
        </ToolButton>
    </div>
}
