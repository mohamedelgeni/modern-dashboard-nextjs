# Modern Dashboard - Next.js

A modern, responsive dashboard built with Next.js, Tailwind CSS, and custom animated components.

![Modern Dashboard](my-app/public/dashboard-preview.png)

## Features

- 🌙 Dark/Light mode toggle
- 📊 Interactive data visualization with charts
- 🎨 Modern UI with animated components
- 📱 Fully responsive design for all devices
- ✨ Custom "tubelight" navigation with glowing effects
- 📈 Sales summary with animated stat cards
- 🛠️ Built with TypeScript for type safety
- 🔐 Authentication system

## Tech Stack

- **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Framer Motion
- **UI Components:** Custom components, Shadcn UI
- **Charts:** Custom chart components
- **Icons:** Lucide React
- **Animation:** Framer Motion
- **Backend:** Node.js, Express (for the API server)

## Project Structure

- `/my-app` - Next.js application
- `/server` - Express API server for data handling

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/modern-dashboard-nextjs.git
   cd modern-dashboard-nextjs
   ```

2. Install dependencies for the Next.js app:
   ```bash
   cd my-app
   npm install
   # or
   yarn install
   ```

3. Install dependencies for the server:
   ```bash
   cd ../server
   npm install
   # or
   yarn install
   ```

4. Set up environment variables:
   - Create a `.env.local` file in the `/my-app` directory
   - Create a `.env` file in the `/server` directory

### Running the Application

1. Start the Next.js development server:
   ```bash
   cd my-app
   npm run dev
   # or
   yarn dev
   ```

2. Start the API server:
   ```bash
   cd server
   npm run dev
   # or
   yarn dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

## Key Components

- **DashboardNav**: Modern navigation with tubelight effect
- **SalesSummary**: Animated sales statistics cards
- **GlowingEffect**: Adds a subtle glow to container components
- **Charts**: Custom chart components for data visualization

## Screenshots

### Dashboard Overview
![Dashboard Overview](my-app/public/dashboard-overview.png)

### Sales Summary
![Sales Summary](my-app/public/sales-summary.png)

### Dark Mode
![Dark Mode](my-app/public/dark-mode.png)

## License

MIT

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Shadcn UI](https://ui.shadcn.com/) 