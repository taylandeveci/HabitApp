# Habit Tracker App

A modern, minimalist habit tracking application built with React Native and Expo Router. Track your daily habits, visualize your progress, and build a better life one habit at a time.

![Habit Tracker App](https://img.shields.io/badge/Platform-React%20Native-brightgreen)
![Expo](https://img.shields.io/badge/Expo-4630EB?logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)

## ✨ Features

### 🏠 Home Screen
- **Streak Counter**: Prominently displays your current streak with fire animation
- **Value Added to Life**: Progress indicator showing overall improvement
- **Habit Cards**: Beautiful card-based layout for different habit categories
- **Quick Add**: Easy habit creation with category selection
- **Interactive Cards**: Tap to complete/uncomplete, long press to delete

### 📊 Charts Screen
- **Progress Visualization**: Line charts resembling stock market graphs
- **Category Filtering**: Dropdown to filter by specific habit categories
- **Time Range Selection**: View progress by week, month, or year
- **Performance Metrics**: Percentage improvements for each category
- **Smooth Animations**: Animated chart transitions

### 📚 Templates Screen
- **Pre-built Templates**: 6 carefully curated habit collections
  - Sports & Fitness
  - Education & Learning
  - Finance & Money
  - Work & Productivity
  - Health & Wellness
  - Personal Development
- **One-tap Setup**: Apply entire template with single tap
- **Template Preview**: See included habits before applying

### 👤 Profile Screen
- **User Profile**: Customizable name and avatar
- **Statistics Dashboard**: Key metrics and achievements
- **Theme Toggle**: Seamless dark/light mode switching
- **Data Management**: Export and backup functionality
- **Settings**: Comprehensive app preferences

## 🎨 Design Features

### Modern UI/UX
- **Minimalist Design**: Clean, spacious interface with modern typography
- **Glassmorphism Effects**: Subtle transparency and blur effects
- **Smooth Animations**: 60fps animations using React Native Reanimated
- **Responsive Design**: Adapts to different screen sizes
- **Accessible**: High contrast ratios and clear visual hierarchy

### Theme System
- **Dual Themes**: Comprehensive light and dark theme support
- **Smooth Transitions**: Animated theme switching
- **Consistent Colors**: Carefully chosen color palette
- **System Integration**: Follows device theme preferences

## 🛠 Tech Stack

- **React Native** with **Expo Router** for navigation
- **TypeScript** for type safety and better development experience
- **React Native Reanimated** for smooth 60fps animations
- **Expo Vector Icons** for consistent iconography
- **AsyncStorage** for local data persistence
- **React Native Chart Kit** for beautiful data visualizations
- **React Native SVG** for scalable vector graphics

## 📱 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional but recommended)
- iOS Simulator (for iOS development)
- Android Studio & Android Emulator (for Android development)

### Getting Started

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd habit-tracker-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npx expo start
   ```

4. **Run on your preferred platform**
   - **iOS Simulator**: Press `i` in the terminal or scan QR code with Camera app
   - **Android Emulator**: Press `a` in the terminal or scan QR code with Expo Go
   - **Web**: Press `w` in the terminal or visit http://localhost:8083

## 📂 Project Structure

```
src/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Home screen
│   │   ├── charts.tsx         # Charts & analytics
│   │   ├── templates.tsx      # Habit templates
│   │   └── profile.tsx        # User profile & settings
│   ├── _layout.tsx            # Root layout with providers
│   └── +not-found.tsx         # 404 screen
├── components/
│   ├── HabitCard.tsx          # Individual habit display
│   ├── StreakCounter.tsx      # Streak display component
│   ├── ProgressChart.tsx      # Chart visualization
│   └── TemplateCard.tsx       # Template selection card
├── hooks/
│   ├── useTheme.ts            # Theme management
│   ├── useHabits.ts           # Habit data management
│   └── useStats.ts            # Statistics calculations
├── types/
│   └── index.ts               # TypeScript definitions
└── utils/
    ├── storage.ts             # AsyncStorage utilities
    ├── theme.ts               # Theme definitions
    └── templates.ts           # Pre-built habit templates
```

## 🔧 Key Components

### Data Management
- **Habit Interface**: Comprehensive habit data structure
- **Local Storage**: Persistent data using AsyncStorage
- **Statistics Calculation**: Real-time progress tracking
- **Data Export**: Backup and sharing functionality

### Theme System
- **Dynamic Theming**: Runtime theme switching
- **Color Consistency**: Unified color palette
- **Typography Scale**: Responsive text sizing
- **Shadow System**: Consistent elevation effects

### Animation System
- **Micro-interactions**: Button press feedback
- **Page Transitions**: Smooth screen changes
- **Chart Animations**: Animated data visualization
- **Gesture Support**: Swipe and tap interactions

## 📊 Data Structure

```typescript
interface Habit {
  id: string;
  name: string;
  category: 'sports' | 'study' | 'finance' | 'work' | 'health' | 'personal';
  streak: number;
  completedDates: string[];
  target: number;
  progress: number;
  icon: string;
  color: string;
  createdAt: string;
}

interface UserStats {
  totalStreak: number;
  valueAdded: number;
  categoryProgress: Record<string, number>;
  totalHabits: number;
  completedToday: number;
}
```

## 🎯 Usage Guide

### Creating Habits
1. Navigate to Home screen
2. Tap the **+** button next to any category
3. Enter habit name and select category
4. Tap **Add** to create the habit

### Using Templates
1. Go to Templates screen
2. Browse available template collections
3. Tap **Select** on desired template
4. Confirm to add all habits from template

### Tracking Progress
1. Tap habit cards to mark as complete/incomplete
2. View charts on Charts screen for detailed analytics
3. Filter by category and time range for specific insights

### Customization
1. Open Profile screen
2. Toggle dark/light theme
3. Edit profile information
4. Export data for backup

## 🚀 Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# For Android
npx expo build:android

# For iOS
npx expo build:ios

# For Web
npx expo build:web
```

### Environment Setup
- Ensure you have the latest Expo CLI
- Install platform-specific development tools
- Configure signing certificates for app store deployment

## 🔮 Future Enhancements

- [ ] Habit reminders and notifications
- [ ] Social features and habit sharing
- [ ] Advanced analytics with insights
- [ ] Habit streaks leaderboard
- [ ] Custom habit categories
- [ ] Cloud sync across devices
- [ ] Widget support for home screen
- [ ] Apple Health / Google Fit integration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team** for the amazing development platform
- **React Native Community** for powerful tools and libraries
- **Design Inspiration** from modern habit tracking apps
- **Open Source Contributors** for the packages used in this project

---

**Built with ❤️ using React Native and Expo**

For support or questions, please open an issue on GitHub.
