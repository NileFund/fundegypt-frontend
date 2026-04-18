# NileFund Frontend

A modern, responsive crowdfunding platform built with React and TypeScript. NileFund empowers Egyptian entrepreneurs and changemakers to raise funds for their innovative projects and causes.

## 🌟 Features

### For Users
- **Project Discovery**: Browse, search, and filter projects by category, rating, and funding status
- **Project Details**: View comprehensive project information including descriptions, images, and funding progress
- **Donations**: Support projects with secure payment integration
- **User Profiles**: Create and manage personal profiles, track donations, and view project history
- **Comments & Discussions**: Engage with project creators and other backers through comments and replies
- **Search & Filtering**: Advanced search by title, tags, and category
- **Category Browsing**: Explore projects organized by different categories

### For Project Creators
- **Project Creation**: Create and manage crowdfunding campaigns
- **Project Editing**: Update project details, images, and descriptions
- **Analytics**: Track fundraising progress and donor engagement
- **Comment Management**: Respond to backer comments and questions
- **Project Status**: Manage project lifecycle (running, pending, completed, cancelled)

### Admin Features
- **Featured Projects**: Highlight exceptional projects for increased visibility
- **Category Management**: Organize projects by categories
- **Content Moderation**: Manage comments and user-generated content

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - UI library with hooks
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **TailwindCSS** - Utility-first CSS framework

### State Management & Data Fetching
- **TanStack React Query** - Server state management with automatic caching
- **Zustand** (optional) - Client state management

### Routing & Navigation
- **React Router v6** - Client-side routing with nested routes

### UI Components & Icons
- **Lucide React** - Modern SVG icon library
- **Custom Components** - Built-in component library

### Utilities
- **Axios** - HTTP client for API requests
- **date-fns** - Date formatting and manipulation

## 📁 Project Structure

```plaintext
src/
├── assets/            # Static assets like images and fonts
├── components/        # Reusable React components
├── features/          # Feature-based folders (e.g., auth, projects)
├── hooks/             # Custom React hooks
├── layouts/          # Layout components for consistent styling
├── pages/            # Page components for routing
├── services/         # API calls and business logic
├── store/            # Global state management (e.g., Redux, Zustand)
├── styles/           # Global styles and CSS frameworks
├── utils/            # Utility functions and helpers
└── App.tsx           # Root component
```

## 🚀 Getting Started

To get started with NileFund, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/NileFund/fundegypt-frontend
   cd nilefund-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5173`

## 🤝 Contributing

We welcome contributions to NileFund! To contribute, please follow these guidelines:

1. **Fork the repository**.
2. **Create a new branch** for your feature or bugfix.
3. **Make your changes** and commit them with descriptive messages.
4. **Push your branch** to your forked repository.
5. **Create a pull request** describing your changes.

Please ensure that your code adheres to the existing style and conventions used in the project.

---

Made with ❤️ by the NileFund Team
