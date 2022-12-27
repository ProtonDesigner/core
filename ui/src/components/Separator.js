import React from "react";

export default function Separator(props) {
    return <div style={{
        backgroundColor: props.color || "black",
        width: props.width || "100%",
        height: props.thickness || "5px"
    }} />
}
