# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is the NURI (누리) project specification repository, containing Product Requirements Document (PRD) and Technical Requirements Document (TRD) for a global social impact startup focused on smart farming and disability employment integration. Currently, this repository contains **specifications only** - no implementation code exists yet.

## Project Context

NURI is building a web platform to showcase their global expansion in social impact smart farming. The platform features an interactive 3D globe visualization showing market tiers, implemented farm sites, and country-specific data.

## Key Specifications

### Technology Stack (from TRD)
- **Frontend:** Next.js (React), TypeScript, Three.js for 3D globe, D3.js/TopoJSON for geo data, Tailwind CSS, react-i18next
- **Backend:** FastAPI (Python) with GIS libraries, alternative: Nest.js
- **Database:** PostgreSQL with PostGIS extension for geospatial data
- **Deployment:** Vercel (frontend), AWS/GCP (backend/database)

### Core Features to Implement
1. **3D Interactive Globe:** WebGL-based rotating globe with country highlighting by market tier
2. **Market Tier System:** Three-tier classification with HSL color coding (Tier 1: Implemented, Tier 2: Priority, Tier 3: Long-term)
3. **Site Markers:** Pulsing yellow markers for NURI Farm locations (e.g., K1 at 36.81°, 127.79°)
4. **Country Data Tooltips:** GDP, population, comparison metrics on hover
5. **Multilingual Support:** Korean and English via react-i18next

## Development Commands (Post-Implementation)

Once the codebase is implemented, typical commands would be:

```bash
# Frontend (Next.js)
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build production
npm run lint         # Run linter
npm test            # Run tests

# Backend (FastAPI)
pip install -r requirements.txt    # Install Python dependencies
uvicorn main:app --reload          # Start dev server
pytest                             # Run tests

# Database Setup
createdb nuri_db
psql -d nuri_db -c "CREATE EXTENSION postgis"
```

## Architecture Overview

The system follows a modern three-tier architecture:
- **Presentation Layer:** Next.js with Three.js for 3D visualization
- **API Layer:** FastAPI serving GIS and market data
- **Data Layer:** PostgreSQL with PostGIS for spatial queries

Key API endpoints specified:
- `GET /api/markets?lang={en|ko}` - Returns market tiers with country data
- `GET /api/sites?lang={en|ko}` - Returns implemented farm locations

## Database Schema

Three main tables are specified:
- `countries`: Geospatial country boundaries (MultiPolygon geometry)
- `market_tiers`: Country-tier mappings (1-3 classification)
- `sites`: NURI Farm locations (Point geometry with lat/lon)

## 3D Globe Technical Details

The globe implementation requires:
- Spherical coordinate conversion (lat/lon to 3D)
- Auto-rotation animation (requestAnimationFrame loop)
- OrbitControls for user interaction
- Raycasting for hover detection
- Sprite-based pulsing markers with additive blending

## Important Implementation Notes

1. **Performance Target:** 60 FPS for 3D interactions, LCP < 3 seconds
2. **Accessibility:** WCAG 2.1 AA compliance with text fallbacks for visual elements
3. **Security:** HTTPS enforcement, XSS/CSRF protection required
4. **Responsive Design:** Must support mobile, tablet, and desktop viewports

## Current Repository Contents

- `prd.md`: Product requirements and business context
- `trd.md`: Detailed technical specifications and implementation guidance
- `.vscode-upload.json`: VSCode remote sync configuration template

When implementing features, always refer to the TRD for detailed specifications including data structures, API response formats, and specific implementation requirements.

## Active Technologies
- Python 3.11+ (001-langgraph-qa-system)

## Recent Changes
- 001-langgraph-qa-system: Added Python 3.11+
