import React, { useState } from 'react';
import { ProjectElement, Project } from '../../libs/internal';

interface InspectorProps {
    currentElementUID: string
    setCurrentElement: any
    project: Project
    forceRerender: any
    saveProject: any
    currentScreen: string
}

function capitalizeFirstLetter(string: string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Inspector(props: InspectorProps) {
    if (!props.currentElementUID) return <></>
    
    const currentElement: ProjectElement = props.project.screens[props.currentScreen].elements[props.currentElementUID]
    const properties = currentElement.properties.getAllProps()

    const [render, forceRerender] = useState(0)

    return <div className="inspector">
        <h2>{currentElement.name}</h2>
        {Object.keys(properties).map(key => {
            const property = properties[key]

            if (key == "x" || key == "y") return <></>
            
            return <div className="input">
                {capitalizeFirstLetter(key)}: <input
                    type="text"
                    value={property}
                    onChange={(e) => {
                        const newValue = e.target.value
                        currentElement.properties.updateProperty(key, newValue)
                        forceRerender(render+1)
                        props.forceRerender(Math.random())
                        props.saveProject()
                    }}
                />
            </div>
        })}
        <button onClick={() => {
            props.project.screens[props.currentScreen].deleteElement(props.currentElementUID)
            props.setCurrentElement(null)
            props.saveProject()

        }}>Delete Element</button>
    </div>
}
