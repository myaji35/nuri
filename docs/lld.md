# NURI 프로젝트 저수준 설계 명세서 (LLD)

## 1. 프론트엔드 (Next.js)

### 1.1. 컴포넌트 구조

```
src/
├── components/
│   ├── globe/
│   │   ├── Globe.tsx             # Three.js 씬, 카메라, 렌더러 설정
│   │   ├── Sphere.tsx            # 지구본 메쉬 및 텍스처
│   │   ├── Country.tsx           # 각 국가별 메쉬 및 상호작용
│   │   └── SiteMarker.tsx        # 스마트팜 위치 마커 (Sprite)
│   ├── ui/
│   │   ├── Tooltip.tsx           # 국가 정보 툴팁
│   │   ├── LanguageSwitcher.tsx  # 언어 변경 버튼
│   │   └── LoadingSpinner.tsx    # 데이터 로딩 스피너
│   └── layout/
│       └── MainLayout.tsx        # 기본 페이지 레이아웃
└── pages/
    └── index.tsx                 # 메인 페이지, Globe 컴포넌트 렌더링
```

### 1.2. 상태 관리
- **데이터 Fetching**: `SWR` 또는 `React Query`를 사용하여 Supabase로부터 시장(`markets`) 및 사이트(`sites`) 데이터를 비동기적으로 가져오고 캐싱합니다.
- **UI 상태**: `Zustand`를 사용하여 글로벌 UI 상태(예: 현재 선택된 언어, 로딩 상태, 3D 인터랙션 상태)를 중앙에서 관리합니다.

### 1.3. 3D 지구본 구현 로직 (`Globe.tsx`)
1.  **Scene 초기화**: `useEffect` 훅에서 Three.js의 `Scene`, `PerspectiveCamera`, `WebGLRenderer`를 초기화하고 캔버스에 마운트합니다.
2.  **지구본 생성**: `Sphere` 컴포넌트는 `SphereGeometry`와 `MeshStandardMaterial`을 사용하여 지구본을 생성합니다. 텍스처는 TopoJSON 데이터를 기반으로 D3.js를 사용하여 캔버스에 그린 후 `CanvasTexture`로 적용합니다.
3.  **국가 및 마커 렌더링**:
    - Supabase 클라이언트를 통해 조회한 `markets` 데이터로 각 국가의 `Country` 컴포넌트를 생성합니다.
    - `sites` 데이터로 각 `SiteMarker` 컴포넌트를 생성합니다. 위도/경도 좌표는 구면 좌표계 변환 공식을 사용하여 3D 좌표로 변환합니다.
4.  **애니메이션 루프**: `requestAnimationFrame`을 사용하여 렌더링 루프를 생성합니다. 이 루프 내에서 지구본 자동 회전 및 마커의 Pulsing 효과를 업데이트합니다.
5.  **상호작용 (Raycasting)**:
    - `Raycaster`를 사용하여 마우스 위치에 따른 객체 감지를 구현합니다.
    - 국가 메쉬에 마우스가 호버되면 해당 국가의 색상을 변경하고, `Tooltip` 컴포넌트에 관련 데이터를 전달하여 표시합니다.
    - 마우스 클릭/드래그 이벤트를 `OrbitControls`에 연결하여 사용자가 지구본을 조작할 수 있게 합니다.

## 2. 백엔드 (Supabase)

### 2.1. Supabase 클라이언트 설정
- Next.js 프로젝트 내에 Supabase 클라이언트를 초기화하는 모듈을 생성합니다.
- `lib/supabaseClient.ts`
  ```typescript
  import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  ```
- 환경 변수 (`.env.local`)에 Supabase URL과 Anon Key를 저장합니다.

### 2.2. 데이터 조회 로직
- **단순 조회**: `select`를 사용하여 테이블 데이터를 직접 조회합니다.
  ```typescript
  // markets 데이터 조회
  const { data: markets, error } = await supabase
    .from('countries')
    .select(`
      country_code, country_name_en, country_name_ko, gdp, population,
      market_tiers ( tier )
    `);
  ```
- **지리 공간 데이터 조회 (RPC)**: PostGIS 함수를 사용해야 하는 복잡한 쿼리(예: 거리 계산, 공간 포함 관계 확인)는 데이터베이스 함수를 만들고 RPC(Remote Procedure Call)로 호출합니다.
  1.  **Supabase SQL 편집기에서 함수 생성**:
      ```sql
      CREATE OR REPLACE FUNCTION get_sites_with_location()
      RETURNS TABLE(site_id text, site_name text, latitude float, longitude float) AS $$
      BEGIN
        RETURN QUERY
        SELECT
          s.site_id,
          s.site_name,
          ST_Y(s.location::geometry) as latitude,
          ST_X(s.location::geometry) as longitude
        FROM
          sites s;
      END;
      $$ LANGUAGE plpgsql;
      ```
  2.  **Next.js에서 RPC로 함수 호출**:
      ```typescript
      // 사이트 위치 정보 조회
      const { data: sites, error } = await supabase.rpc('get_sites_with_location');
      ```

### 2.3. 데이터베이스 보안
- **Row Level Security (RLS)**: 모든 테이블에 대해 RLS 정책을 활성화하여, 익명 사용자(anon key)는 읽기 전용(`SELECT`) 권한만 갖도록 설정합니다.
- **정책 예시 (`countries` 테이블)**:
  ```sql
  -- countries 테이블에 RLS 활성화
  ALTER TABLE countries ENABLE ROW LEVEL SECURITY;

  -- 익명 사용자가 모든 국가 정보를 읽을 수 있도록 허용하는 정책 생성
  CREATE POLICY "Allow public read access"
  ON countries
  FOR SELECT
  USING (true);
  ```

## 3. 데이터 로딩
- **초기 데이터**: 국가 경계(TopoJSON), GDP, 인구 등의 초기 데이터는 CSV 파일로 관리합니다.
- **로딩 방법**:
  1.  **Supabase 대시보드 사용**: Supabase 대시보드의 'Database' -> 'Tables' 메뉴에서 각 테이블을 선택하고, 'Import data from CSV' 기능을 사용하여 CSV 파일을 직접 업로드합니다.
  2.  **클라이언트 스크립트 사용**: 대량의 데이터를 프로그래밍 방식으로 삽입해야 할 경우, Node.js 환경에서 실행되는 별도의 스크립트를 작성하여 Supabase 클라이언트를 통해 데이터를 일괄 삽입(bulk insert)합니다.

