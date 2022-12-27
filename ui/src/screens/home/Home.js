import React, { useState } from 'react'
import "./Home.scss"

import Sidebar, { SidebarItem, getAsset } from "./Sidebar"
import Separator from '../../components/Separator'
import Dashboard from './dashboard'

export default function Home(props) {
    const [currentPage, setPage] = useState(0)

    const pages = [
        Dashboard
    ]

    let Component = pages[currentPage]

    return (
        <div className={`${props.className} home`}>
            <Sidebar>
                <SidebarItem icon={<img src={getAsset("user.png")} />} rounded>
                    <p>
                        Sign In
                    </p>
                </SidebarItem>
                <Separator />
                <SidebarItem
                    icon={<img src={getAsset("dashboard.png")}/>}
                    onClick={() => setPage(0)}
                >
                    <p>
                        Dashboard
                    </p>
                </SidebarItem>
                <SidebarItem icon={<img src={getAsset("folder.png")}/>}>
                    <p>
                        Projects
                    </p>
                </SidebarItem>
                <SidebarItem icon={<img src={getAsset("cogwheel.png")}/>} style={{
                    position: "absolute",
                    bottom: "0"
                }}>
                    <p>
                        Settings
                    </p>
                </SidebarItem>
            </Sidebar>
            <div className='page'>
                <Component />
            </div>
        </div>
    )
}