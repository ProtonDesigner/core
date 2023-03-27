import fetch from "sync-fetch"

namespace GitHubUtils {
    export const GH_API_URL = "https://api.github.com"

    export function convertToRawLink(options: {
        username: string
        repo: string,
        branch: string,
        file_path: string
    }) {
        const { username, repo, branch, file_path } = options
    
        return `https://raw.githubusercontent.com/${username}/${repo}/${branch}/${file_path}`
    }

    export function getDirectory(options: {
        user: string,
        repo: string,
        path: string
    }): Array<any> | {[key: string]: any} {
        const { user, repo, path } = options

        return fetch(`${GH_API_URL}/repos/${user}/${repo}/contents/${path}`).json()
    }
    
    export function getFile(options: {
        username: string,
        repo: string,
        file_path: string,
        branch: string
    }) {
        const { username, repo, branch, file_path } = options
        
        const rawGHLink = convertToRawLink(options)
        return fetch(rawGHLink).text()
    }
}

export default GitHubUtils
