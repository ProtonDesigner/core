# You will need to install the toml library:
# pip install toml

import json
import toml
import os
import argparse

PACKAGE_JSON = "package.json"
TAURI_CONF_JSON = os.path.join("src-tauri", "tauri.conf.json")
CARGO_TOML = os.path.join("src-tauri", "Cargo.toml")

JSON_INDENTATION_LEVEL = 2

# Update package.json
def updatePackageJson(version: str):
    with open(PACKAGE_JSON, "r+") as f:
        f.seek(0)
        package_json = json.load(f)
        package_json["version"] = version
        f.seek(0)
        json.dump(package_json, f, indent=JSON_INDENTATION_LEVEL)
        f.truncate()
        f.write("\n")

# Update tauri.conf.json
def updateTauriJson(version: str):
    with open(TAURI_CONF_JSON, "r+") as f:
        f.seek(0)
        tauri_json = json.load(f)
        tauri_json["package"]["version"] = version
        f.seek(0)
        json.dump(tauri_json, f, indent=JSON_INDENTATION_LEVEL)
        f.truncate()
        f.write("\n")

# Update Cargo.toml
def updateCargoToml(version: str):
    with open(CARGO_TOML, "r+") as f:
        f.seek(0)
        cargo_toml = toml.load(f)
        cargo_toml["package"]["version"] = version
        f.seek(0)
        toml.dump(cargo_toml, f)
        f.truncate()

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        prog="ProtonVersionUpdater",
        description="Utility for updating versions in all files (because it was annoying to do so manually)",
        epilog="The classic cycle of a programmer"
    )
    parser.add_argument("version")

    args = parser.parse_args()
    updatePackageJson(args.version)
    updateTauriJson(args.version)
    updateCargoToml(args.version)
