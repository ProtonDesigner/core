import React, { FC } from "react"
import BaseComponentProps from "../../BaseComponentProps";
import "./Editor.scss"

interface EditorProps extends BaseComponentProps {}

function Editor<FC>(props: EditorProps) {
    return <div className={`${props.className} editor`}></div>
}

export default Editor;
