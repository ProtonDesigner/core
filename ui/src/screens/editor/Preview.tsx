import React, { useRef, RefObject } from "react";
import { ProjectElement } from "../../libs/project";
import Draggable from "react-draggable";

interface PreviewProps {
    elements: any
    currentElementUID: any
    type: string
}

// interface ContainerProps {
//     elementUID: string
//     children: any
//     onDrag: (x: number, y: number) => any
// }

function ComponentContainer(props: any) {
    const nodeRef = useRef(null) as RefObject<HTMLDivElement>

    return <Draggable nodeRef={nodeRef} {...props}>
        <div ref={nodeRef}>{props.children}</div>
    </Draggable>
}

export default function Preview(props: PreviewProps) {
    console.log(props.elements)

    const previewRef = useRef() as RefObject<HTMLDivElement>

    return <div className={`preview ${props.type}`} ref={previewRef}>
        {props.elements && Object.keys(props.elements).map((element_index) => {
            let element: ProjectElement = props.elements[element_index]
            let Component = element.render
            return <ComponentContainer
                onDrag={(e: any, data: any) => console.log(data)}
                bounds={`.preview`}
            >
                <Component />
            </ComponentContainer>
        })}
    </div>
}
