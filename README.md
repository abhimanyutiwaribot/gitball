# GitBall 2026 ⚽🏆

GitBall lets you create your worldcup card using your github username.
---

## Key Features

check here:- https://gitball.vercel.app

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
