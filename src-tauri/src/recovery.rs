use std::sync::{Arc, Mutex};
use tauri::{
    http::{Request, Response},
    AppHandle, Manager, Url,
};

pub fn loading_url() -> Url {
    Url::parse("chaeso-shell://localhost/loading").unwrap()
}

pub fn error_url() -> Url {
    Url::parse("chaeso-shell://localhost/error").unwrap()
}

pub fn respond(request: Request<Vec<u8>>) -> Response<Vec<u8>> {
    let (title, description) = match request.uri().path() {
        "/loading" => ("채소ZIP을 불러오고 있어요", "잠시만 기다려 주세요."),
        _ => (
            "페이지를 불러오지 못했어요",
            "인터넷 연결을 확인한 후 다시 시도해 주세요.",
        ),
    };
    let html = include_str!("../shell.html")
        .replace("{{title}}", title)
        .replace("{{description}}", description);
    Response::builder()
        .header("Content-Type", "text/html; charset=utf-8")
        .header("Cache-Control", "no-store")
        .header("Content-Security-Policy", "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'")
        .body(html.into_bytes())
        .unwrap()
}

#[derive(Default)]
pub struct LoadState {
    generation: u64,
    pending: Option<Url>,
}

fn document_url(url: &Url) -> Url {
    let mut document = url.clone();
    document.set_fragment(None);
    document
}

impl LoadState {
    fn begin(&mut self, url: &Url) -> u64 {
        self.generation += 1;
        self.pending = Some(document_url(url));
        self.generation
    }

    pub fn follow(&mut self, url: &Url) {
        if self.pending.is_some() {
            self.pending = Some(document_url(url));
        }
    }

    pub fn finish(&mut self, url: &Url) {
        if self.pending.as_ref() == Some(&document_url(url)) {
            self.pending = None;
        }
    }

    pub fn cancel(&mut self) {
        self.generation += 1;
        self.pending = None;
    }

    fn timed_out(&mut self, generation: u64) -> bool {
        if self.generation == generation && self.pending.is_some() {
            self.cancel();
            true
        } else {
            false
        }
    }
}

pub fn watch(app: &AppHandle, state: &Arc<Mutex<LoadState>>, url: &Url) {
    let generation = state.lock().unwrap().begin(url);
    let state = state.clone();
    let app = app.clone();
    // WebKit의 Started는 응답 commit 후에 오므로 요청 허용 시점부터 센다.
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_secs(20));
        let handle = app.clone();
        let _ = app.run_on_main_thread(move || {
            if state.lock().unwrap().timed_out(generation) {
                if let Some(window) = handle.get_webview_window("main") {
                    let _ = window.navigate(error_url());
                }
            }
        });
    });
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn connection_failure_before_commit_can_time_out() {
        let mut state = LoadState::default();
        let generation = state.begin(&Url::parse("https://chaeso-zip.com").unwrap());
        assert!(state.timed_out(generation));
        assert!(!state.timed_out(generation));
    }

    #[test]
    fn completed_or_superseded_requests_cannot_replace_the_current_page() {
        let mut state = LoadState::default();
        let home = Url::parse("https://chaeso-zip.com").unwrap();
        let next = home.join("/compare").unwrap();
        let old = state.begin(&home);
        let current = state.begin(&next);
        state.finish(&home);
        assert!(!state.timed_out(old));
        state.finish(&next);
        assert!(!state.timed_out(current));
        let retry = state.begin(&home);
        state.cancel();
        assert!(!state.timed_out(retry));
    }

    #[test]
    fn redirects_can_finish_loading_and_subsequent_spa_navigation_has_no_timeout() {
        let mut state = LoadState::default();
        let url = Url::parse("https://chaeso-zip.com/#features").unwrap();
        let generation = state.begin(&url);
        let next = url.join("/compare").unwrap();
        state.follow(&next);
        state.finish(&next);
        state.follow(&next.join("#details").unwrap());
        assert!(!state.timed_out(generation));
    }
}
