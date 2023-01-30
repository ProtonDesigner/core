import React from "react";
import { ElementProperty, ProjectElement } from "../internal"

class TextElement extends ProjectElement {
    initialize() {
        this.name = "Text"
        this.elementID = "text"
        this.properties.addProperty(new ElementProperty("text", "Hi!"))
    }

    render(): any {
        return <div>
            {this.properties.getProp("text")}
        </div>
    }
}

export {TextElement}