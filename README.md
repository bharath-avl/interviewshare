# InterviewShare

A community-driven platform where university students share real interview experiences to help peers prepare better. Browse companies, read interview questions, tips, and share your own story — completely anonymous if you prefer.

🔗 **Live:** [interviewshare.pages.dev](https://interviewshare.pages.dev)

---

## ✨ Features

- **Browse Interviews** — Filter and search interview experiences by company, role, tags, and difficulty
- **Company Profiles** — View all interviews grouped by company with average difficulty ratings
- **Submit Experiences** — Multi-step form to share your interview story with questions asked, tips, tags, and difficulty rating
- **Voting System** — Upvote/downvote helpful interview experiences
- **Comments** — Discuss and ask follow-up questions on any interview post
- **Anonymous Posting** — Post anonymously or with your name — your choice
- **Real-time Sync** — All data is synced in real-time across users via Firebase Firestore
- **70+ Companies** — Pre-loaded with companies from Global Tech (Google, Meta, Amazon) to Indian IT (TCS, Infosys) to Startups (Razorpay, CRED, Flipkart)
- **Dark Mode UI** — Premium dark theme with OKLCH color system and smooth animations

### 🤖 AI-Powered Features

- **AI Interview Summary** — One-click AI-powered summary of any interview experience using Google Gemini 2.0 Flash. Generates a structured breakdown with overview, key questions, tips & takeaways, and a verdict — right in the sidebar while you read.
- **Tech News Feed** — Real-time tech company news page with category filters (Hiring, Layoffs, Funding, Acquisitions, Market). Auto-detects mentioned companies and categorizes articles. Focused on Indian tech companies with global coverage. Powered by NewsData.io API.

## 🛠 Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| Framework    | React 19 + Vite 6                     |
| Routing      | React Router v7                       |
| Database     | Firebase Firestore (real-time)        |
| AI           | Google Gemini 2.0 Flash               |
| News API     | NewsData.io                           |
| Serverless   | Cloudflare Pages Functions            |
| Styling      | Vanilla CSS with OKLCH design tokens  |
| Typography   | Figtree + Schibsted Grotesk (Google Fonts) |
| Hosting      | Cloudflare Pages                      |
| Analytics    | Cloudflare Web Analytics              |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Navbar.jsx       # Top navigation bar
│   ├── Footer.jsx       # Site footer
│   ├── SearchBar.jsx    # Search & filter controls
│   ├── CompanyCard.jsx  # Company grid cards
│   ├── InterviewCard.jsx # Interview list cards
│   ├── SubmitForm.jsx   # Multi-step submission form
│   ├── CommentSection.jsx # Comments on interviews
│   ├── VoteButton.jsx   # Upvote/downvote button
│   ├── AISummary.jsx    # AI-powered interview summary panel
│   ├── DifficultyMeter.jsx # Visual difficulty indicator
│   ├── TagChip.jsx      # Tag badges
│   └── StatBar.jsx      # Homepage statistics
├── data/
│   ├── firebase.js      # Firebase config & initialization
│   ├── store.jsx        # Global state (Context + Firestore listeners)
│   ├── companies.js     # Company directory (70+ companies)
│   └── tags.js          # Predefined tags, seniority levels, outcomes
├── pages/
│   ├── HomePage.jsx     # Landing page with search & interview feed
│   ├── CompanyPage.jsx  # Company-specific interview listing
│   ├── InterviewDetailPage.jsx # Full interview view with AI summary
│   ├── NewsPage.jsx     # Real-time tech company news feed
│   └── SubmitPage.jsx   # Submit experience page
├── App.jsx              # Root component with routing
├── main.jsx             # Entry point
└── index.css            # Global styles & design tokens

functions/
└── api/
    ├── summarize.js     # Cloudflare Pages Function — Gemini AI proxy
    └── news.js          # Cloudflare Pages Function — News API proxy
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A Firebase project with Firestore enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/bharath-avl/interviewshare.git
cd interviewshare

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be running at `http://localhost:5173`

### Environment Variables

#### Frontend (Optional)

The app works out of the box with the default Firebase config. To use your own Firebase project, create a `.env` file:

```env
VITE_FB_API_KEY=your_api_key
VITE_FB_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FB_PROJECT_ID=your_project_id
VITE_FB_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FB_MESSAGING_ID=your_messaging_id
VITE_FB_APP_ID=your_app_id
```

#### Serverless API Keys (Cloudflare Pages Environment Variables)

These must be set in the **Cloudflare Pages dashboard** under Settings → Environment Variables. They are used by the serverless functions and are never exposed to the frontend.

| Variable | Source | Purpose |
| -------- | ------ | ------- |
| `GEMINI_API_KEY` | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) | AI interview summaries |
| `NEWSDATA_API_KEY` | [newsdata.io](https://newsdata.io) (free tier — 200 req/day) | Tech news feed |

> **Note:** The AI Summary and News features require these API keys to be configured on Cloudflare. They will show graceful error states locally during development since Cloudflare Pages Functions only run in production.

## 📦 Deployment

The project is deployed on **Cloudflare Pages** and auto-deploys on every push to `main`.

### To deploy manually:

```bash
# Build for production
npm run build

# The output is in the dist/ folder
# Upload to Cloudflare Pages, Vercel, Netlify, or any static host
```

### Cloudflare Pages Setup

1. Connect your GitHub repo in the Cloudflare Pages dashboard
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables: `GEMINI_API_KEY` and `NEWSDATA_API_KEY`
5. Every push to `main` triggers an automatic deployment

## 🤝 Contributing

Contributions are welcome! If you'd like to add a company, fix a bug, or improve the UI:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -m 'Add new feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

Built with ❤️ for the student community
