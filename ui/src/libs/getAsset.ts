import * as path from "path"

export default function getAsset(assetDir: string, assetName: string) {
    const baseAssetPath = path.join(".", "assets", assetDir)
    return path.join(baseAssetPath, assetName)
}
