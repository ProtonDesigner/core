#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

// let quit = CustomMenuItem::new("quit".to_string(), "Quit");
// let close = CustomMenuItem::new("close".to_string(), "Close");
// let fileSubMenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
// let menu = Menu::new();

// #[tauri::command]
// async fn command_name<R: Runtime>(app: tauri::AppHandle<R>, window: tauri::Window<R>) -> Result<(), String> {
//   Ok(())
// }

#[tauri::command]
fn greet(name: &str) -> String {
  format!("Hello, {}!", name)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![greet])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
