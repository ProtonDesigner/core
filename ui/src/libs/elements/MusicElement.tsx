import { ProjectElement, ElementProperty } from "../internal"
import React from "react"

interface MusicElement extends ProjectElement {
    audio: HTMLAudioElement
    isPlaying: boolean
}

class MusicElement extends ProjectElement {
    initialize(): void {
        this.name = "Audio"
        this.elementID = "audio"

        let properties: Array<ElementProperty> = [
            new ElementProperty("URL", "")
        ]
        properties.map(property => {
            this.properties.addProperty(property)
        })

        this.audio = new Audio(this.properties.getProp("URL"))
        this.isPlaying = false
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

export {
    MusicElement
}
