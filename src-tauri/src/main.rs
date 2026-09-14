mod menu;
mod navigation;
mod recovery;

use std::sync::{Arc, Mutex};
use tauri::{webview::NewWindowResponse, Manager, RunEvent, WebviewWindowBuilder, WindowEvent};

fn main() {
    tauri::Builder::default()
        .register_uri_scheme_protocol("chaeso-shell", |_, request| recovery::respond(request))
        .setup(|app| {
            let home = navigation::home(app.config());
            let state = Arc::new(Mutex::new(recovery::LoadState::default()));
            let navigation_home = home.clone();
            let navigation_state = state.clone();
            let popup_app = app.handle().clone();
            let popup_home = home.clone();

            let mut window_config = app.config().app.windows[0].clone();
            window_config.url = tauri::WebviewUrl::CustomProtocol(recovery::loading_url());
            WebviewWindowBuilder::from_config(app, &window_config)?
                .on_navigation(
                    move |url| match navigation::classify(url, &navigation_home) {
                        navigation::Destination::Service => {
                            navigation_state.lock().unwrap().follow(url);
                            true
                        }
                        navigation::Destination::Shell => {
                            navigation_state.lock().unwrap().cancel();
                            true
                        }
                        navigation::Destination::Browser => {
                            navigation::open_browser(url.clone());
                            false
                        }
                        navigation::Destination::Blocked => false,
                    },
                )
                .on_new_window(move |url, _| {
                    match navigation::classify(&url, &popup_home) {
                        navigation::Destination::Service => {
                            if let Some(window) = popup_app.get_webview_window("main") {
                                let _ = window.navigate(url);
                            }
                        }
                        navigation::Destination::Browser => navigation::open_browser(url),
                        _ => {}
                    }
                    NewWindowResponse::Deny
                })
                .on_page_load(move |window, payload| {
                    if payload.event() == tauri::webview::PageLoadEvent::Finished {
                        if payload.url() == &recovery::loading_url() {
                            recovery::watch(window.app_handle(), &state, &home);
                            let _ = window.navigate(home.clone());
                        } else {
                            state.lock().unwrap().finish(payload.url());
                        }
                    }
                })
                .build()?;
            app.set_menu(menu::build(app.handle())?)?;
            Ok(())
        })
        .on_menu_event(menu::handle)
        .on_window_event(|window, event| {
            if let WindowEvent::CloseRequested { api, .. } = event {
                api.prevent_close();
                let _ = window.hide();
            }
        })
        .build(tauri::generate_context!())
        .expect("채소ZIP 앱을 실행하지 못했습니다")
        .run(|app, event| {
            if let RunEvent::Reopen { .. } = event {
                menu::show_window(app);
            }
        });
}
