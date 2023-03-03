// import { TextElement } from "./TextElement";
// import { ImageElement } from "./ImageElement";
// import { MusicElement } from "./MusicElement";
// import { ButtonElement } from "./ButtonElement";

import React from "react";
// import { ElementProperty, ProjectElement } from "@libs/project"

let ELEMENT_LIST: {[key: string]: any};

import("@libs/project").then(({ ProjectElement, ElementProperty }) => {
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
    
    class MusicElement extends ProjectElement {
        audio: HTMLAudioElement
        isPlaying: boolean
    
        constructor() {
            super()
            this.audio = new Audio(this.properties.getProp("URL"))
            this.isPlaying = false
        }
    
        initialize(): void {
            this.name = "Audio"
            this.elementID = "audio"
    
            let properties: Array<any> = [
                new ElementProperty("URL", "")
            ]
            properties.map(property => {
                this.properties.addProperty(property)
            })
        }
    
        render(): JSX.Element
        render(): any {
            return <></>
        }
    
        onRun() {
            this.audio.src = this.properties.getProp("URL")
            
            if (this.isPlaying) {
                this.audio.pause()
                this.isPlaying = false
            } else {
                this.audio.play()
                this.isPlaying = true
            }
        }
    }
    
    class ButtonElement extends ProjectElement {
        initialize(): void {
            this.name = "Button"
            this.elementID = "button"
    
            const props: Array<any> = [
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
    
    ELEMENT_LIST = {
        "text": TextElement,
        "image": ImageElement,
        "audio": MusicElement,
        "button": ButtonElement
    }
})

export {
    ELEMENT_LIST
}
