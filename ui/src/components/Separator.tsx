import React, { FC } from "react";

interface SeparatorProps {
    color?: string
    width?: string
    thickness?: string
}

export default function Separator<FC>(props: SeparatorProps) {
    return <div style={{
        backgroundColor: props.color || "black",
        width: props.width || "100%",
        height: props.thickness || "5px"
    }} />
}
