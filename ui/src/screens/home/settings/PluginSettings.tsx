import React from "react";
import PluginManager from "../../../libs/plugin";

export default function PluginSettings(props: {
    pluginManager: PluginManager
}) {
    return <div className="plugin__settings">
        {Object.keys(props.pluginManager.PLUGINS).map(filename => {
            const { plugin, pluginSettings } = props.pluginManager.PLUGINS[filename];
            return filename
        })}
    </div>
}
