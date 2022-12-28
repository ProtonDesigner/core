import React, { useEffect, useState, FC } from 'react';
import "./dashboard.scss"

import PocketBase from "pocketbase"

interface DashboardProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
}

export default function Dashboard<FC>(props: DashboardProps) {
    const [projectName, setProjectName] = useState("")
    // WHY DID WE HAVE TO GO TO C++ LAND :(((( https://stackoverflow.com/a/60696264/20616402
    const [projects, setProjects] = useState<any[]>([])

    useEffect(() => {
        if (!props.currentUser) return () => {};
        async function getData() {
            const resultList = await props.pb.collection("projects").getFullList(100, {
                filter: `user = "${props.currentUser.id}"`
            })
            // console.log(resultList)
            setProjects(resultList)
        }
        getData()
    }, [])

    const createProject = async () => {
        const data = {
            name: projectName,
            user: props.currentUser.id,
            elements: {}
        }
        try {
            const createdProject = await props.pb.collection("projects").create(data)
        } catch (e) {
            console.log(e)
        }
    }

    return <div className="dashboard">
        <h2>Dashboard</h2>
        {props.currentUser ? <>
                <h5>Create project</h5>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project Name"
                    />
                    <button onClick={() => createProject()}>Create</button>
                    <h5>Projects</h5>
                    {projects && projects.map(project => {
                        return project.name
                    })}
                </form>
            </> : "Please login to create a project."
        }
    </div>
}
