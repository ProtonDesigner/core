import React from "react";
import { ProjectElement } from "../../libs/project";

interface PreviewProps {
    elements: any
    currentElementUID: any
    type: string
}

export default function Preview(props: PreviewProps) {
    console.log(props.elements)
    return <div className={`preview ${props.type}`}>
        {props.elements && Object.keys(props.elements).map((element_index) => {
            let element = props.elements[element_index]
            let Component = element.render
            return <Component />
        })}
    </div>
}
