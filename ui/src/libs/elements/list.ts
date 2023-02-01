import { TextElement } from "./TextElement";
import { ImageElement } from "./ImageElement";
import { MusicElement } from "./MusicElement";
import { ButtonElement } from "./ButtonElement";

const ELEMENT_LIST: {[key: string]: any} = {
    "text": TextElement,
    "image": ImageElement,
    "audio": MusicElement,
    "button": ButtonElement
}

export {ELEMENT_LIST}
