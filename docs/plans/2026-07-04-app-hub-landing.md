# WooBottle 앱 허브 + 랜딩 생태계 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 8개 모바일 앱의 정적 랜딩 페이지 + 통합 `/apps` 허브를 만들고, `houseads.json` 카탈로그로 앱·허브·도구 사이트를 서로 링크로 엮는다.

**Architecture:** 전부 `public/` 하위 정적 HTML. `houseads.json`을 단일 카탈로그(진실의 원천)로 확장 → 허브 그리드 + 각 랜딩 하단 "다른 앱" 스트립 + 인앱 하우스광고를 모두 구동. 콘텐츠(히어로/기능/스샷)는 앱별 수작업, 상호링크만 카탈로그 런타임 fetch. 공통 "다른 앱" 스트립은 `/_shared/other-apps.js` 하나로 DRY.

**Tech Stack:** 정적 HTML/CSS/바닐라 JS(fetch), Next.js 15 static export(`output: 'export'`, `trailingSlash: true`, `public/`가 out/ 루트로 서빙됨).

**설계 문서:** `docs/plans/2026-07-04-app-hub-landing-design.md`

---

## 참고: 검증 방식

정적 페이지라 유닛테스트 대신 **정적 서버 + 브라우저/curl 검증**을 쓴다. 로컬 확인:

```bash
# 프로젝트 루트에서 public/을 정적 서빙 (houseads.json 절대경로 /houseads.json 가 맞아떨어짐)
python3 -m http.server 4599 -d public &
# 확인 후: kill %1
```

각 페이지는 `http://localhost:4599/<경로>` 로 연다. `/houseads.json` 절대경로가 이 서버 루트 기준으로 동작한다.

---

## 앱 카탈로그 데이터 (전 태스크 공통 참조)

| id | name | emoji | category | brand.bg | brand.fg | brand.accent | url(store) | platform | status | landingUrl |
|---|---|---|---|---|---|---|---|---|---|---|
| pillog | Pillog | 💊 | 건강 | `#16130F` | `#F4EFE6` | `#F2542A` | `https://apps.apple.com/app/id6775165151` | ios | live | `/pillog/` |
| inneungeollo | 있는걸로 | 🍳 | 요리·AI | `#1A140F` | `#F7EFE2` | `#F97316` | `https://apps.apple.com/kr/app/id6784326939` | ios | live | `/inneungeollo/` |
| voicealarm | 모닝보이스 | 🎙️ | 알람 | `#14110E` | `#F7EFE2` | `#FF3B30` | `https://apps.apple.com/kr/app/id6781772401` | ios | live | `/voicealarm/` |
| couple-calendar | Couple Calendar | 📅 | 커플 | `#0F1A14` | `#F4F0E6` | `#5BBD8E` | `https://apps.apple.com/app/id6781283358` | ios | live | `/couple-calendar/` |
| doodleroom | 낙서방 | 🎨 | 드로잉 | `#14110E` | `#F7EFE2` | `#FBD24E` | `https://apps.apple.com/app/id6785241751` | ios | live | `/doodleroom/` |
| imap | 아이맵 | 🏥 | 육아·의료 | `#1A1813` | `#F4EBCE` | `#5EEAD4` | `https://apps.apple.com/app/id6779064016` | ios | live | `/imap/` |
| dailyignite | 하루불씨 | 🔥 | 동기부여 | `#1A140F` | `#F7EFE2` | `#D4A574` | `https://apps.apple.com/us/app/id6753808609` | ios | live | `/dailyignite/` |
| squishpop | 빠작말랑 | 🫧 | 캐주얼 | `#1A140F` | `#F7EFE2` | `#FF8A5B` | `` | ios | coming-soon | `/squishpop/` |

**태그라인(hero용):**
- pillog: 약 챙기는 가장 간단한 방법
- inneungeollo: 냉장고에 있는 걸로, 오늘 뭐 해먹지?
- voicealarm: 사랑하는 사람의 목소리로 여는 아침
- couple-calendar: 둘만의 기념일과 일정을 한 곳에
- doodleroom: 함께 낙서하고 그림 그리는 방
- imap: 야간·휴일 소아과·응급실·심야약국 실시간
- dailyignite: 매일 한 조각씩, 오늘의 불씨
- squishpop: 말랑말랑 터뜨리는 재미 (출시 예정)

> 기능 카피는 각 앱의 `public/<앱>/support.html`·`blog/` 내용에서 발췌해 2~4개 뽑는다. 확실치 않으면 태그라인 + 스토어 링크 위주로 미니멀하게.

---

## Task 1: houseads.json v2로 확장

**Files:**
- Modify: `public/houseads.json`

**Step 1: 기존 인앱 호환 필드 확인**

기존 `HouseAd` 컴포넌트는 `id/name/tagline/emoji/url/platform`을 읽고 `id === currentAppId`로 자기 제외한다. 이 6개 필드를 **모든 앱에 반드시 유지**한다. `url`은 스토어 링크(coming-soon은 빈 문자열).

**Step 2: 전체 카탈로그로 교체**

위 카탈로그 표 8개를 모두 넣는다. 각 엔트리 형태:

```jsonc
{
  "id": "pillog",
  "name": "Pillog",
  "tagline": "약 챙기는 가장 간단한 방법",
  "emoji": "💊",
  "category": "건강",
  "brand": { "bg": "#16130F", "fg": "#F4EFE6", "accent": "#F2542A" },
  "landingUrl": "/pillog/",
  "url": "https://apps.apple.com/app/id6775165151",
  "platform": "ios",
  "status": "live",
  "screenshots": [
    "/pillog/screenshots/01-home.png",
    "/pillog/screenshots/02-record-calendar.png",
    "/pillog/screenshots/03-record-timeline.png",
    "/pillog/screenshots/04-report.png",
    "/pillog/screenshots/05-med-detail.png"
  ]
}
```

스크린샷 있는 앱만 `screenshots` 채운다:
- inneungeollo: `01-home.png,02-confirm.png,03-recipes.png,04-detail.png,05-saved.png` (경로 `/inneungeollo/screenshots/...`)
- voicealarm: `1-onboarding.png,2-library.png,3-record.png,4-alarm.png` (경로 `/voicealarm/screenshots/...`)
- 나머지: `"screenshots": []`

`_comment`와 `updated`("2026-07-04")도 갱신한다.

**Step 3: JSON 유효성 + 인앱 필드 검증**

```bash
python3 -c "import json;d=json.load(open('public/houseads.json'));print('apps',len(d['apps']));\
print('인앱필드 누락:',[a['id'] for a in d['apps'] if not all(k in a for k in ('id','name','tagline','emoji','url','platform'))])"
```
Expected: `apps 8` / `인앱필드 누락: []`

**Step 4: Commit**

```bash
git add public/houseads.json
git commit -m "feat(houseads): 전체 8개 앱으로 카탈로그 확장 + 웹 필드(brand/landingUrl/status/screenshots)"
```

---

## Task 2: 공통 "다른 앱" 스트립 — `/_shared/other-apps.js`

**Files:**
- Create: `public/_shared/other-apps.js`

**Step 1: 스크립트 작성**

랜딩 페이지가 `<section id="other-apps" data-current="<id>"></section>` + `<script src="/_shared/other-apps.js" defer></script>`만 넣으면 자동 렌더된다. 스타일은 스크립트가 1회 주입.

```js
(function () {
  var STYLE = `
  #other-apps{max-width:960px;margin:0 auto;padding:56px 20px}
  #other-apps .oa-head{font-size:13px;letter-spacing:.14em;text-transform:uppercase;opacity:.6;margin-bottom:18px;text-align:center}
  #other-apps .oa-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:12px}
  #other-apps .oa-card{position:relative;display:flex;flex-direction:column;gap:6px;padding:16px;border-radius:14px;
    border:1px solid rgba(128,128,128,.25);text-decoration:none;color:inherit;background:rgba(128,128,128,.06);
    transition:border-color .15s,transform .15s}
  #other-apps .oa-card:hover{border-color:var(--oa-accent,#888);transform:translateY(-2px)}
  #other-apps .oa-emoji{font-size:26px}
  #other-apps .oa-name{font-weight:700;font-size:15px}
  #other-apps .oa-tag{font-size:12px;opacity:.6;line-height:1.4}
  #other-apps .oa-badge{position:absolute;top:12px;right:12px;font-size:9px;letter-spacing:.06em;text-transform:uppercase;
    padding:3px 6px;border-radius:6px;background:var(--oa-accent,#888);color:#111;font-weight:700}
  `;
  function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
  async function run(){
    var el=document.getElementById('other-apps');
    if(!el) return;
    var current=el.getAttribute('data-current')||'';
    try{
      var res=await fetch('/houseads.json',{cache:'no-cache'});
      var data=await res.json();
      var apps=(data.apps||[]).filter(function(a){return a.id!==current;});
      if(!apps.length){el.remove();return;}
      var st=document.createElement('style');st.textContent=STYLE;document.head.appendChild(st);
      el.innerHTML='<div class="oa-head">WooBottle의 다른 앱</div><div class="oa-grid">'+
        apps.map(function(a){
          var accent=(a.brand&&a.brand.accent)||'#888';
          return '<a class="oa-card" href="'+esc(a.landingUrl||'/apps/')+'" style="--oa-accent:'+esc(accent)+'">'+
            '<span class="oa-emoji">'+esc(a.emoji||'📱')+'</span>'+
            '<span class="oa-name">'+esc(a.name)+'</span>'+
            '<span class="oa-tag">'+esc(a.tagline)+'</span>'+
            (a.status==='coming-soon'?'<span class="oa-badge">Soon</span>':'')+
          '</a>';
        }).join('')+'</div>';
    }catch(e){el.remove();}
  }
  if(document.readyState!=='loading') run(); else document.addEventListener('DOMContentLoaded',run);
})();
```

**Step 2: 문법 검증**

```bash
node --check public/_shared/other-apps.js && echo OK
```
Expected: `OK`

**Step 3: Commit**

```bash
git add public/_shared/other-apps.js
git commit -m "feat: 공통 '다른 앱' 크로스링크 스트립 스크립트"
```

---

## Task 3: `/apps` 통합 허브 — `public/apps/index.html`

**Files:**
- Create: `public/apps/index.html`

**Step 1: 허브 페이지 작성**

WooBottle 다크 브랜드. `houseads.json` fetch → 앱 그리드. 상단 nav: 도구 사이트(`/`) ⇄ 앱 허브. 하단: 웹 도구 링크.

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>WooBottle 앱 — 작지만 확실한 앱들</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="description" content="WooBottle이 만든 iOS 앱 모음. 복약 알림, 목소리 알람, AI 요리추천, 커플 캘린더 등."/>
<link rel="canonical" href="https://woo-bottle.com/apps/"/>
<meta property="og:title" content="WooBottle 앱"/>
<meta property="og:description" content="작지만 확실한 앱들"/>
<meta property="og:type" content="website"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"/>
<style>
  :root{--bg:#0A0A0A;--fg:#fff;--muted:#A3A3A3;--line:#1A1A1A;--card:#0F0F0F}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);
    font-family:"Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif;letter-spacing:-.01em}
  a{color:inherit;text-decoration:none}
  header{position:sticky;top:0;z-index:10;background:var(--bg);border-bottom:1px solid var(--line)}
  header .in{max-width:1120px;margin:0 auto;padding:16px 20px;display:flex;align-items:center;justify-content:space-between}
  header .brand{display:flex;align-items:center;gap:10px;font-weight:700}
  header .logo{width:34px;height:34px;border:1px solid #fff;border-radius:10px}
  header nav a{font-size:14px;color:var(--muted);margin-left:20px}
  header nav a.active{color:#fff}
  .hero{max-width:1120px;margin:0 auto;padding:72px 20px 32px}
  .hero .eyebrow{font-size:12px;letter-spacing:.2em;text-transform:uppercase;color:#525252;margin-bottom:14px}
  .hero h1{font-size:clamp(34px,6vw,56px);font-weight:800;letter-spacing:-.03em;margin:0 0 14px;line-height:1.05}
  .hero p{color:var(--muted);font-size:17px;max-width:520px;margin:0}
  .grid{max-width:1120px;margin:0 auto;padding:16px 20px 40px;
    display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:14px}
  .card{position:relative;display:block;padding:22px;border-radius:16px;border:1px solid var(--line);
    background:var(--card);transition:border-color .15s,transform .15s}
  .card:hover{transform:translateY(-3px)}
  .card .emoji{font-size:32px;display:block;margin-bottom:14px}
  .card .name{font-size:19px;font-weight:700;margin-bottom:6px}
  .card .tag{font-size:13px;color:var(--muted);line-height:1.5;min-height:40px}
  .card .cat{font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:#525252;margin-top:12px}
  .card .badge{position:absolute;top:18px;right:18px;font-size:10px;letter-spacing:.05em;text-transform:uppercase;
    padding:4px 8px;border-radius:8px;font-weight:700}
  .foot{max-width:1120px;margin:0 auto;padding:24px 20px 72px;border-top:1px solid var(--line)}
  .foot a{color:var(--muted);font-size:14px}
  .foot a:hover{color:#fff}
  .skel{opacity:.5}
</style>
</head>
<body>
  <header><div class="in">
    <a class="brand" href="/"><span class="logo"></span>WooBottle</a>
    <nav><a href="/">도구</a><a href="/apps/" class="active">앱</a></nav>
  </div></header>

  <section class="hero">
    <div class="eyebrow">WooBottle Apps</div>
    <h1>작지만 확실한 앱들.</h1>
    <p>매일의 작은 불편을 덜어주는 iOS 앱을 만듭니다.</p>
  </section>

  <main id="grid" class="grid"><div class="skel">불러오는 중…</div></main>

  <footer class="foot">
    <a href="/">← 웹 도구도 있어요</a>
  </footer>

<script>
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
(async function(){
  var grid=document.getElementById('grid');
  try{
    var d=await (await fetch('/houseads.json',{cache:'no-cache'})).json();
    grid.innerHTML=(d.apps||[]).map(function(a){
      var accent=(a.brand&&a.brand.accent)||'#888';
      var soon=a.status==='coming-soon';
      var badge=soon?'<span class="badge" style="background:'+esc(accent)+';color:#111">Coming soon</span>':'';
      return '<a class="card" href="'+esc(a.landingUrl||'#')+'" style="border-color:'+esc(accent)+'33">'+
        badge+
        '<span class="emoji">'+esc(a.emoji||'📱')+'</span>'+
        '<div class="name">'+esc(a.name)+'</div>'+
        '<div class="tag">'+esc(a.tagline)+'</div>'+
        '<div class="cat" style="color:'+esc(accent)+'">'+esc(a.category||'')+'</div>'+
      '</a>';
    }).join('');
  }catch(e){grid.innerHTML='<p style="color:#A3A3A3">앱 목록을 불러오지 못했습니다.</p>';}
})();
</script>
</body>
</html>
```

**Step 2: 검증**

```bash
python3 -m http.server 4599 -d public >/dev/null 2>&1 &
sleep 1
curl -s http://localhost:4599/apps/ | grep -q 'WooBottle Apps' && echo "hero OK"
curl -s http://localhost:4599/houseads.json | python3 -c "import json,sys;print('grid feeds', len(json.load(sys.stdin)['apps']),'apps')"
kill %1 2>/dev/null
```
그리고 브라우저(claude-in-chrome)로 `http://localhost:4599/apps/` 열어 그리드 8개 카드·coming-soon 뱃지·hover 확인.
Expected: hero OK / grid feeds 8 apps / 카드 8개 렌더.

**Step 3: Commit**

```bash
git add public/apps/index.html
git commit -m "feat(apps): 통합 앱 허브 페이지"
```

---

## Task 4: 앱 랜딩 템플릿 확정 + pillog 적용 (스크린샷 있는 앱 기준)

**Files:**
- Modify: `public/pillog/index.html` (기존 플레이스홀더 교체)

**Step 1: 랜딩 템플릿 작성 (pillog)**

이 파일이 **스크린샷 있는 앱(pillog/inneungeollo/voicealarm)의 템플릿**이 된다. 앱별로 바뀌는 부분: `<title>`/메타, CSS 변수(`--bg/--fg/--accent`), eyebrow(카테고리), 앱명, 태그라인, 스토어 링크, 스크린샷 목록, 기능 카드, 푸터 링크, `data-current`.

```html
<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8"/>
<title>Pillog — 약 챙기는 가장 간단한 방법</title>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="description" content="잠금화면 알림에서 바로 '먹었어요' 한 번. 복용 기간·캘린더 히트맵·월간 리포트까지, 약 챙기기가 습관이 되는 복약 관리 앱 Pillog."/>
<link rel="canonical" href="https://woo-bottle.com/pillog/"/>
<meta property="og:type" content="website"/>
<meta property="og:title" content="Pillog — 약 챙기는 가장 간단한 방법"/>
<meta property="og:description" content="약 챙기는 가장 간단한 방법. 알림에서 바로 체크, 회원가입 없이 폰에만 저장."/>
<meta property="og:url" content="https://woo-bottle.com/pillog/"/>
<meta property="og:image" content="https://woo-bottle.com/pillog/og-image.png"/>
<meta property="og:site_name" content="Pillog"/>
<meta name="twitter:card" content="summary_large_image"/>
<meta name="twitter:image" content="https://woo-bottle.com/pillog/og-image.png"/>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"/>
<style>
  :root{--bg:#16130F;--fg:#F4EFE6;--accent:#F2542A;--muted:rgba(244,239,230,.62)}
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--fg);
    font-family:"Pretendard Variable",Pretendard,-apple-system,system-ui,sans-serif;letter-spacing:-.01em}
  a{color:inherit;text-decoration:none}
  .nav{max-width:1000px;margin:0 auto;padding:18px 20px;display:flex;align-items:center;justify-content:space-between;font-size:14px}
  .nav .back{color:var(--muted)}
  .nav .back:hover{color:var(--fg)}
  .nav .app{font-weight:700}
  .hero{max-width:1000px;margin:0 auto;padding:56px 20px 32px;text-align:center}
  .hero .eyebrow{font-size:12px;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);margin-bottom:16px}
  .hero h1{font-size:clamp(40px,8vw,72px);font-weight:800;letter-spacing:-.04em;margin:0 0 14px}
  .hero p{color:var(--muted);font-size:18px;max-width:520px;margin:0 auto 30px;line-height:1.5}
  .cta{display:inline-flex;gap:12px;flex-wrap:wrap;justify-content:center}
  .btn{display:inline-flex;align-items:center;gap:8px;padding:14px 22px;border-radius:12px;font-weight:700;font-size:15px}
  .btn.primary{background:var(--accent);color:#111}
  .btn.primary:hover{opacity:.9}
  .btn.ghost{border:1px solid rgba(128,128,128,.4);color:var(--fg)}
  .btn.ghost:hover{border-color:var(--fg)}
  .shots{max-width:1100px;margin:8px auto 0;padding:24px 20px;display:flex;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory}
  .shots img{height:520px;border-radius:24px;scroll-snap-align:center;box-shadow:0 20px 60px rgba(0,0,0,.4)}
  .features{max-width:900px;margin:0 auto;padding:40px 20px;display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}
  .feat{padding:22px;border-radius:16px;border:1px solid rgba(128,128,128,.22);background:rgba(128,128,128,.05)}
  .feat h3{margin:0 0 8px;font-size:17px}
  .feat p{margin:0;color:var(--muted);font-size:14px;line-height:1.55}
  #other-apps{border-top:1px solid rgba(128,128,128,.18)}
  .foot{max-width:1000px;margin:0 auto;padding:28px 20px 72px;text-align:center;
    display:flex;gap:20px;flex-wrap:wrap;justify-content:center;font-size:13px;color:var(--muted);
    border-top:1px solid rgba(128,128,128,.18)}
  .foot a:hover{color:var(--fg)}
  @media(max-width:600px){.shots img{height:420px}}
</style>
</head>
<body>
  <div class="nav">
    <a class="back" href="/apps/">← WooBottle</a>
    <span class="app">Pillog</span>
  </div>

  <section class="hero">
    <div class="eyebrow">복약 알림 · 기록</div>
    <h1>Pillog</h1>
    <p>약 챙기는 가장 간단한 방법. 알림에서 바로 체크, 회원가입 없이 폰에만 저장.</p>
    <div class="cta">
      <a class="btn primary" href="https://apps.apple.com/app/id6775165151?ct=web_landing">App Store에서 받기</a>
      <a class="btn ghost" href="./support.html">소개 · 지원</a>
    </div>
  </section>

  <div class="shots">
    <img src="./screenshots/01-home.png" alt="Pillog 홈"/>
    <img src="./screenshots/02-record-calendar.png" alt="캘린더 히트맵"/>
    <img src="./screenshots/03-record-timeline.png" alt="복약 타임라인"/>
    <img src="./screenshots/04-report.png" alt="월간 리포트"/>
    <img src="./screenshots/05-med-detail.png" alt="약 상세"/>
  </div>

  <section class="features">
    <div class="feat"><h3>알림에서 바로 체크</h3><p>잠금화면 알림에서 '먹었어요' 한 번이면 끝. 앱을 열 필요도 없어요.</p></div>
    <div class="feat"><h3>캘린더 히트맵</h3><p>복용 기록이 한눈에. 빠뜨린 날이 색으로 보여 습관이 잡혀요.</p></div>
    <div class="feat"><h3>월간 리포트</h3><p>이번 달 얼마나 잘 챙겼는지 리포트로 정리해 드려요.</p></div>
    <div class="feat"><h3>회원가입 없이</h3><p>모든 기록은 내 폰에만. 계정도, 서버 전송도 없습니다.</p></div>
  </section>

  <section id="other-apps" data-current="pillog"></section>

  <footer class="foot">
    <a href="/apps/">앱 전체</a>
    <a href="./privacy.html">개인정보</a>
    <a href="./terms.html">약관</a>
    <a href="./support.html">지원</a>
    <a href="./blog/">블로그</a>
    <span>© WooBottle</span>
  </footer>

  <script src="/_shared/other-apps.js" defer></script>
</body>
</html>
```

**Step 2: 검증**

```bash
python3 -m http.server 4599 -d public >/dev/null 2>&1 &
sleep 1
curl -s http://localhost:4599/pillog/ | grep -q 'id="other-apps"' && echo "strip mount OK"
curl -s http://localhost:4599/pillog/ | grep -c 'screenshots/' # 5 기대
kill %1 2>/dev/null
```
브라우저로 `http://localhost:4599/pillog/` 열어: 히어로·스크린샷 가로스크롤·기능4·"다른 앱" 스트립에 7개 카드·푸터 링크 확인. 스트립 카드 클릭 시 형제 랜딩으로 이동하는지 1개 확인.
Expected: strip mount OK / 5 / 스트립 7개.

**Step 3: Commit**

```bash
git add public/pillog/index.html
git commit -m "feat(pillog): 정식 랜딩 페이지 (스샷 갤러리+기능+크로스링크)"
```

---

## Task 5: 스크린샷 있는 나머지 랜딩 — inneungeollo, voicealarm

**Files:**
- Create/Modify: `public/inneungeollo/index.html`, `public/voicealarm/index.html`

**Step 1:** Task 4 템플릿을 복제해 각 앱값으로 치환:
- CSS 변수 `--bg/--fg/--accent` = 카탈로그 brand
- `<title>`/메타/canonical(`/inneungeollo/`,`/voicealarm/`)
- nav `.app`, hero eyebrow(카테고리), 앱명, 태그라인
- 스토어 링크(카탈로그 url + `?ct=web_landing`)
- `.shots img` = 해당 앱 screenshots (inneungeollo 5장, voicealarm 4장)
- 기능 카드: 각 앱 `support.html`/`blog`에서 2~4개 발췌
  - inneungeollo: "사진 한 장으로 재료 인식", "지금 만들 수 있는 요리 추천", "재료 입력·검색 불필요", "레시피 저장"
  - voicealarm: "진짜 그 목소리로 알람", "엄마·연인·아이 목소리 녹음", "원하는 시간 반복 알람", "녹음은 기기에만 저장"
- `#other-apps data-current` = 앱 id
- 푸터: 두 앱 모두 privacy/terms/support/blog 존재 → 전부 링크

**Step 2: 검증** — 각 페이지 curl로 `other-apps` 마운트 + 스샷 수 확인, 브라우저로 1회씩 육안 확인.

**Step 3: Commit**

```bash
git add public/inneungeollo/index.html public/voicealarm/index.html
git commit -m "feat(inneungeollo,voicealarm): 정식 랜딩 페이지"
```

---

## Task 6: 스크린샷 없는 랜딩 (lean 변형) — couple-calendar, doodleroom, imap, dailyignite

**Files:**
- Create: `public/couple-calendar/index.html`, `public/doodleroom/index.html`, `public/imap/index.html`, `public/dailyignite/index.html`

**Step 1:** Task 4 템플릿에서 **`.shots` 블록 제거**(스샷 없음), 나머지 동일하게 앱값 치환. 기능 카드는 각 앱 support/blog에서 발췌.
- 푸터 링크는 **존재하는 페이지만**:
  - couple-calendar: privacy/terms/support/blog
  - doodleroom: privacy/terms/support/blog (+ join.html 있으면 "참여")
  - imap: **blog만** (privacy/terms/support 없음) → 푸터에 blog + 앱전체만
  - dailyignite: privacy/terms/support (blog 없음)
- 스토어 링크: 각 카탈로그 url + `?ct=web_landing`

**Step 2: 검증** — 각 curl `other-apps` 마운트 확인 + 브라우저 육안 1회씩.

**Step 3: Commit**

```bash
git add public/couple-calendar/index.html public/doodleroom/index.html public/imap/index.html public/dailyignite/index.html
git commit -m "feat: couple-calendar·doodleroom·imap·dailyignite 랜딩 페이지"
```

---

## Task 7: coming-soon 랜딩 — squishpop

**Files:**
- Create: `public/squishpop/index.html`

**Step 1:** Task 6 lean 변형 기반. 차이:
- 스토어 버튼(`.btn.primary`) **제거**, 대신 `<span class="btn ghost">Coming soon</span>` 또는 뱃지.
- hero 태그라인에 "출시 예정" 뉘앙스.
- 푸터: privacy/terms/support (blog 없음) + 앱전체.
- `#other-apps data-current="squishpop"`.

**Step 2: 검증** — 스토어 링크가 없고 coming-soon 표기 확인, 브라우저 육안.

**Step 3: Commit**

```bash
git add public/squishpop/index.html
git commit -m "feat(squishpop): coming-soon 랜딩 페이지"
```

---

## Task 8: 루트 도구 사이트 ↔ 앱 허브 연결

**Files:**
- Modify: `src/widgets/landing-layout/ui/landing-layout.tsx`

**Step 1:** 헤더 우측에 앱 허브 링크 추가. `/apps`는 정적 페이지라 `next/link` 대신 `<a>` 사용(trailingSlash 맞춰 `/apps/`).

`<Link href="/" ...>` 브랜드 블록 오른쪽, `</div>` 닫히기 전에 nav 추가:

```tsx
          <nav className="flex items-center gap-5 text-sm text-[#A3A3A3]">
            <Link href="/" className="hover:text-white transition-colors">도구</Link>
            <a href="/apps/" className="hover:text-white transition-colors">앱</a>
          </nav>
```

(헤더 컨테이너의 `justify-between`이 브랜드와 nav를 양끝 배치.)

**Step 2: 빌드/렌더 확인**

```bash
pnpm build 2>&1 | tail -5
```
Expected: 빌드 성공(에러 없음). `out/apps/` 로는 export되지 않지만(public/apps는 그대로 out/으로 복사됨) — `ls out/apps/index.html` 존재 확인.

```bash
ls out/apps/index.html out/houseads.json out/_shared/other-apps.js 2>&1
```
Expected: 3개 경로 모두 존재.

**Step 3: Commit**

```bash
git add src/widgets/landing-layout/ui/landing-layout.tsx
git commit -m "feat(landing): 헤더에 앱 허브(/apps) 링크 추가"
```

---

## Task 9: 통합 검증 (전체 상호링크 워크스루)

**Files:** (없음 — 검증만)

**Step 1:** `pnpm build` 후 `python3 -m http.server 4599 -d out` 로 실제 export 산출물을 서빙.

**Step 2: 브라우저 워크스루** (claude-in-chrome)
1. `/apps/` → 카드 8개, squishpop coming-soon 뱃지
2. `/apps/` 카드 클릭 → 해당 `/<앱>/` 랜딩 이동
3. 각 랜딩 하단 "다른 앱" 스트립 7개 → 클릭 시 형제 랜딩 이동
4. 랜딩 nav "← WooBottle" → `/apps/` 복귀
5. 루트 `/` 헤더 "앱" → `/apps/` 이동
6. squishpop 랜딩 → 스토어 버튼 없음 확인

**Step 3:** 깨진 링크/누락 스샷 있으면 해당 태스크로 돌아가 수정 후 재검증.

**Step 4: 최종 커밋(있으면)**

```bash
git add -A && git commit -m "fix: 앱 허브 상호링크 검증 후 보정" || echo "보정 없음"
```

---

## 완료 기준 (Definition of Done)

- [ ] `houseads.json` 8개 앱, 인앱 필드 유지, JSON 유효
- [ ] `/apps/` 허브: 8카드 + coming-soon 뱃지 + 도구/앱 nav
- [ ] 8개 `public/<앱>/index.html` 랜딩 (스샷3 rich / 나머지 lean / squishpop coming-soon)
- [ ] 모든 랜딩 하단 "다른 앱" 스트립 동작(자기 제외 7개)
- [ ] 루트 헤더에 `/apps/` 링크
- [ ] `pnpm build` 성공 + `out/`에 apps·houseads·_shared 존재
- [ ] 브라우저 상호링크 워크스루 통과
