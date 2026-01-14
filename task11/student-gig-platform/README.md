# GigHub - Student Gig Platform

A modern web application that connects students who need tasks done with students who want to earn money by completing gigs. Built with vanilla JavaScript, Firebase authentication, and responsive design.

## 🚀 Features

### User Authentication
- **Firebase Authentication** - Secure login/signup system
- **User Profiles** - Personal profiles with ratings, earnings, and completed tasks
- **Session Management** - Persistent user sessions

### Gig Management
- **Create Gigs** - Post tasks with detailed descriptions, budget, and deadlines
- **Browse Gigs** - Filter by skill type, location, and search keywords
- **User-Specific Gigs** - Each user manages only their own gigs
- **Edit & Delete** - Full CRUD operations for gig owners
- **Status Tracking** - Open and completed gig statuses

### Bidding System
- **Submit Bids** - Students can bid on gigs with pricing and delivery time
- **Bid Management** - Gig owners can view and accept bids
- **Permission Control** - Only gig owners can accept bids

### Portfolio System
- **User Portfolios** - Each user has personal portfolio of completed work
- **Completed Projects** - Track earnings and build work history
- **User-Specific Display** - Shows only your own completed projects

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Authentication**: Firebase Authentication
- **Database**: Local Storage (with Firebase integration ready)
- **Styling**: Custom CSS with CSS variables
- **Icons**: Emoji icons for modern look

## 📁 Project Structure

```
task11/student-gig-platform/
├── index.html              # Main HTML file
├── app.js                  # Main application logic
├── firebase-config.js       # Firebase configuration
├── styles.css              # Styling (if exists)
├── FIREBASE_SETUP.md       # Firebase setup instructions
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Firebase project (optional, for authentication)
- Local web server (optional, for development)

### Installation

1. **Clone or download the project**
   ```bash
   # If using git
   git clone <repository-url>
   cd task11/student-gig-platform
   ```

2. **Firebase Setup (Optional)**
   - Create a Firebase project at https://console.firebase.google.com
   - Enable Authentication (Email/Password)
   - Copy your Firebase config to `firebase-config.js`
   - Follow instructions in `FIREBASE_SETUP.md`


## 🎯 How to Use

### For Students Who Need Tasks Done
1. **Sign Up/Login** - Create account or login
2. **Post a Gig** - Click "Post a Gig" button
3. **Fill Details** - Add title, description, budget, deadline
4. **Manage Bids** - View bids and accept the best one
5. **Track Progress** - See completed gigs in your profile

### For Students Who Want to Earn Money
1. **Browse Gigs** - Explore available gigs on main feed
2. **Filter Search** - Use filters to find relevant gigs
3. **Submit Bids** - Click on gigs and submit competitive bids
4. **Complete Work** - Get selected and complete the task
5. **Build Portfolio** - Completed work appears in your profile

## 🔐 Security Features

- **User Isolation** - Users can only edit/delete their own gigs
- **Permission Checks** - Multiple layers of authorization
- **Input Validation** - Form validation for all user inputs
- **Secure Authentication** - Firebase-based secure login system

## 📱 Responsive Design

- **Mobile Friendly** - Works on all screen sizes
- **Touch Optimized** - Mobile-first approach
- **Modern UI** - Clean, intuitive interface
- **Accessibility** - Semantic HTML and keyboard navigation

## 🎨 UI Features

- **Modern Design** - Clean, professional interface
- **Status Indicators** - Visual feedback for gig status
- **Interactive Modals** - Smooth modal interactions
- **Loading States** - User feedback during operations
- **Error Handling** - Clear error messages




```

## 🚀 Future Enhancements

- **Real-time Notifications** - WebSocket integration
- **Payment Integration** - Stripe/PayPal integration
- **Rating System** - Two-way rating between users
- **File Attachments** - Support for gig files
- **Chat System** - In-app messaging



## 📞 Support

For questions or issues:
- Check the troubleshooting section
- Review the code comments
- Test in different browsers

---

**Built with ❤️ for students who want to work and learn!**
