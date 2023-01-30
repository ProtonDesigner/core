import React from "react";
import { ElementProperty, ProjectElement } from "../internal"

class ImageElement extends ProjectElement {
    initialize(): void {
        this.name = "Image"
        this.elementID = "image"
        this.properties.addProperty(new ElementProperty("URL", ""))
        this.properties.addProperty(new ElementProperty("Alt", ""))
        this.properties.addProperty(new ElementProperty("Width", 100))
        this.properties.addProperty(new ElementProperty("Height", 100))
    }

    render(): JSX.Element;
    render(): any {
        return (
            <img
                src={this.properties.getProp("URL")}
                alt={this.properties.getProp("Alt")}
                width={this.properties.getProp("Width")}
                height={this.properties.getProp("Height")}
            />
        )
    }
}

export {
    ImageElement
}
