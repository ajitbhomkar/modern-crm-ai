# Modern CRM System with AI

[![CI/CD Pipeline](https://github.com/ajitbhomkar/modern-crm-ai/actions/workflows/deploy.yml/badge.svg)](https://github.com/ajitbhomkar/modern-crm-ai/actions/workflows/deploy.yml)
![CRM Pro](https://img.shields.io/badge/Next.js-14+-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)
![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

A modern, feature-rich Customer Relationship Management (CRM) system built with Next.js 14+, TypeScript, Tailwind CSS, and AI capabilities powered by Groq API.

> **🚀 Now with Automated CI/CD!** Every push automatically deploys to Vercel.

![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue?style=flat-square&logo=typescript)

![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)```bash

npm run dev

## ✨ Features# or

yarn dev

- **📊 Rich Dashboard**: Interactive analytics with charts and real-time statistics# or

- **👥 Customer Management**: Complete customer lifecycle management with detailed profilespnpm dev

- **🤖 AI-Powered Features**:# or

  - Intelligent lead scoring using Groq AIbun dev

  - AI chat assistant for insights and support```

  - Natural language data analysis

- **✅ Task Management**: Organize and track tasks with priorities and statusOpen [http://localhost:3000](http://localhost:3000) with your browser to see the result.

- **📈 Analytics & Reporting**: Visual data representation with Recharts

- **🎨 Modern UI/UX**: Beautiful, responsive design with Tailwind CSS and shadcn/uiYou can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

- **📱 Mobile Responsive**: Fully responsive design for all devices

- **⚡ Performance**: Built with Next.js 14+ App Router and TurbopackThis project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.



## 🚀 Tech Stack## Learn More



- **Framework**: Next.js 14+ (App Router)To learn more about Next.js, take a look at the following resources:

- **Language**: TypeScript

- **Styling**: Tailwind CSS- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.

- **UI Components**: shadcn/ui (Radix UI)- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

- **AI**: Groq API (Llama 3.3 70B)

- **Charts**: RechartsYou can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

- **State Management**: Zustand

- **Icons**: Lucide React## Deploy on Vercel



## 📦 InstallationThe easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.



1. **Clone the repository**:Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

   ```bash
   git clone <your-repo-url>
   cd crm
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_GROQ_API_KEY=your_groq_api_key_here
   ```
   
   Get your Groq API key from: https://console.groq.com/

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 Getting a Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to API Keys section
4. Create a new API key
5. Copy the key and add it to your `.env.local` file

## 📖 Usage

### Dashboard
- View key metrics: total customers, active leads, revenue, and completed tasks
- Analyze revenue trends with interactive charts
- Monitor customer distribution by status

### Customers
- View all customers with detailed information
- Search and filter customers
- Generate AI-powered lead scores for better prioritization
- Track customer interactions and value

### AI Assistant
- Chat with an AI assistant for CRM insights
- Ask questions about your customer data
- Get recommendations for customer engagement

### Tasks
- Create and manage tasks
- Filter tasks by status (pending, in-progress, completed)
- Set priorities and due dates
- Assign tasks to team members

## 🏗️ Project Structure

```
crm/
├── src/
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Dashboard page
│   │   ├── customers/         # Customers page
│   │   ├── ai-chat/           # AI chat page
│   │   ├── tasks/             # Tasks page
│   │   └── settings/          # Settings page
│   ├── components/            # React components
│   │   ├── ui/               # shadcn/ui components
│   │   ├── Dashboard.tsx     # Dashboard component
│   │   ├── Customers.tsx     # Customers component
│   │   ├── AIChat.tsx        # AI chat component
│   │   ├── Tasks.tsx         # Tasks component
│   │   └── Sidebar.tsx       # Navigation sidebar
│   └── lib/                   # Utilities and libraries
│       ├── store.ts          # Zustand state management
│       ├── groq-client.ts    # Groq AI integration
│       └── utils.ts          # Utility functions
├── .env.example              # Environment variables example
└── package.json              # Dependencies
```

## 🚢 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**:
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**:
   - Visit [Vercel](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add your environment variable: `NEXT_PUBLIC_GROQ_API_KEY`
   - Click "Deploy"

Your CRM system will be live in minutes! 🎉

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Customization

### Adding New Features

1. **Create a new page**: Add a new folder in `src/app/`
2. **Create components**: Add components in `src/components/`
3. **Update navigation**: Edit `src/components/Sidebar.tsx`
4. **Extend store**: Add state in `src/lib/store.ts`

### Styling

- Customize colors in `tailwind.config.ts`
- Modify global styles in `src/app/globals.css`
- Use Tailwind utility classes for component styling

## 📝 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the GitHub repository.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Groq](https://groq.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)

---

Made with ❤️ using Next.js and Groq AI
