import React, { useRef, RefObject, useEffect } from "react";
import { ProjectElement, Project } from "@libs/project";
import { useDraggable, DragOptions } from "@neodrag/react";
import { ProjectScreen } from "@libs/project";

interface PreviewProps {
    project: Project
    currentElementUID: any
    type: string
    saveProject: () => any
    consoleLog: (message: string, type: string) => any
    screen: ProjectScreen
}

interface ContainerProps {
    element: ProjectElement
    children: any
    parent: RefObject<HTMLDivElement>
    saveProject: () => any
    key: any
}

function ComponentContainer(props: ContainerProps) {
    const nodeRef = useRef(null) as RefObject<HTMLDivElement>

    // console.log(props.element.properties.getProp("x"))

    const options: DragOptions = {
        bounds: ".preview",
        position: {
            x: props.element.properties.getProp("x"),
            y: props.element.properties.getProp("y")
        }
    }

    const { isDragging, dragState } = useDraggable(nodeRef, options)

    useEffect(() => {
        // console.log(isDragging, dragState)

        const offsetX = dragState?.offsetX
        const offsetY = dragState?.offsetY
        
        props.element.properties.updateProperty("x", offsetX && offsetX < 0 ? 0 : offsetX)
        props.element.properties.updateProperty("y", offsetY && offsetY < 0 ? 0 : offsetY)

        props.saveProject()
    }, [isDragging, dragState])

    return <div ref={nodeRef} className="element__container">{props.children}</div>
}

export default function Preview(props: PreviewProps) {
    // console.log(props.project)

    const previewRef = useRef() as RefObject<HTMLDivElement>

    const elements = props.screen.elements

    return <div className={`preview ${props.type}`} ref={previewRef}>
        {elements && Object.keys(elements).map((element_index) => {
            let element: ProjectElement = elements[element_index]
            let Component = element.render
            return <ComponentContainer
                element={element}
                parent={previewRef}
                saveProject={props.saveProject}
                key={element_index}
            >
                <Component />
            </ComponentContainer>
        })}
    </div>
}
