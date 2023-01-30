import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { MusicElement } from "./MusicElement";

const ELEMENT_LIST: {[key: string]: any} = {
    "text": TextElement,
    "image": ImageElement,
    "audio": MusicElement
}

export {ELEMENT_LIST}
