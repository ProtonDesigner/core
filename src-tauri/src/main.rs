#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

// #[tauri::command]
// fn getPlugins() {
//   fs::read_dir().into()
// }

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
