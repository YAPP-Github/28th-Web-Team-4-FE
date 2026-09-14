fn main() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("채소ZIP 앱을 실행하지 못했습니다");
}
