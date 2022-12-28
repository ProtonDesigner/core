import React, { useEffect, useState } from 'react'
import "./Home.scss"

import Sidebar, { SidebarItem, getAsset } from "./Sidebar"
import Separator from '../../components/Separator'
import Dashboard from './dashboard'
import PocketBase from "pocketbase"
import Login from './login'

const server_url = "https://proton-db.pockethost.io"
const pb = new PocketBase(server_url)

export default function Home(props: any) {
    const [currentPage, setPage] = useState(0)
    const [currentUser, setCurrentUser] = useState(pb.authStore.model)


    console.log(currentPage)
    useEffect(() => {
        pb.authStore.onChange((auth) => {
            console.log("auth changed", auth)
            setCurrentUser(pb.authStore.model)
        })
    })

    const pages = [
        Login,
        Dashboard
    ]

    let Component = pages[currentPage]

    return (
        <div className={`${props.className} home`}>
            <Sidebar>
                <SidebarItem
                    icon={<img src={getAsset("user.png")} />}
                    onClick={() => setPage(0)}
                    rounded
                >
                    <p>
                        {currentUser ? currentUser.username : "Sign In"}
                    </p>
                </SidebarItem>
                <Separator />
                <SidebarItem
                    icon={<img src={getAsset("dashboard.png")}/>}
                    onClick={() => setPage(1)}
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
                <Component pb={pb} currentUser={currentUser} setCurrentUser={setCurrentUser} />
            </div>
        </div>
    )
}