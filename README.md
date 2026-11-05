# BookNook

A modern, cozy community library management platform connecting readers with curated literary collections, real-time book borrowing, and inventory circulation.

Live Deployment: [https://booknook-client.vercel.app](https://booknook-client.vercel.app)

---

## Features

- **Google & Email Authentication**: Secure user onboarding powered by BetterAuth supporting Google OAuth and password authentication with encrypted sessions and Ed25519 JWT issuance.
- **Protected Routes That Survive Reload**: Session-aware route guards (`PrivateRoute`) maintain user authentication across hard browser refreshes and retain callback URLs without unauthenticated layout flashing.
- **Complete Book Lifecycle (Add, Edit, Delete)**: Curators can publish new editions with cover image uploads via ImgBB, modify existing metadata inside pre-filled dialog modals, and safely remove contributions with custom confirmation popups.
- **Borrow & Return with Real-Time Copy Tracking**: Readers can check out available editions with custom return schedules, dynamic on-screen copy decrements, and one-click return handling that automatically restores inventory.
- **Double-Borrow Prevention**: Server-enforced loan rules and unique compound indexes ensure a reader cannot hold simultaneous active loans for the identical volume.
- **Dual Cozy Themes (Light & Dark)**: Custom-tailored `booknook-light` and `booknook-dark` themes built with Tailwind CSS v4 and DaisyUI v5, honoring reader preference and system color schemes.
- **Interactive Swiper Hero Carousel**: Smooth autoplay hero banner with touch-friendly gestures, progress indicators, and call-to-action shortcuts.
- **Subtle Framer Motion Animations**: Smooth page reveals, card hover elevations, and responsive modal transitions designed for an elegant reading experience.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack, Partial Prerendering) |
| **Language** | TypeScript |
| **UI & Styling** | Tailwind CSS v4, DaisyUI v5 |
| **Icons & Typography** | React Icons, Playfair Display, Inter |
| **Motion & Sliders** | Framer Motion, Swiper 14 |
| **Authentication** | BetterAuth (MongoDB Adapter, JWT Plugin, Google OAuth) |
| **Database** | MongoDB Atlas |
| **Toast Notifications** | Sonner |
| **Image Hosting** | ImgBB API |

---

## Environment Variables

Create a `.env.local` file in the root directory by duplicating `.env.example`:

```bash
cp .env.example .env.local
```

| Variable Name | Required | Description | Example Value |
|---|---|---|---|
| `BETTER_AUTH_SECRET` | Yes | 32+ character random string for cryptographic session signing | `your-secret-key-min-32-chars` |
| `BETTER_AUTH_URL` | Yes | Base URL where the Next.js client is hosted | `http://localhost:3000` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string for BetterAuth user data | `mongodb+srv://<user>:<pwd>@cluster.mongodb.net/booknook` |
| `GOOGLE_CLIENT_ID` | Yes | Google Cloud OAuth 2.0 Web Client ID | `your-google-client-id.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Yes | Google Cloud OAuth 2.0 Client Secret | `GOCSPX-your-google-client-secret` |
| `NEXT_PUBLIC_API_URL` | Yes | Endpoint URL of the Express BookNook API server | `http://localhost:5001` |
| `NEXT_PUBLIC_IMGBB_KEY` | Yes | API key from ImgBB for book cover uploads | `your-imgbb-api-key` |

---

## Local Setup

### 1. Prerequisites

- Node.js (version 20 or higher recommended)
- npm, yarn, or pnpm
- MongoDB Atlas cluster connection URI
- Google Cloud OAuth credentials (with `http://localhost:3000/api/auth/callback/google` redirect URI)

### 2. Clone the Repository

```bash
git clone https://github.com/your-username/booknook-client.git
cd booknook-client
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

```bash
cp .env.example .env.local
```

Fill in the required keys in `.env.local` according to the Environment Variables table above.

### 5. Start the Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser to explore BookNook.

### 6. Production Build Verification

```bash
npm run build
npm run start
```
