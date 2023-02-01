import { ProjectElement, ElementProperty } from "../internal";
import React from "react";

class ButtonElement extends ProjectElement {
    initialize(): void {
        this.name = "Button"
        this.elementID = "button"

        const props: Array<ElementProperty> = [
            new ElementProperty("Text", ""),
            new ElementProperty("Lua Function", "")
        ]
        props.forEach((property) => {
            this.properties.addProperty(property)
        })
    }

    render(): JSX.Element;
    render(): any {
        return (
            <button onClick={
                (e) => {
                    try {
                        const func = this.getLua(this.properties.getProp("Lua Function"))
                        func()
                    } catch (e) {}
                }
            }>
                {this.properties.getProp("Text")}
            </button>
        )
    }
}

export {
    ButtonElement
}
