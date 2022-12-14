import React, { useEffect, useState, FC } from 'react';
import "./dashboard.scss"

import PocketBase from "pocketbase"

interface DashboardProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
    setCurrentPage(newState: any): any
    setState(newState: any): any
    state: object
}

interface ProjectCard {
    projectName: string
    onOpen(e: any): any
}

function ProjectCard<FC>(props: ProjectCard) {
    return <div className="project__card">
        <h4>{props.projectName}</h4>
        <button onClick={props.onOpen}>Open</button>
    </div>
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
                <h3>Create project</h3>
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="Project Name"
                    />
                    <button onClick={() => createProject()}>Create</button>
                </form>
                <h3>Projects</h3>
                <div className="projects">
                    {JSON.stringify(projects) !== JSON.stringify([]) ? projects.map(project => {
                        return <ProjectCard projectName={project.name} onOpen={(e) => {
                            props.setState({
                                ...props.state,
                                projectId: project.id
                            })
                            props.setCurrentPage(2)
                        }} key={Math.random()} />
                    }) : <p>Loading...</p>}
                </div>
            </> : "Please login to create a project."
        }
    </div>
}
