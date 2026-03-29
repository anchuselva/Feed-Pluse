# FeedPulse - Getting Started

## Quick Start Guide

The application is ready to use! Since this is built within Figma Make's environment, the dev server is already running. Just interact with the preview to start using the application.

## 🎯 How to Use

### Step 1: Submit Feedback (Public View)

When you first open the application, you'll see the **Public Feedback Form**.

1. **Fill in the required fields:**
   - **Title**: Enter a brief summary (required, max 120 characters)
   - **Description**: Provide detailed information (required, minimum 20 characters)
   - **Category**: Select from Bug, Feature Request, Improvement, or Other
   - **Name** (optional): Your name
   - **Email** (optional): Your email address

2. **Submit the form:**
   - Click "Submit Feedback"
   - Wait 1-2 seconds while the AI analyzes your feedback
   - You'll see a success message when complete

3. **What happens behind the scenes:**
   - AI analyzes the sentiment (Positive/Neutral/Negative)
   - AI calculates priority score (1-10)
   - AI generates a summary
   - AI extracts relevant tags
   - Feedback is saved to localStorage

### Step 2: Access Admin Dashboard

1. **Navigate to login:**
   - Click the "Admin Login" link at the bottom of the feedback form

2. **Enter credentials:**
   ```
   Email: admin@feedpulse.com
   Password: admin123
   ```

3. **Click "Sign In"**
   - You'll be redirected to the admin dashboard
   - A JWT token is stored in localStorage

### Step 3: Manage Feedback (Dashboard)

Once logged in, you'll see the **Admin Dashboard** with:

#### Stats Cards (Top Section)
- **Total Feedback**: Count of all submissions
- **Open Items**: Feedback not yet resolved
- **Avg Priority**: Average AI priority score
- **Top Tag**: Most frequently occurring tag

#### Filters (Middle Section)
Use the filter controls to narrow down feedback:
- **Search**: Type keywords to search titles, descriptions, and tags
- **Category Filter**: Filter by Bug, Feature Request, Improvement, or Other
- **Status Filter**: Filter by New, In Review, or Resolved

Active filters are shown as removable badges below the filter controls.

#### Feedback List (Bottom Section)
Each card displays:
- Title and category badge
- Sentiment badge (color-coded)
- AI-generated summary
- Date submitted and priority score
- AI tags
- Status dropdown (update status inline)

**Click any card** to open the detailed modal view.

### Step 4: View Feedback Details

In the detail modal, you'll see:
- Full description (not truncated)
- AI summary
- Category and sentiment badges
- Priority score with visual bar
- All AI tags
- Status dropdown
- Submitter contact info (if provided)

You can update the status directly from the modal.

### Step 5: Update Status

Change feedback status in two ways:

1. **From the list view**: Click the dropdown on any card
2. **From the detail modal**: Use the status dropdown at the bottom

Status options:
- **New**: Just submitted (default)
- **In Review**: Being evaluated
- **Resolved**: Completed/fixed

Changes are saved instantly and reflected in the stats.

### Step 6: Logout

Click the **"Logout"** button in the top-right corner to:
- Clear the authentication token
- Return to the public feedback form

## 📊 Understanding AI Analysis

The app simulates Google Gemini AI with intelligent algorithms:

### Category Detection
Analyzes keywords to categorize feedback:
- **Bug**: Contains words like "error", "crash", "broken", "issue"
- **Feature Request**: Contains "feature", "add", "new", "want"
- **Improvement**: Contains "improve", "better", "enhance"
- **Other**: Fallback category

### Sentiment Analysis
Evaluates emotional tone:
- **Positive**: Contains words like "great", "love", "excellent"
- **Negative**: Contains words like "terrible", "hate", "frustrating"
- **Neutral**: Balanced or factual language

### Priority Scoring (1-10)
Calculated based on:
- Sentiment (negative = higher priority)
- Category (bugs = higher priority)
- Urgency keywords ("urgent", "critical", "asap")

### Tag Extraction
Identifies technical terms and topics:
- UI/UX, API, database, performance, security
- Mobile, desktop, authentication
- Custom tags based on content

### Summary Generation
Creates a concise 1-2 sentence summary from the description.

## 🎨 UI Color Guide

### Category Badges
- 🔴 **Bug**: Red (danger)
- 🟢 **Feature Request**: Green (success)
- 🔵 **Improvement**: Indigo (default)
- ⚪ **Other**: Gray (secondary)

### Sentiment Badges
- 🟢 **Positive**: Green
- 🟡 **Neutral**: Yellow
- 🔴 **Negative**: Red

### Priority Colors
- 🔴 **8-10**: Red (high priority)
- 🟡 **5-7**: Yellow (medium priority)
- 🟢 **1-4**: Green (low priority)

## 💾 Data Storage

- All data is stored in **browser localStorage**
- Data persists across page refreshes
- Clearing browser data will reset the app
- 3 sample feedback items are created on first load

## 🔗 Navigation

The app uses hash-based routing:
- `/` or `#` → Public feedback form
- `#login` → Admin login page
- `#dashboard` → Admin dashboard (requires authentication)

You can manually edit the URL hash to navigate.

## 🛠️ Testing Scenarios

### Test 1: Submit Bug Report
```
Title: App crashes when uploading files
Description: The application becomes unresponsive when I try to upload large PDF files over 10MB. This is very frustrating.
Category: Bug
```

Expected AI Analysis:
- Sentiment: Negative
- Priority: 8-9
- Tags: upload, performance
- Category: Bug

### Test 2: Submit Feature Request
```
Title: Add dark mode theme
Description: It would be great if the app had a dark mode option for better nighttime viewing experience.
Category: Feature Request
```

Expected AI Analysis:
- Sentiment: Positive
- Priority: 5-7
- Tags: ui, theme
- Category: Feature Request

### Test 3: Filter and Search
1. Submit 3-5 different feedback items
2. Use category filter to see only bugs
3. Search for a specific keyword
4. Change status to "Resolved" and filter by status

### Test 4: Authentication Flow
1. Try accessing `#dashboard` without logging in → Redirects to login
2. Log in with correct credentials → Access granted
3. Logout → Returns to public form
4. Try logging in with wrong credentials → Error message

## 🔍 Troubleshooting

### Problem: Feedback not appearing in dashboard
**Solution**: Make sure you're logged in and filters aren't excluding it

### Problem: Can't log in
**Solution**: Use exact credentials:
- Email: `admin@feedpulse.com`
- Password: `admin123`

### Problem: AI analysis takes too long
**Solution**: It's simulated with a 1.5s delay. This is intentional to mimic real API calls.

### Problem: Lost all feedback
**Solution**: Data is in localStorage. If cleared, 3 sample items will be recreated on next load.

## 📈 Next Steps

To extend this application:

1. **Add real backend**: Set up Express + MongoDB
2. **Integrate real AI**: Use actual Google Gemini API
3. **Add features**:
   - Email notifications
   - File attachments
   - Comment threads
   - Advanced analytics
   - Export to CSV
   - User management
4. **Deploy**: Host on Vercel, Netlify, or your server

## 🎓 Learning Resources

This project demonstrates:
- React hooks (useState, useEffect)
- TypeScript interfaces and types
- Form validation
- localStorage for persistence
- JWT authentication pattern
- Component composition
- Tailwind CSS styling
- Radix UI primitives
- Hash-based routing
- Mock API services
- AI simulation

---

**Need help?** Check the `FEEDPULSE_README.md` for technical details.
