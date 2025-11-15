# NURI 프로젝트 에픽 계획 (Epic Plan)

본 문서는 NURI 프로젝트 개발을 위한 상위 레벨의 작업 단위인 에픽(Epic)을 정의합니다. 각 에픽은 독립적으로 배포 가능한 기능의 묶음을 나타내며, 여러 개의 사용자 스토리(User Story)로 구성됩니다.

---

### Epic 1: 시스템 기반 및 백엔드 구축 (System Foundation & Backend Setup)
*   **목표**: 프론트엔드 개발에 필요한 모든 데이터 기반과 API를 Supabase를 통해 마련하여, 안정적인 데이터 연동이 가능한 상태를 만듭니다.
*   **주요 스토리 (Key Stories)**:
    *   **Story**: Supabase 프로젝트를 생성하고 PostGIS 확장을 활성화할 수 있다.
    *   **Story**: Supabase 대시보드를 통해 `countries`, `market_tiers`, `sites` 테이블 스키마를 정의할 수 있다.
    *   **Story**: 초기 데이터(국가 경계, 농장 위치 등)를 CSV 파일이나 스크립트를 통해 데이터베이스에 임포트할 수 있다.
    *   **Story**: 익명 사용자의 데이터 읽기만 허용하는 RLS(Row Level Security) 정책을 설정할 수 있다.
    *   **Story**: Next.js 프로젝트에 Supabase 클라이언트를 설정하고, 기본 데이터 조회 테스트를 통과할 수 있다.

---

### Epic 2: 3D 인터랙티브 지구본 구현 (3D Interactive Globe Implementation)
*   **목표**: 웹 페이지에 시각적으로 매력적이고 사용자가 상호작용할 수 있는 3D 지구본을 렌더링합니다.
*   **주요 스토리 (Key Stories)**:
    *   **Story**: Three.js와 React Three Fiber를 사용하여 기본 3D 씬, 카메라, 조명을 설정할 수 있다.
    *   **Story**: 위성 이미지가 매핑된 3D 지구본이 화면 중앙에서 자동으로 회전한다.
    *   **Story**: 사용자는 마우스 드래그로 지구본을 회전시키고, 마우스 휠로 확대/축소할 수 있다.
    *   **Story**: TopoJSON 형식의 국가 경계 데이터를 파싱하여 지구본 표면에 시각적으로 표현할 수 있다.

---

### Epic 3: 데이터 시각화 및 인터랙션 연동 (Data Visualization & Interaction)
*   **목표**: 3D 지구본과 Supabase 백엔드 데이터를 연동하여, 동적이고 정보 가치가 높은 시각화 결과물을 만듭니다.
*   **주요 스토리 (Key Stories)**:
    *   **Story**: Supabase API를 호출하여 `markets` 및 `sites` 데이터를 성공적으로 가져올 수 있다.
    *   **Story**: API로 받은 시장 등급(Tier) 데이터에 따라 각 국가의 색상을 동적으로 변경하여 표시한다.
    *   **Story**: 스마트팜의 위도/경도 좌표를 3D 공간으로 변환하여, 지구본 위에 애니메이션 효과(Pulsing)가 있는 마커를 표시한다.
    *   **Story**: 사용자가 마우스로 특정 국가를 가리키면(hover), 해당 국가의 이름, GDP, 인구 정보가 담긴 툴팁이 나타난다.

---

### Epic 4: UI/UX 완성 및 배포 (UI/UX Polish & Deployment)
*   **목표**: 전체적인 사용자 인터페이스를 디자인 가이드에 맞게 다듬고, 모든 디바이스에서 일관된 경험을 제공하며, 최종적으로 프로덕션 환경에 배포합니다.
*   **주요 스토리 (Key Stories)**:
    *   **Story**: `ui_ux_guide.md`에 정의된 색상, 타이포그래피, 컴포넌트 스타일을 `shadcn/ui`와 Tailwind CSS를 사용하여 전체 페이지에 적용한다.
    *   **Story**: 사용자는 언어 전환 버튼을 통해 한국어와 영어를 오가며 콘텐츠를 볼 수 있다.
    *   **Story**: 모바일, 태블릿, 데스크톱 환경에서 레이아웃이 깨지지 않고 모든 기능이 정상적으로 동작한다.
    *   **Story**: Vercel을 통해 프로젝트를 성공적으로 빌드하고 프로덕션 환경에 배포할 수 있다.
    *   **Story**: Lighthouse 점수 기준으로 성능, 접근성, SEO 점검을 통과한다.
