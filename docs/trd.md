# NURI 프로젝트 기술 요구사항 명세서 (TRD)

## 1. 시스템 아키텍처

본 프로젝트는 Next.js 프론트엔드가 Supabase의 BaaS(Backend as a Service)와 직접 통신하는 모던 2계층 아키텍처(2-Tier Architecture)를 따릅니다. 별도의 백엔드 API 서버 없이, Supabase가 제공하는 데이터베이스, 인증, 자동 생성 API를 활용합니다.

*   **프레젠테이션 계층 (Presentation Layer)**: Next.js와 Three.js를 사용하여 사용자 인터페이스와 3D 시각화를 담당합니다. 모든 비즈니스 로직과 데이터 호출은 프론트엔드 내에서 처리됩니다.
*   **백엔드 계층 (Backend Layer)**: Supabase가 이 역할을 수행합니다.
    *   **데이터베이스**: PostgreSQL 기반의 데이터베이스. PostGIS 확장을 활성화하여 지리 공간 데이터를 처리합니다.
    *   **인증**: Supabase Auth를 통해 사용자 관리 및 인증을 처리합니다. (향후 확장 시 사용)
    *   **API**: Supabase 클라이언트 라이브러리를 통해 데이터베이스와 직접 통신합니다. 복잡한 쿼리는 Supabase Edge Function 또는 데이터베이스 함수(RPC)를 통해 처리할 수 있습니다.

## 2. 기술 스택

| 구분 | 기술 | 버전/비고 |
| --- | --- | --- |
| **Frontend** | Next.js (React) | 16+ |
| | TypeScript | 5+ |
| | Three.js | 3D 지구본 렌더링 |
| | D3.js / TopoJSON | 지리 데이터 처리 |
| | Tailwind CSS | UI 스타일링 |
| | shadcn/ui | UI 컴포넌트 라이브러리 |
| | Zustand | 클라이언트 상태 관리 |
| **Backend** | Supabase | 데이터베이스, 인증, API 제공 |
| | PostgreSQL | Supabase에 포함된 데이터베이스 |
| | PostGIS | Supabase DB 내에서 활성화 필요 |
| **Deployment** | Vercel | 프론트엔드 및 서버리스 환경 배포 |

## 3. API 명세

별도의 RESTful API 서버 대신, Supabase JS 클라이언트 라이브러리를 사용하여 프론트엔드에서 직접 데이터를 조회합니다.

### 3.1. 시장 데이터 조회
- **설명**: 모든 국가의 시장 등급 및 관련 데이터를 조회합니다.
- **Supabase 클라이언트 사용 예시**:
  ```typescript
  import { supabase } from './lib/supabaseClient';

  async function getMarkets(lang: 'ko' | 'en') {
    const countryNameCol = lang === 'ko' ? 'country_name_ko' : 'country_name_en';

    const { data, error } = await supabase
      .from('countries')
      .select(`
        country_code,
        country_name: ${countryNameCol},
        gdp,
        population,
        market_tiers ( tier )
      `);
    
    // market_tiers는 중첩된 객체이므로 평탄화 작업이 필요할 수 있음
    return data;
  }
  ```

### 3.2. 스마트팜 위치 조회
- **설명**: 운영 중인 NURI 스마트팜의 위치 목록을 조회합니다.
- **Supabase 클라이언트 사용 예시**:
  ```typescript
  import { supabase } from './lib/supabaseClient';

  async function getSites() {
    const { data, error } = await supabase
      .from('sites')
      .select('site_id, site_name, location');
      
    // location(Point) 데이터는 후처리가 필요할 수 있음
    return data;
  }
  ```

## 4. 데이터베이스 스키마

데이터베이스 스키마는 이전과 동일하게 유지되나, Supabase 대시보드를 통해 테이블을 생성하고 관리합니다.

### 4.1. `countries` 테이블
- **설명**: 국가별 지리 정보 및 기본 데이터를 저장합니다.
- **컬럼**:
  - `id` (SERIAL, PK): 기본 키
  - `country_code` (VARCHAR(3), UNIQUE): 국가 ISO 3166-1 alpha-3 코드
  - `country_name_en` (VARCHAR(255)): 영문 국가명
  - `country_name_ko` (VARCHAR(255)): 한글 국가명
  - `geom` (GEOMETRY, MultiPolygon): 국가 경계 지리 공간 데이터
  - `gdp` (NUMERIC): 국내 총생산 (조 달러 단위)
  - `population` (INTEGER): 인구 (백만 명 단위)

### 4.2. `market_tiers` 테이블
- **설명**: 국가와 시장 등급을 매핑합니다.
- **컬럼**:
  - `id` (SERIAL, PK): 기본 키
  - `country_code` (VARCHAR(3), FK to countries.country_code): 국가 코드
  - `tier` (INTEGER): 시장 등급 (1, 2, 3)

### 4.3. `sites` 테이블
- **설명**: NURI 스마트팜의 위치 정보를 저장합니다.
- **컬럼**:
  - `id` (SERIAL, PK): 기본 키
  - `site_id` (VARCHAR(10), UNIQUE): 사이트 고유 ID (예: K1)
  - `site_name` (VARCHAR(255)): 사이트 이름
  - `location` (GEOMETRY, Point): 위도, 경도 좌표

## 5. 개발 및 배포 환경

### 5.1. 개발 명령어
- **Frontend (Next.js)**
  ```bash
  npm install
  npm run dev
  npm run build
  npm run lint
  ```

### 5.2. 환경 설정
- 프로젝트 루트에 `.env.local` 파일을 생성하고 Supabase 프로젝트 URL과 Anon Key를 설정해야 합니다.
  ```
  NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
  NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
  ```

### 5.3. 데이터베이스 초기 설정
- Supabase 대시보드에서 SQL 편집기를 사용하여 PostGIS 확장을 활성화합니다.
  ```sql
  CREATE EXTENSION postgis;
  ```
- 초기 데이터(국가 경계, GDP 등)는 Supabase 대시보드에서 CSV 파일을 직접 임포트하거나, 클라이언트 스크립트를 통해 일괄 삽입합니다.

