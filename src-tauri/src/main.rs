#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::fs;
use std::path::Path;
use std::env;
use home;

// Some basic FS stuff (because Tauri limits it in the frontend)
fn get_current_working_dir() -> String {
  let res = env::current_dir();
  match res {
      Ok(path) => path.into_os_string().into_string().unwrap(),
      Err(_) => "FAILED".to_string()
  }
}

#[tauri::command]
fn cwd() -> String {
  return get_current_working_dir();
}

#[tauri::command]
fn list_dir(directory: String) -> Vec<String> {
  let path = Path::new(&get_current_working_dir()).join("..").join(directory);
  println!("{}", path.display());
  let paths = fs::read_dir(path).unwrap();
  let names = paths.map(|entry| {
    let entry = entry.unwrap();
  
    let entry_path = entry.path();
  
    let file_name = entry_path.file_name().unwrap();
  
    let file_name_as_str = file_name.to_str().unwrap();
  
    let file_name_as_string = String::from(file_name_as_str);
  
    file_name_as_string
  }).collect::<Vec<String>>();
  names
}

#[tauri::command]
fn read_file(file_path: String) -> String {
  let path = Path::new(&get_current_working_dir()).join("..").join(file_path);
  let data = fs::read_to_string(path).expect("Unable to read file");
  data
}

#[tauri::command]
fn write_file(file_path: String, data: String) -> Result<(), ()> {
  fs::write(file_path, data).expect("Unable to write to file");
  Ok(())
}

#[tauri::command]
fn mkdir(directory_path: String) -> Result<(), ()> {
  fs::create_dir_all(directory_path).expect("Unable to create directory");
  
  Ok(())
}

#[tauri::command]
fn exists(path: String) -> bool {
  return Path::new(&path).exists()
}

#[tauri::command]
fn rmdir(directory_path: String) -> Result<(), ()> {
  fs::remove_dir_all(directory_path).expect("Unable to delete directory");
  
  Ok(())
}

#[tauri::command]
fn rmfile(path: String) -> Result<(), ()> {
  fs::remove_file(path).expect("Unable to delete file");
  
  Ok(())
}

// General utility stuff
#[tauri::command]
fn get_home_dir() -> String {
  return String::from(home::home_dir().unwrap().to_string_lossy());
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![
      list_dir,
      read_file,
      write_file,
      mkdir,
      cwd,
      exists,
      get_home_dir,
      rmdir,
      rmfile
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
