# FeedPulse - AI-Powered Product Feedback Platform

A modern, full-featured feedback management system with AI-powered analysis built with React and Tailwind CSS.

## 🚀 Features

### Public Features
- **Feedback Submission Form**
  - Title and description validation
  - Category selection (Bug, Feature Request, Improvement, Other)
  - Character counter with minimum length requirement
  - Optional name and email fields
  - Real-time AI analysis upon submission

### Admin Features
- **Secure Login System**
  - JWT-based authentication
  - Protected dashboard routes

- **Comprehensive Dashboard**
  - Real-time statistics (Total Feedback, Open Items, Average Priority, Top Tag)
  - Advanced filtering (Category, Status, Search)
  - Feedback cards with AI insights
  - Status management dropdown
  - Detailed feedback modal view

### AI Analysis (Simulated)
Each feedback submission is automatically analyzed for:
- **Category Detection**: Intelligent categorization based on content
- **Sentiment Analysis**: Positive, Neutral, or Negative
- **Priority Scoring**: 1-10 scale based on urgency and sentiment
- **Smart Summary**: Concise summary of the feedback
- **Auto-tagging**: Relevant tags extracted from content

## 🎨 UI/UX Highlights

- Modern SaaS design with gradient backgrounds
- Responsive layout (mobile & desktop)
- Color-coded badges for categories and sentiments
- Loading states and animations
- Toast notifications for user actions
- Clean card-based interface
- Accessible form controls

## 🔐 Admin Credentials

```
Email: admin@feedpulse.com
Password: admin123
```

## 📁 Project Structure

```
src/app/
├── App.tsx                    # Main app with routing
├── types/
│   └── index.ts              # TypeScript interfaces
├── lib/
│   └── utils.ts              # Utility functions
├── services/
│   ├── api.service.ts        # Mock API (localStorage-based)
│   └── gemini.service.ts     # Mock AI analysis
├── components/
│   ├── ui/                   # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Label.tsx
│   │   ├── Card.tsx
│   │   ├── Badge.tsx
│   │   ├── Select.tsx
│   │   └── Dialog.tsx
│   └── pages/                # Page components
│       ├── FeedbackForm.tsx  # Public feedback form
│       ├── Login.tsx         # Admin login
│       └── Dashboard.tsx     # Admin dashboard
```

## 🛠️ Technology Stack

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: Radix UI primitives
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Storage**: localStorage (mock backend)
- **AI**: Simulated Gemini API

## 📊 Data Persistence

This application uses **localStorage** to simulate a backend database. Data persists across browser sessions. The app includes 3 sample feedback items on first load.

## 🔄 How It Works

### 1. Submit Feedback (Public)
- User fills out the feedback form
- Form validates minimum requirements
- On submit, the feedback is sent to the mock API
- AI analysis runs (1.5s simulated delay)
- Feedback is saved to localStorage
- Success notification displayed

### 2. Admin Login
- Navigate to login via "Admin Login" link
- Enter credentials
- JWT token stored in localStorage
- Redirects to dashboard

### 3. Dashboard Management
- View all feedback with stats
- Filter by category, status, or search
- Click any card to view full details
- Update status via dropdown
- Real-time stats recalculation

## 🎯 Key Features Implemented

✅ Form validation with character limits
✅ AI-powered analysis (mocked)
✅ JWT authentication
✅ Protected routes
✅ localStorage persistence
✅ Real-time filtering and search
✅ Status management
✅ Responsive design
✅ Loading states
✅ Error handling
✅ Toast notifications
✅ Modal dialogs
✅ Stats dashboard
✅ Color-coded UI elements

## 🔮 Production Considerations

To adapt this for production:

1. **Backend API**
   - Replace `apiService` with real HTTP calls
   - Set up Express/Node.js server
   - Connect to MongoDB database

2. **Authentication**
   - Implement secure JWT with refresh tokens
   - Add password hashing (bcrypt)
   - Set up proper session management

3. **AI Integration**
   - Obtain Google Gemini API key
   - Replace mock analysis in `gemini.service.ts`
   - Add error handling for API failures

4. **Environment Variables**
   ```
   VITE_API_URL=http://localhost:3001
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

5. **Additional Features**
   - Email notifications
   - File attachments
   - Comment threads
   - User roles (Admin, Moderator)
   - Export to CSV
   - Analytics dashboard

## 🎨 Color System

- **Primary**: Indigo (for actions and branding)
- **Success**: Green (positive sentiment, resolved)
- **Warning**: Yellow (neutral sentiment, in review)
- **Danger**: Red (negative sentiment, bugs)
- **Secondary**: Gray (metadata, secondary actions)

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🐛 Known Limitations

- No real backend (uses localStorage)
- AI analysis is simulated (not real Gemini API)
- No pagination (displays all items)
- Single admin user only
- No email notifications
- No file upload support

## 💡 Usage Tips

1. Start by submitting feedback to see the AI analysis
2. Log in as admin to see the dashboard
3. Try different filters and search terms
4. Update feedback status to see real-time changes
5. Click on feedback cards for detailed view

---

**Built with ❤️ using React, Tailwind CSS, and modern web technologies**
