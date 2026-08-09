/* K-DEVCON 소개 페이지 — 진행 상태 표시용 최소 스크립트.
   JS가 없어도 모든 콘텐츠는 그대로 읽힌다 (style.css의 `.js .reveal` 참고). */
(function () {
  "use strict";

  // index.html의 인라인 폴백 타이머에게 "스크립트가 떴다"고 알린다
  window.__kdReady = true;

  var header = document.getElementById("siteHeader");
  var nav = document.getElementById("siteNav");
  var toggle = document.getElementById("navToggle");

  /* ---------- 스크롤 시 헤더 경계선 ---------- */
  if (header) {
    var onScroll = function () {
      header.classList.toggle("is-stuck", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 모바일 메뉴 ---------- */
  if (nav && toggle) {
    var setOpen = function (open) {
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "메뉴 닫기" : "메뉴 열기");
    };

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") setOpen(false);
    });

    // 데스크톱 폭으로 돌아오면 인라인 상태를 초기화
    var desktop = window.matchMedia("(min-width: 861px)");
    var onChange = function (e) {
      if (e.matches) setOpen(false);
    };
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  /* ---------- 섹션 진입 애니메이션 ---------- */
  var revealables = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    // 미지원 브라우저는 전부 표시된 상태로 둔다
    document.documentElement.classList.remove("js");
  } else {
    var revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          revealObserver.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );

    revealables.forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i % 6, 5) * 60 + "ms";
      revealObserver.observe(el);
    });

    /* ---------- 현재 섹션 네비게이션 하이라이트 ---------- */
    var links = Array.prototype.slice.call(
      document.querySelectorAll('.site-nav a[href^="#"]')
    );
    var sections = links
      .map(function (link) {
        return document.querySelector(link.getAttribute("href"));
      })
      .filter(Boolean);

    if (sections.length) {
      var sectionObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            links.forEach(function (link) {
              link.classList.toggle(
                "is-active",
                link.getAttribute("href") === "#" + entry.target.id
              );
            });
          });
        },
        { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
      );
      sections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    }
  }
})();
