import React, { useState } from 'react';
import { ProjectElement } from '../../libs/project';

interface InspectorProps {
    currentElementUID: string
    elements: any
    forceRerender: any
}

function capitalizeFirstLetter(string: string)
{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export default function Inspector(props: InspectorProps) {
    if (!props.currentElementUID) return <></>
    
    const currentElement: ProjectElement = props.elements[props.currentElementUID]
    const properties = currentElement.properties.getAllProps()

    const [render, forceRerender] = useState(0)

    return <div className="inspector">
        <h2>{currentElement.name}</h2>
        {Object.keys(properties).map(key => {
            const property = properties[key]

            return <div className="input">
                {capitalizeFirstLetter(key)}: <input
                    type="text"
                    value={property}
                    onChange={(e) => {
                        const newValue = e.target.value
                        currentElement.properties.updateProperty(key, newValue)
                        forceRerender(render+1)
                        props.forceRerender(Math.random())
                    }}
                />
            </div>
        })}
    </div>
}
