# GitBall 2026 ⚽🏆

GitBall 2026 is a premium, minimalist developer scouting dashboard for the 2026 World Cup. It converts real-time public GitHub stats (stars, commits, streaks, followers) into collectible, custom-themed player cards using NVIDIA NIM AI models.

---

## Key Features

- 🃏 **Fanned Card Showcase**: A sleek, overlapping player deck showcase on the landing hero section.
- 🎨 **Dynamic Card Themes**: Custom-themed Gold, Silver, Legendary (Icon), and Bronze cards. Switch between **Light** and **Dark** designs on the fly with a sliding pill toggle.
- 💫 **GPU-Accelerated 3D Hover**: Smooth hardware-accelerated mouse coordinate card tilt animations.
- 📸 **High-Resolution PNG Exports**: Sharp `3x` pixel ratio downsampled PNG card images, ready to print or share.
- 🔒 **API Security & Limits**: Strict GitHub username regex filters (against SSRF) and sliding-window rate limit checks (10 requests/min per IP) to protect AI completions.
- 🎯 **Dynamic Server-Side SEO**: Dynamic metadata generation (`generateMetadata`) for dynamic route crawling and rich social share previews (X/Twitter, Slack).
- 🔊 **Zero-Latency Audio Cues**: Retro arcade chimes synthesized in real-time using the browser Web Audio API.
- 🐣 **Custom Easter Eggs**: Hardcoded 99-OVR Legendary cards for famous developers (Linus Torvalds, Evan You, Dan Abramov) and the creator (`abhimanyutiwaribot`), bypassing AI processing while preserving real profile photos.

---

## Tech Stack

- **Framework**: Next.js (App Router, Server & Client Components)
- **Runtime**: Bun
- **Styling**: Tailwind CSS (v4)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Canvas Exporter**: HTML-to-Image

---

## Getting Started

### 1. Clone & Install Dependencies
Ensure you have [Bun](https://bun.sh) installed:
```bash
git clone https://github.com/abhimanyutiwaribot/gitball.git
cd gitball
bun install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and fill in your keys:
```bash
cp .env.example .env
```
Open `.env` and add:
- `NVIDIA_API_KEY`: Your NVIDIA NIM key (e.g. `nvapi-...`).
- `GITHUB_TOKEN`: (Optional) Your GitHub Personal Access Token to prevent API rate limiting (increases limits from 60 to 5,000 requests/hour).

### 3. Run Development Server
```bash
bun dev
```
Open [http://localhost:3000](http://localhost:3000) to see the dashboard.

### 4. Build for Production
```bash
bun run build
```

---

## Deployment (Vercel)

The easiest way to deploy is through Vercel:

1. Import the repository on [vercel.com](https://vercel.com/new).
2. Configure **Environment Variables** in the Vercel dashboard:
   - `NVIDIA_API_KEY`
   - `GITHUB_TOKEN` (optional)
3. Deploy! Every commit pushed to `master` will trigger an automatic preview or production build.

---

Made with ⚽ by [@abhimanyutwts](https://x.com/abhimanyutwts)
