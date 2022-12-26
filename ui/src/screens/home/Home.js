import React, { useState } from 'react'
import "./Home.scss"

const SidebarItem = (props) => {
    return <div className="item">
        <div className="icon">{props.icon}</div>
        <p>{props.children}</p>
    </div>
}

function Sidebar(props) {
    return <div className='sidebar'>
        <SidebarItem icon={<img src="./assets/user.png" />}>
            <p>
                Sign In
            </p>
        </SidebarItem>
        <SidebarItem icon={<img src="./assets/user.png" />}>
            <p>
                Home
            </p>
        </SidebarItem>
    </div>
}

export default function Home(props) {
    return (
        <div className={`${props.className} home`}>
            <Sidebar />
        </div>
    )
}