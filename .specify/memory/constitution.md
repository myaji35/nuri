<!--
SYNC IMPACT REPORT
===================
Version change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution)
Modified principles: Initial constitution creation for NURI Platform
Added sections:
  - Core Principles: 6 principles established
    I. Performance-First 3D Visualization
    II. Accessibility & Inclusive Design
    III. Data Integrity & Geospatial Accuracy
    IV. Component Modularity & Testability
    V. Security & Privacy by Default
    VI. Responsive & Mobile-First Design
  - Technology Standards (Stack Requirements + Constraints)
  - Quality Gates (Pre-Commit, Pre-Merge, Pre-Deployment, Testing Philosophy)
  - Governance (Authority, Amendment Process, Compliance Review)
Removed sections: None (initial creation)
Templates requiring updates:
  ✅ constitution.md - created with NURI-specific principles
  ✅ plan-template.md - validated (generic constitution check already present)
  ✅ spec-template.md - validated (user story structure aligns with principles)
  ✅ tasks-template.md - validated (testing philosophy aligned)
  ✅ command files - validated (no NURI-specific changes needed)
Follow-up TODOs: None - all placeholders resolved
-->

# NURI Platform Constitution

## Core Principles

### I. Performance-First 3D Visualization

**NON-NEGOTIABLE**: All 3D globe interactions MUST maintain 60 FPS performance across target devices.

- WebGL-based globe rendering optimized for smooth rotation and interaction
- Largest Contentful Paint (LCP) MUST be under 3 seconds
- Texture loading must be progressive with low-res fallbacks
- Geometry complexity must be balanced for mobile devices (target: <50k vertices for globe mesh)
- All animations use requestAnimationFrame for optimal frame timing

**Rationale**: The 3D globe is the core user experience. Poor performance undermines NURI's credibility as a technology-forward social impact organization.

### II. Accessibility & Inclusive Design

**NON-NEGOTIABLE**: Platform MUST achieve WCAG 2.1 AA compliance as a social impact organization committed to disability employment integration.

- All visual information must have text-based alternatives
- Keyboard navigation required for all interactive elements
- Screen reader compatibility for globe interactions via aria-live regions
- Color tier coding must include additional visual indicators (patterns/icons) beyond HSL colors
- Multilingual support (Korean/English) via react-i18next is mandatory

**Rationale**: NURI's mission centers on disability employment integration. The platform must exemplify inclusive design principles.

### III. Data Integrity & Geospatial Accuracy

**NON-NEGOTIABLE**: Geographic data and market tier classifications MUST be authoritative, traceable, and version-controlled.

- All country boundaries use PostGIS geometries with documented projection systems
- Market tier assignments require documented business justification
- Farm site coordinates verified against actual deployment locations (±100m accuracy)
- GIS data changes logged with audit trail (who, when, why)
- Country data (GDP, population) sourced from verifiable international databases

**Rationale**: Inaccurate geographic or market data damages stakeholder trust and investment decisions.

### IV. Component Modularity & Testability

**NON-NEGOTIABLE**: 3D visualization components MUST be independently testable outside the full application context.

- Globe rendering logic separated from data fetching
- Marker systems accept dependency injection for animation/positioning
- React Three Fiber components use refs for imperative testing access
- TopoJSON parsing decoupled from rendering pipeline
- Each major feature (globe, markers, tooltips, tier highlighting) testable in isolation

**Rationale**: Complex 3D interactions are difficult to debug. Modular architecture enables faster iteration and confidence in changes.

### V. Security & Privacy by Default

**NON-NEGOTIABLE**: All data transmission and storage MUST protect stakeholder privacy and organizational security.

- HTTPS enforced across all environments (dev, staging, prod)
- XSS protection via Content Security Policy headers
- CSRF tokens for all state-changing operations
- API keys/secrets managed via environment variables (never committed)
- User interaction analytics anonymized (no PII without explicit consent)

**Rationale**: NURI handles sensitive partnership data and strategic expansion plans. Security breaches risk partnerships and reputation.

### VI. Responsive & Mobile-First Design

**NON-NEGOTIABLE**: Platform MUST deliver functional experience on mobile devices (50% of target audience).

- Breakpoint strategy: mobile (<640px), tablet (640-1024px), desktop (>1024px)
- Touch-optimized globe controls (pinch-zoom, swipe-rotate)
- Tooltip/modal overlays adapted for smaller screens
- Critical path CSS inlined for faster mobile load
- Progressive enhancement: text-based fallback if WebGL unavailable

**Rationale**: Many stakeholders in target markets access web primarily via mobile. Desktop-only design excludes key audiences.

## Technology Standards

### Stack Requirements

**Frontend Framework**: Next.js 16+ with TypeScript 5+ (strict mode)
- React 19+ for concurrent rendering benefits
- App Router pattern for improved performance

**3D Rendering**: Three.js with React Three Fiber
- @react-three/drei for optimized controls (OrbitControls, useTexture)
- Sprite-based markers for performance-optimized pulsing effects

**Geospatial Data**: D3.js (d3-geo) + TopoJSON for efficient geometry handling
- PostGIS for server-side spatial queries
- Spherical Mercator projection (EPSG:3857) for web compatibility

**Styling**: Tailwind CSS 4+ with custom HSL tier theming
- Design tokens for consistent spacing/colors
- Framer Motion for non-3D animations

**Backend**: FastAPI (Python 3.11+) or Nest.js (alternative)
- GIS libraries: Shapely, Fiona (Python) or Turf.js (Node)
- PostgreSQL 15+ with PostGIS 3.4+ extension

**Deployment**: Vercel (frontend), AWS/GCP (backend/database)

### Technology Constraints

- No runtime dependencies on proprietary mapping services (Mapbox, Google Maps) to avoid vendor lock-in
- Avoid heavy frameworks for simple components (use vanilla Three.js when React Three Fiber adds overhead)
- Minimize client-side bundle: target <500KB initial JS bundle (gzipped)

## Quality Gates

### Pre-Commit Requirements

- TypeScript strict mode with zero type errors
- ESLint passing with project configuration
- All modified components have corresponding test coverage

### Pre-Merge Requirements (PR Review)

- Performance budget validated (Lighthouse CI: Performance ≥90, Accessibility ≥95)
- Visual regression tests pass for globe rendering changes
- i18n keys present for both Korean and English
- Database migrations include rollback scripts

### Pre-Deployment Requirements

- End-to-end tests pass for critical paths:
  1. Globe loads and renders country boundaries
  2. Market tier highlighting responds to user selection
  3. Farm site markers visible and interactive
  4. Tooltip data displays correctly on hover
- Security headers validated (CSP, HSTS, X-Frame-Options)
- API response times <200ms (95th percentile) under load testing

### Testing Philosophy

- **Unit Tests**: Component logic, data transformations, utility functions
- **Integration Tests**: API contracts, database queries, GIS calculations
- **Visual Regression**: Globe rendering consistency across browsers
- **E2E Tests**: Critical user journeys (not exhaustive UI coverage)

## Governance

### Constitution Authority

This constitution supersedes conflicting guidance in README files, comments, or ad-hoc decisions. When in doubt, constitution principles take precedence.

### Amendment Process

1. Propose change with clear rationale (GitHub issue)
2. Require team consensus (all engineers + product owner approval)
3. Update constitution version following semantic versioning:
   - **MAJOR**: Backward-incompatible principle removal or redefinition
   - **MINOR**: New principle addition or material expansion
   - **PATCH**: Clarifications, typos, non-semantic refinements
4. Update dependent templates (.specify/templates/*) to reflect changes
5. Include migration guidance if existing code requires updates

### Compliance Review

- All pull requests MUST include "Constitution Compliance" section in description verifying alignment
- Quarterly constitution review to assess if principles remain relevant
- Complexity/exceptions require explicit written justification referencing specific principles

### Runtime Development Guidance

For AI agent-specific development patterns and conventions, refer to `/CLAUDE.md` and `/GEMINI.md`. These files provide tactical guidance that implements constitutional principles.

**Version**: 1.0.0 | **Ratified**: 2025-11-19 | **Last Amended**: 2025-11-19
