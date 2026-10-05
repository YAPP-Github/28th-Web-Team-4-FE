//! 단일 창의 생성, 탐색, 메뉴 동작과 macOS 재열기 처리.

use tauri::{
    App, AppHandle, Manager, RunEvent, Url, WebviewWindow, WebviewWindowBuilder, Window,
    WindowEvent, webview::NewWindowResponse,
};

use crate::navigation::{self, Destination};

const MAIN_WINDOW: &str = "main";

pub(crate) fn create(app: &App) -> Result<(), Box<dyn std::error::Error>> {
    let home = navigation::home(app.config());
    let mut config = app
        .config()
        .app
        .windows
        .iter()
        .find(|config| config.label == MAIN_WINDOW)
        .ok_or_else(|| {
            std::io::Error::new(std::io::ErrorKind::NotFound, "main 창 설정이 필요합니다")
        })?
        .clone();
    config.url = tauri::WebviewUrl::External(home.clone());

    let navigation_app = app.handle().clone();
    let navigation_home = home.clone();
    let popup_app = app.handle().clone();
    WebviewWindowBuilder::from_config(app, &config)?
        .on_navigation(move |url| allow_navigation(&navigation_app, url, &navigation_home))
        .on_new_window(move |url, _| {
            handle_new_window(&popup_app, url, &home);
            NewWindowResponse::Deny
        })
        .build()?;
    Ok(())
}

fn allow_navigation(app: &AppHandle, url: &Url, home: &Url) -> bool {
    match navigation::classify(url, home) {
        Destination::Service => true,
        Destination::Browser => {
            navigation::open_browser(app, url);
            false
        }
        Destination::Blocked => false,
    }
}

fn handle_new_window(app: &AppHandle, url: Url, home: &Url) {
    match navigation::classify(&url, home) {
        Destination::Service => navigate(app, url),
        Destination::Browser => navigation::open_browser(app, &url),
        Destination::Blocked => {}
    }
}

fn main_window(app: &AppHandle) -> Option<WebviewWindow> {
    let window = app.get_webview_window(MAIN_WINDOW);
    if window.is_none() {
        eprintln!("채소ZIP 창을 찾지 못했습니다");
    }
    window
}

fn report(action: &str, result: tauri::Result<()>) {
    if let Err(error) = result {
        eprintln!("{action} 실패: {error}");
    }
}

fn navigate(app: &AppHandle, url: Url) {
    if let Some(window) = main_window(app) {
        report("페이지 이동", window.navigate(url));
    }
}

pub(crate) fn show(app: &AppHandle) {
    if let Some(window) = main_window(app) {
        report("창 표시", window.show());
        report("최소화 해제", window.unminimize());
        report("창 포커스", window.set_focus());
    }
}

pub(crate) fn go_home(app: &AppHandle) {
    show(app);
    navigate(app, navigation::home(app.config()));
}

pub(crate) fn reload(app: &AppHandle) {
    if let Some(window) = main_window(app) {
        report("새로고침", window.reload());
    }
}

pub(crate) fn handle_window_event(window: &Window, event: &WindowEvent) {
    if window.label() == MAIN_WINDOW
        && let WindowEvent::CloseRequested { api, .. } = event
    {
        api.prevent_close();
        report("창 숨기기", window.hide());
    }
}

pub(crate) fn handle_app_event(app: &AppHandle, event: RunEvent) {
    if let RunEvent::Reopen { .. } = event {
        show(app);
    }
}
