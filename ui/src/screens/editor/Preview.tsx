import React from "react";
import { ProjectElement } from "../../libs/project";

interface PreviewProps {
    elements: object
}

export default function Preview(props: PreviewProps) {
    console.log(props.elements)
    return <div className="preview"></div>
}
