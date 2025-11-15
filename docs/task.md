# NURI 프로젝트 개발 태스크 목록

## Epic 1: 시스템 기반 및 백엔드 구축 (System Foundation & Backend Setup)

- [ ] Supabase 프로젝트 생성 및 PostGIS 확장 활성화
- [ ] Supabase 대시보드를 통해 `countries`, `market_tiers`, `sites` 테이블 스키마 정의
- [ ] 초기 데이터(국가 경계, 농장 위치 등)를 CSV 파일이나 스크립트를 통해 데이터베이스에 임포트
- [ ] 익명 사용자의 데이터 읽기만 허용하는 RLS(Row Level Security) 정책 설정
- [ ] Next.js 프로젝트에 Supabase 클라이언트 설정 및 기본 데이터 조회 테스트 통과

## Epic 2: 3D 인터랙티브 지구본 구현 (3D Interactive Globe Implementation)

- [ ] Three.js와 React Three Fiber를 사용하여 기본 3D 씬, 카메라, 조명 설정
- [ ] 위성 이미지가 매핑된 3D 지구본이 화면 중앙에서 자동으로 회전하도록 구현
- [ ] 사용자는 마우스 드래그로 지구본을 회전시키고, 마우스 휠로 확대/축소할 수 있도록 구현
- [ ] TopoJSON 형식의 국가 경계 데이터를 파싱하여 지구본 표면에 시각적으로 표현

## Epic 3: 데이터 시각화 및 인터랙션 연동 (Data Visualization & Interaction)

- [ ] Supabase API를 호출하여 `markets` 및 `sites` 데이터를 성공적으로 가져오도록 구현
- [ ] API로 받은 시장 등급(Tier) 데이터에 따라 각 국가의 색상을 동적으로 변경하여 표시
- [ ] 스마트팜의 위도/경도 좌표를 3D 공간으로 변환하여, 지구본 위에 애니메이션 효과(Pulsing)가 있는 마커를 표시
- [ ] 사용자가 마우스로 특정 국가를 가리키면(hover), 해당 국가의 이름, GDP, 인구 정보가 담긴 툴팁이 나타나도록 구현

## Epic 4: UI/UX 완성 및 배포 (UI/UX Polish & Deployment)

- [ ] `ui_ux_guide.md`에 정의된 색상, 타이포그래피, 컴포넌트 스타일을 `shadcn/ui`와 Tailwind CSS를 사용하여 전체 페이지에 적용
- [ ] 사용자는 언어 전환 버튼을 통해 한국어와 영어를 오가며 콘텐츠를 볼 수 있도록 구현
- [ ] 모바일, 태블릿, 데스크톱 환경에서 레이아웃이 깨지지 않고 모든 기능이 정상적으로 동작하도록 반응형 디자인 구현
- [ ] Vercel을 통해 프로젝트를 성공적으로 빌드하고 프로덕션 환경에 배포
- [ ] Lighthouse 점수 기준으로 성능, 접근성, SEO 점검을 통과
