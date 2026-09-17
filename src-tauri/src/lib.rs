//! macOS 앱 구성. 창 동작, 메뉴, URL 정책은 각각의 모듈에서 처리한다.

mod menu;
mod navigation;
mod window;

pub fn run() {
    tauri::Builder::default()
        .plugin(
            tauri_plugin_opener::Builder::new()
                // 링크 허용 여부는 Rust의 navigation 정책에서만 판단한다.
                .open_js_links_on_click(false)
                .build(),
        )
        .setup(|app| {
            window::create(app)?;
            app.set_menu(menu::build(app.handle())?)?;
            Ok(())
        })
        .on_menu_event(menu::handle)
        .on_window_event(window::handle_window_event)
        .build(tauri::generate_context!())
        .expect("채소ZIP 앱을 실행하지 못했습니다")
        .run(window::handle_app_event);
}
