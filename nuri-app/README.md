# NURI Global Impact Platform

Interactive 3D globe visualization showcasing NURI's global expansion in social impact smart farming.

## Features

- 🌍 **3D Interactive Globe** - WebGL-powered globe with country interactions
- 🎯 **Market Tier Visualization** - Color-coded countries by implementation status
- 📍 **Farm Locations** - Animated markers showing NURI farm sites
- 🌐 **Multilingual Support** - Korean and English language support
- 📱 **Responsive Design** - Optimized for all device sizes
- ⚡ **High Performance** - 60 FPS interactions with optimized rendering

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **3D Graphics**: Three.js + React Three Fiber
- **Database**: Supabase (PostgreSQL with PostGIS)
- **Styling**: Tailwind CSS + shadcn/ui
- **Language**: TypeScript
- **State Management**: Zustand
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-repo/nuri-app.git
cd nuri-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Set environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
│   ├── globe/       # 3D globe components
│   └── ui/          # UI components (shadcn)
├── contexts/        # React contexts (language)
├── lib/             # Utility libraries
├── stores/          # Zustand stores
└── types/           # TypeScript definitions
```

## Performance

- Lighthouse Score: 90+
- First Contentful Paint: < 2s
- Time to Interactive: < 3s
- 60 FPS globe interactions

## License

Proprietary - NURI © 2024