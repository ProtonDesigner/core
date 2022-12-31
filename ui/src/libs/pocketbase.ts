import Pocketbase from "pocketbase"
import { useState, useEffect } from "react"

const pb = new Pocketbase("https://proton-db.pockethost.io")
export default pb