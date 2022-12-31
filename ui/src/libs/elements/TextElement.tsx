import React from "react";
import { ElementProperty, ProjectElement } from "../project"

export default class TextElement extends ProjectElement {
    initialize() {
        this.name = "Text"
        this.properties.addProperty(new ElementProperty("text", "Hi!"))
    }

    render(): any {
        return <div>
            {this.properties.getProp("text")}
        </div>
    }
}