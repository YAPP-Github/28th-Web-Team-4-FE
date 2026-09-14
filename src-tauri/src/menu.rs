use tauri::{
    menu::{Menu, MenuEvent, MenuItem, PredefinedMenuItem as Item, Submenu},
    AppHandle, Manager,
};

pub fn build(app: &AppHandle) -> tauri::Result<Menu<tauri::Wry>> {
    let application = Submenu::with_items(
        app,
        "채소ZIP",
        true,
        &[
            &Item::about(app, Some("채소ZIP 정보"), None)?,
            &Item::separator(app)?,
            &Item::hide(app, Some("채소ZIP 숨기기"))?,
            &Item::hide_others(app, Some("기타 숨기기"))?,
            &Item::show_all(app, Some("모두 보기"))?,
            &Item::separator(app)?,
            &Item::quit(app, Some("채소ZIP 종료"))?,
        ],
    )?;
    let edit = Submenu::with_items(
        app,
        "편집",
        true,
        &[
            &Item::undo(app, Some("실행 취소"))?,
            &Item::redo(app, Some("실행 복귀"))?,
            &Item::separator(app)?,
            &Item::cut(app, Some("오려두기"))?,
            &Item::copy(app, Some("복사하기"))?,
            &Item::paste(app, Some("붙여넣기"))?,
            &Item::select_all(app, Some("전체 선택"))?,
        ],
    )?;
    let window = Submenu::with_items(
        app,
        "윈도우",
        true,
        &[
            &MenuItem::with_id(app, "show", "채소ZIP 보기", true, None::<&str>)?,
            &MenuItem::with_id(app, "home", "홈으로 이동", true, Some("Cmd+Shift+H"))?,
            &MenuItem::with_id(app, "reload", "새로고침", true, Some("Cmd+R"))?,
            &Item::separator(app)?,
            &Item::minimize(app, Some("최소화"))?,
            &Item::maximize(app, Some("확대/축소"))?,
            &Item::fullscreen(app, Some("전체 화면 시작/종료"))?,
            &Item::close_window(app, Some("창 닫기"))?,
        ],
    )?;
    window.set_as_windows_menu_for_nsapp()?;
    Menu::with_items(app, &[&application, &edit, &window])
}

pub fn show_window(app: &AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.unminimize();
        let _ = window.set_focus();
    }
}

pub fn handle(app: &AppHandle, event: MenuEvent) {
    if let Some(window) = app.get_webview_window("main") {
        match event.id().as_ref() {
            "show" => show_window(app),
            "home" => {
                show_window(app);
                let _ = window.navigate(crate::recovery::loading_url());
            }
            "reload" => {
                if window.url().is_ok_and(|url| url.scheme() == "chaeso-shell") {
                    let _ = window.navigate(crate::recovery::loading_url());
                } else {
                    let _ = window.reload();
                }
            }
            _ => {}
        }
    }
}
