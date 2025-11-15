NURI 글로벌 비즈니스 TRD (기술 요구 사양서)

문서 버전: 1.0
작성일: 2025-11-10
기준 PRD: nuri_prd.md (v1.0)
작성자: (기술 리드/PM)

1. 개요 (Introduction)

1.1. 문서 목적

본 문서는 nuri_prd.md에 명시된 NURI 글로벌 비즈니스 웹사이트, 특히 '인터랙티브 글로벌 대시보드'의 기술적 구현 사양을 정의합니다. 개발팀이 아키텍처, 기술 스택, 데이터 모델, API 등을 명확히 인지하고 개발을 수행할 수 있도록 하는 것을 목표로 합니다.

1.2. 범위

In Scope (범위 내):

'인터랙티브 3D 지구본' 시각화 기능

타겟 시장 및 구현 사업장 데이터 연동

국가별 데이터(GDP, 인구) 툴팁 표시

다국어(영/한) 지원 기술 명세

Out of Scope (범위 외):

실제 스마트팜(NURI Farm) IoT/AI 인프라 세부 설계

CMS(콘텐츠 관리 시스템) 상세 설계

2. 시스템 아키텍처 (System Architecture)

NURI 웹사이트는 최신 웹 기술을 활용하여 안정적이고 확장 가능한 구조로 설계합니다.

Frontend (프론트엔드): Vercel 또는 Netlify를 통해 배포되는 정적 사이트(SSG/ISR) 또는 SPA.

Backend (백엔드): API 서버 (데이터 제공).

Database (데이터베이스): PostGIS가 활성화된 PostgreSQL (국가, 사업장, GIS 데이터 관리).

[간단한 웹 애플리케이션 아키텍처(프론트엔드, 백엔드, 데이터베이스) 이미지]

3. 핵심 기술 스택 (Technology Stack)

구분

기술

사유

Frontend

Next.js (React)

SSR/SSG 지원으로 초기 로딩 속도 및 SEO 최적화.



TypeScript

코드 안정성 및 유지보수성 확보.



Three.js

WebGL 기반의 3D 지구본 시각화 핵심 라이브러리.



D3.js / TopoJSON

GeoJSON/TopoJSON 데이터 파싱 및 맵 프로젝션(투영) 처리.



Tailwind CSS

반응형 디자인 및 일관된 UI/UX 신속 구현.



React-i18next

다국어(영/한) 지원 및 언어 전환 관리.

Backend

FastAPI (Python)

높은 성능, Python 생태계(GIS 라이브러리) 활용 용이. (대안: Nest.js)

Database

PostgreSQL (w/ PostGIS)

표준 SQL 및 강력한 GIS(위치/좌표/지형) 데이터 처리 지원.

Deployment

Vercel (Frontend), AWS/GCP (Backend/DB)



4. 기능별 기술 명세 (Feature Technical Specs)

4.1. [Feature 1] 인터랙티브 3D 지구본

Component: GlobeView.tsx

Library: Three.js

Renderer: WebGLRenderer (Antialias 활성화)

Scene:

AmbientLight (전역 조명), DirectionalLight (태양광 역할) 추가.

SphereGeometry를 사용하여 해양(기본 구체) 메쉬 생성.

Controls:

OrbitControls (또는 유사 구현)을 통해 마우스 드래그 앤 드롭으로 지구본 회전.

requestAnimationFrame 루프 내에서 globe.rotation.y += 0.001 (값은 조정 가능)을 추가하여 자동 회전 구현. (드래그 시 자동 회전 일시 중지)

4.2. [Feature 2] 타겟 시장 시각화

Data: 프론트엔드에 world-110m.json (TopoJSON) 파일 번들링.

Logic:

topojson.feature를 사용해 TopoJSON을 GeoJSON features로 변환.

d3.geoOrthographic (직교 투영) 및 d3.geoPath를 사용해 GeoJSON 좌표를 2D Path로 변환.

2D Path 데이터를 Three.js의 Shape 또는 BufferGeometry로 변환하여 국가별 메쉬(Mesh) 생성.

Coloring (Data-driven):

GET /api/markets API로 국가별 Tier 데이터(JSON) 로드.

국가 메쉬 생성 시, API 데이터를 참조하여 Tier별 HSL(색상, 채도, 명도) 값 적용.

baseHue = 130 (Green 계열)

Tier 1: material.color.setHSL(baseHue/360, 1.0, 0.5) (채도 100%)

Tier 2: material.color.setHSL(baseHue/360, 0.8, 0.5) (채도 80%)

Tier 3: material.color.setHSL(baseHue/360, 0.6, 0.5) (채도 60%)

Default: 0x222222 (기본 대륙 색상)

생성된 메쉬의 userData 객체에 국가 정보(이름, Tier, GDP 등) 저장.

4.3. [Feature 3] 구현 사업장 마커

Component: THREE.Sprite (항상 카메라를 바라보는 2D 객체)

Data: GET /api/sites API로 사업장 목록(이름, 위도, 경도) 로드.

Logic (Lat/Lon to 3D):

위도(lat), 경도(lon)를 3D 구체 좌표(x, y, z)로 변환하는 유틸리티 함수 사용.

function getCoordinatesFromLatLng(lat, lon, radius) {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 90) * (Math.PI / 180); // (프로젝션에 따라 +90 또는 +180 조정)

    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.sin(theta);
    return new THREE.Vector3(x, y, z);
}


radius 값은 지구본 반경(예: 2)보다 약간 큰 값 (예: 2.02)을 주어 표면에 떠 있게 함.

Effect (Pulse):

THREE.CanvasTexture를 사용하여 방사형 그라데이션(Radial Gradient) 텍스처 생성.

requestAnimationFrame 루프 내에서 Math.sin(time)을 이용해 Sprite.scale을 주기적으로 변경하여 펄스 효과 구현.

SpriteMaterial의 blending 속성을 THREE.AdditiveBlending으로 설정하여 밝게 빛나는 효과 연출.

4.4. [Feature 4] 국가 데이터 툴팁

Logic: THREE.Raycaster 사용.

onMouseMove 이벤트 리스너에서 마우스 좌표를 2D 정규화 좌표(-1 ~ +1)로 변환.

raycaster.setFromCamera(mouse, camera)로 광선 설정.

raycaster.intersectObjects(globe.children, true)로 교차 객체 탐색.

교차된 객체(국가 메쉬 또는 사이트 스프라이트)의 userData에 저장된 정보를 조회.

UI:

React State (예: useState)를 사용하여 툴팁 정보(내용, 위치, 표시 여부) 관리.

position: absolute 속성을 가진 별도 <div> 컴포넌트(Tooltip.tsx)를 렌더링.

마우스 위치(event.clientX, event.clientY)에 따라 style.left, style.top 업데이트.

4.5. [Feature 5] 다국어 지원

Library: react-i18next

Data Structure: /public/locales/[lang]/common.json 경로에 언어별 JSON 파일 관리.

en/common.json: {"heroTitle": "NURI Global", "countryName_KOR": "South Korea", ...}

ko/common.json: {"heroTitle": "누리 글로벌", "countryName_KOR": "대한민국", ...}

Implementation:

i18n.js 설정 파일 초기화.

언어 전환 버튼(Toggle) 구현 (e.g., i18n.changeLanguage('ko')).

API 호출(GET /api/markets, GET /api/sites) 시 ?lang=ko 쿼리 파라미터를 동적으로 추가하여, 백엔드로부터 번역된 데이터를 수신.

useTranslation 훅을 사용하여 컴포넌트 내 정적 텍스트 변환.

5. 데이터 모델 (Database Schema)

countries (국가 정보. PostGIS geom 필드 포함)

id (PK), name_en (varchar), name_ko (varchar), iso_a3 (char(3)), gdp_usd_b (numeric), population (bigint), geom (geometry, MultiPolygon)

market_tiers (NURI 타겟 시장)

id (PK), country_id (FK to countries.id), tier (int, 1-3)

sites (NURI Farm 사업장)

id (PK), name_en (varchar), name_ko (varchar), country_id (FK to countries.id), location (geometry, Point - POINT(lon lat))

6. API 명세 (API Specification)

Base URL: /api

6.1. GET /markets

설명: 1~3차 타겟 시장 국가 목록 및 핵심 데이터를 반환.

Query Params: lang (string, 'en' or 'ko', default: 'en')

Response (200 OK):

[
    {
        "name": "대한민국 (1차 - 구현)", // 'lang' 쿼리에 따라 동적 반환
        "iso_a3": "KOR",
        "tier": 1,
        "gdp_usd_b": 1720,
        "population": 51700000
    },
    {
        "name": "Mexico (2nd)",
        "iso_a3": "MEX",
        "tier": 2,
        "gdp_usd_b": 1360,
        "population": 126000000
    }
    // ... (Spain, Australia, Canada, Brazil, Italy 등)
]


6.2. GET /sites

설명: 구현된 NURI Farm 사업장 위치 목록 반환.

Query Params: lang (string, 'en' or 'ko', default: 'en')

Response (200 OK):

[
    {
        "name": "NURI Farm #1 (Goesan, S. Korea)", // 'lang' 쿼리에 따라 동적 반환
        "lat": 36.81,
        "lon": 127.79
    }
]


7. 비기능적 요구사항 (Non-Functional Reqs.)

성능 (Performance): 3D 지구본 인터랙션(회전, 호버)은 60 FPS 유지를 목표로 함. 초기 페이지 로드(LCP) 3초 이내.

보안 (Security): 모든 API 통신은 HTTPS를 사용. XSS, CSRF 등 기본 웹 취약점 방어.

접근성 (Accessibility): 3D 시각화가 어려운 사용자를 위해, 시각화 하단에 텍스트 기반(테이블)의 타겟 시장/사업장 목록을 제공. (WCAG 2.1 AA 준수 목표)

반응형 (Responsive): 3D 지구본 캔버스는 부모 컨테이너 크기에 맞춰 동적으로 리사이즈되어야 함. (모바일/태블릿/데스크탑)