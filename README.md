# Kobae Landing Page

A modern, animated landing page for Kobae - where your circles meet. Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion.

## 🚀 Features

- **Modern Stack**: Next.js 16, React 19, TypeScript
- **Smooth Animations**: Framer Motion for engaging scroll animations
- **Interactive Carousel**: Embla Carousel with autoplay for events showcase
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Component Library**: shadcn/ui components for consistent UI
- **Wireframe Design**: Placeholder-based design ready for assets

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Carousel**: [Embla Carousel](https://www.embla-carousel.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository:

```bash
git clone https://github.com/kobaesg/kobae-landing.git
cd kobae-landing
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Build for Production

```bash
npm run build
npm start
```

## 🐳 Docker

Build and run using Docker:

```bash
# Build the image
docker build -t kobae-landing .

# Run the container
docker run -p 3000:3000 kobae-landing
```

## 📁 Project Structure

```
kobae-landing/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/
│   ├── sections/          # Page sections
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── Testimonial.tsx
│   │   ├── Events.tsx
│   │   ├── CTA.tsx
│   │   └── Footer.tsx
│   └── ui/                # shadcn/ui components
├── lib/                   # Utility functions
└── public/               # Static assets
```

## 🎨 Sections

1. **Hero** - Dynamic hero with scattered floating images
2. **About** - Revolutionary statement about Kobae
3. **How It Works** - 3-step connection process with flowing animations
4. **Testimonial** - User feedback with quote styling
5. **Events** - Auto-scrolling carousel of networking events
6. **CTA** - Final call-to-action
7. **Footer** - Site footer with links

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 🔗 Links

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
