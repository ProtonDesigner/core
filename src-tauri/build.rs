fn main() {
    tauri_build::build()
}

// use tauri_build::{try_build, Attributes, WindowsAttributes};

// fn main() {
//     let win_att = WindowsAttributes::new().sdk_dir("C:/Program Files (x86)/Windows Kits/10/bin/10.0.22621.0/x64/");
//     if let Err(error) = try_build(Attributes::new().windows_attributes(win_att)) {
//         panic!("error found during tauri-build: {}", error);
//     }
// }