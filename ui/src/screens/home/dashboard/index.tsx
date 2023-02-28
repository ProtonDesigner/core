import React, { useEffect, useState, FC } from 'react';
import "./dashboard.scss"

import PocketBase from "pocketbase"
import {
    Project, ProjectScreen
} from '@libs/project';

import Dialog from '@components/Dialog';

import { newMainLuaFile } from "@libs/newMainLuaFile"

import PluginManager from "@libs/plugin";
import Separator from '@components/Separator';

interface DashboardProps {
    pb: PocketBase
    currentUser: any
    setCurrentUser(newState: any): any
    setCurrentPage(newState: any): any
    setState(newState: any): any
    state: object
    pluginManager: PluginManager
    dialogUtils: {
        createDialog: Function,
        setDialog: Function,
        showDialog: Function,
        hideDialog: Function
    }
}

interface ProjectCard {
    projectName: string
    onOpen(e: any): any
    onDelete(e: any): any
}

function ProjectCard<FC>(props: ProjectCard) {
    return <div className="project__card">
        <h4>{props.projectName}</h4>
        <div className="buttons">
            <button className='primary' onClick={props.onOpen}>Open</button>
            <button className="danger" onClick={props.onDelete}>Delete</button>
        </div>
    </div>
}

export default function Dashboard<FC>(props: DashboardProps) {
    // WHY DID WE HAVE TO GO TO C++ LAND :(((( https://stackoverflow.com/a/60696264/20616402
    const [projects, setProjects] = useState<any[]>([])

    async function getData() {
        try {
            const resultList = await props.pb.collection("projects").getFullList(100, {
                filter: `user = "${props.currentUser.id}"`
            })
            // console.log(resultList)
            setProjects(resultList)
        } catch (e) {
            console.log(e)
            if (window.customNamespace.DEBUG) {} else {
                setProjects([
                    {}
                ]);
            }
        }
    }

    useEffect(() => {
        if (!props.currentUser) return () => {};
        
        getData()
    }, [])

    const createProject = async (projectName: string) => {
        const project = new Project(projectName)
        project.addScript(newMainLuaFile())

        const newScreen = new ProjectScreen("Screen 1")
        project.addScreen(newScreen)
        let data: any = project.serialize()
        data["user"] = props.currentUser.id
        await props.pb.collection("screens").create(newScreen.serialize()).then(screen_data => {
            data["screens"] = [
                screen_data.id
            ]
        })
        try {
            const createdProject = await props.pb.collection("projects").create(data)
            props.setState({
                ...props.state,
                project: createdProject
            })
            props.setCurrentPage(2)
        } catch (e) {
            console.log(e)
        }
    }

    const DialogContent = () => {
        const [projectName, setProjectName] = useState("")
        return <>
            <p>Enter your project name then click Create</p>
            <br />
            <Separator thickness='1px' />
            <br />
            <input type="text" value={projectName} onChange={(e) => {
                const value = e.target.value
                setProjectName(value)
            }} placeholder="Project Name" />
            <br />
            <br />
            <Separator thickness='1px' />
            <br />
            <button onClick={() => createProject(projectName)}>Create</button>
        </>}

    return <div className="dashboard">
        <h2>Dashboard</h2>
        {props.currentUser ? <>
                <button onClick={() => {
                    const dialog = props.dialogUtils.createDialog("Create New Project", <DialogContent />)
                    props.dialogUtils.setDialog(dialog)
                    props.dialogUtils.showDialog()
                }}>Create Project</button>
                
                <h3>Projects</h3>
                <div className="projects">
                    {JSON.stringify(projects) !== JSON.stringify([]) ? projects.map(project => {
                        return <ProjectCard projectName={project.name} onOpen={(e) => {
                            props.setState({
                                ...props.state,
                                project: project
                            })
                            props.setCurrentPage(2)
                        }} onDelete={(e) => {
                            props.dialogUtils.setDialog(
                                props.dialogUtils.createDialog(
                                    `Are you sure you want to delete project "${project.name}"?`,
                                    <>
                                        If you click yes, yes if you click that button that says yes, you are agreeing that we can delete your project from our servers.
                                        <br />
                                        <br />
                                        Are you sure you want to continue?
                                        <br />
                                        <br />
                                        <hr />
                                        <br />
                                        <div className="dialog__buttons">
                                            <button className='primary' onClick={(e) => {
                                                props.dialogUtils.hideDialog()
                                            }}>No</button>
                                            <button className='danger' onClick={async (e) => {
                                                await props.pb.collection("projects").delete(project.id).then((data) => {
                                                    props.dialogUtils.hideDialog()
                                                    getData()
                                                })
                                            }}>Yes</button>
                                        </div>
                                    </>
                                )
                            )
                            props.dialogUtils.showDialog()
                        }} key={Math.random()} />
                    }) : <p>Loading...</p>}
                </div>
            </> : "Please login to create a project."
        }
    </div>
}
