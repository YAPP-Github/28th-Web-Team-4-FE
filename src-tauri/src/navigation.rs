use tauri::{utils::config::FrontendDist, Config, Url};

#[derive(Debug, PartialEq)]
pub enum Destination {
    Service,
    Shell,
    Browser,
    Blocked,
}

pub fn home(config: &Config) -> Url {
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

pub fn classify(url: &Url, home: &Url) -> Destination {
    if !url.username().is_empty() || url.password().is_some() {
        return Destination::Blocked;
    }
    if url == &crate::recovery::loading_url() || url == &crate::recovery::error_url() {
        return Destination::Shell;
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

pub fn open_browser(url: Url) {
    // URL은 위 정책을 통과한 HTTP(S)만 전달한다. 셸 문자열로 실행하지 않는다.
    std::thread::spawn(move || {
        match std::process::Command::new("/usr/bin/open")
            .arg("--")
            .arg(url.as_str())
            .status()
        {
            Ok(status) if status.success() => {}
            _ => eprintln!("기본 브라우저에서 링크를 열지 못했습니다"),
        }
    });
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
    fn custom_schemes_credentials_and_unrecognized_shell_routes_are_blocked() {
        let home = Url::parse("https://chaeso-zip.com").unwrap();
        for url in [
            "file:///etc/passwd",
            "javascript:alert(1)",
            "data:text/html,test",
            "mailto:test@example.com",
            "https://user@chaeso-zip.com/",
            "chaeso-shell://localhost/other",
            "chaeso-shell://evil/loading",
            "chaeso-shell://localhost/loading?redirect=https://evil.example",
        ] {
            assert_eq!(
                classify(&Url::parse(url).unwrap(), &home),
                Destination::Blocked
            );
        }
        assert_eq!(
            classify(&crate::recovery::loading_url(), &home),
            Destination::Shell
        );
        assert_eq!(
            classify(&crate::recovery::error_url(), &home),
            Destination::Shell
        );
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
