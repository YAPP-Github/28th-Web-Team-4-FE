//! 서비스 origin 판정과 허용된 외부 HTTP(S) 링크 처리.

use tauri::{AppHandle, Config, Url, utils::config::FrontendDist};
use tauri_plugin_opener::OpenerExt;

#[derive(Debug, PartialEq)]
pub(crate) enum Destination {
    Service,
    Browser,
    Blocked,
}

pub(crate) fn home(config: &Config) -> Url {
    if cfg!(debug_assertions) {
        return config
            .build
            .dev_url
            .clone()
            .expect("개발 웹 URL이 필요합니다");
    }
    match &config.build.frontend_dist {
        Some(FrontendDist::Url(url)) if url.scheme() == "https" => url.clone(),
        _ => panic!("운영 웹은 HTTPS URL이어야 합니다"),
    }
}

pub(crate) fn classify(url: &Url, home: &Url) -> Destination {
    if !url.username().is_empty() || url.password().is_some() {
        return Destination::Blocked;
    }
    if !matches!(url.scheme(), "https" | "http") {
        return Destination::Blocked;
    }
    if url.origin() == home.origin() {
        Destination::Service
    } else {
        Destination::Browser
    }
}

pub(crate) fn open_browser(app: &AppHandle, url: &Url) {
    // 호출자는 classify에서 Browser로 분류된 URL만 전달한다.
    if let Err(error) = app.opener().open_url(url.as_str(), None::<&str>) {
        eprintln!("기본 브라우저에서 링크를 열지 못했습니다: {error}");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn only_the_exact_service_origin_stays_in_the_app() {
        let home = Url::parse("https://chaeso-zip.com").unwrap();
        for path in ["/", "/recommend?from=app", "/compare#result"] {
            assert_eq!(
                classify(&home.join(path).unwrap(), &home),
                Destination::Service
            );
        }
        for other in [
            "https://chaeso-zip.com.evil.example/",
            "https://www.chaeso-zip.com/",
            "http://chaeso-zip.com/",
            "https://chaeso-zip.com:444/",
            "https://accounts.google.com/",
        ] {
            assert_eq!(
                classify(&Url::parse(other).unwrap(), &home),
                Destination::Browser
            );
        }
    }

    #[test]
    fn custom_schemes_credentials_and_removed_shell_routes_are_blocked() {
        let home = Url::parse("https://chaeso-zip.com").unwrap();
        for url in [
            "file:///etc/passwd",
            "javascript:alert(1)",
            "data:text/html,test",
            "mailto:test@example.com",
            "https://user@chaeso-zip.com/",
            "https://user:password@chaeso-zip.com/",
            "chaeso-shell://localhost/loading",
            "chaeso-shell://localhost/error",
            "chaeso-shell://localhost/other",
            "chaeso-shell://evil/loading",
            "chaeso-shell://localhost/loading?redirect=https://evil.example",
        ] {
            assert_eq!(
                classify(&Url::parse(url).unwrap(), &home),
                Destination::Blocked
            );
        }
    }

    #[test]
    fn notion_agreements_open_in_the_browser() {
        let home = Url::parse("https://chaeso-zip.com").unwrap();
        for url in [
            "https://extreme-moonstone-8ae.notion.site/3b2b0b17e916806c92cdec7eac6c0f7c",
            "https://app.notion.com/p/3b2b0b17e91680dc9567c8db372aa63d?source=copy_link",
        ] {
            assert_eq!(
                classify(&Url::parse(url).unwrap(), &home),
                Destination::Browser
            );
        }
    }

    #[test]
    fn development_origin_does_not_allow_other_local_ports() {
        let home = Url::parse("http://localhost:3003").unwrap();
        assert_eq!(
            classify(&home.join("/compare").unwrap(), &home),
            Destination::Service
        );
        assert_eq!(
            classify(&Url::parse("http://localhost:3000").unwrap(), &home),
            Destination::Browser
        );
    }
}
