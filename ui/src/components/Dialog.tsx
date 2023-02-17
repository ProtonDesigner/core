import React, { FC, ReactNode } from "react"
import "./Dialog.scss"

import getAsset from "../libs/getAsset"

interface DialogProps {
    style?: object
    children: any
    title?: string
    show: boolean
    setShow: (value: boolean) => void
    className?: string
}

export default function Dialog<FC>(props: DialogProps) {
    return <>
        <div className={`screen ${props.show ? "show" : ""}`} />
        <div className={`dialog ${props.show ? "show" : ""} ${props.className}`} style={props.style}>
            <div className="top">
                {props.title && <h2>{props.title}</h2>}
                <img className="close__btn" src={getAsset(".", "mul.png")} onClick={() => props.setShow(false)} />
            </div>
            {props.children}
        </div>
    </>
}
