# 📚 Smart Study Planner

> A comprehensive web-based study planner application that helps students organize subjects, manage schedules, track progress, and improve productivity.

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![LocalStorage](https://img.shields.io/badge/LocalStorage-4285F4?style=for-the-badge&logo=google-chrome&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

## 🚀 Live Demo

[View Live Demo](https://smart-study-planner-puce.vercel.app/)

## ✨ Features

### 1. Dashboard
- Overview of total subjects, pending tasks, and completed tasks
- Today's study hours calculation
- Upcoming deadlines with alerts
- Today's schedule display
- Real-time statistics

### 2. Subject Management
- Add, edit, and delete subjects
- Set subject priorities (High, Medium, Low)
- Custom color coding for each subject
- Teacher name assignment
- Visual priority badges

### 3. Schedule Planner
- Create daily and weekly timetables
- Time conflict detection and prevention
- Subject-specific study sessions
- Topic/lesson notes for each session
- Organized by day of the week
- Automatic study hours calculation

### 4. Task Manager
- Add assignments, exams, projects, and reading tasks
- Set deadlines with date picker
- Task descriptions and notes
- Filter by: All, Pending, or Completed
- Mark tasks as complete/incomplete
- Overdue and upcoming task alerts
- Automatic deadline warnings (3 days before due)
- Color-coded by subject

### 5. Progress Analytics
- Task completion rate percentage
- Total study hours across all schedules
- Most studied subject identification
- Weekly task count
- Subject-wise progress bars
- Performance insights and recommendations
- Automatic analysis and suggestions

### 6. Settings
- **Theme Selection**: Blue, Green, Purple, Orange
- **Dark Mode**: Toggle between light and dark themes
- **Deadline Reminders**: Enable/disable notifications
- **Reminder Configuration**: Set days before deadline (1-7 days)
- **Data Export**: Download all data as JSON backup
- **Data Import**: Restore from previous backup
- **Reset All Data**: Clear all subjects, schedules, and tasks

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Grid, Flexbox), Vanilla JavaScript
- **Icons**: Font Awesome 6.4.0
- **Storage**: Browser LocalStorage API
- **Design**: Clean SaaS-style UI with responsive design

## 🎯 Key Features Checklist

- ✅ **Dashboard**: Overview statistics and today's schedule
- ✅ **Subject Management**: Add, edit, delete with priority levels
- ✅ **Schedule Planner**: Weekly timetable with conflict detection
- ✅ **Task Manager**: Assignments, exams, projects with deadlines
- ✅ **Progress Analytics**: Completion rates and performance insights
- ✅ **Settings Panel**: Themes, dark mode, data management
- ✅ **Data Persistence**: All data saved in LocalStorage
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Toast Notifications**: User feedback for all actions
- ✅ **Export/Import**: Backup and restore functionality

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/rohit-2059/smart-study-planner.git
   cd smart-study-planner
   ```

2. **Open in browser**
   ```bash
   open index.html
   # OR simply double-click index.html
   ```

3. **Start using the application**
   - Add your subjects
   - Create study schedules
   - Add tasks and deadlines
   - Track your progress!

## 📱 Usage Guide

1. **Open the Application**: Simply open `index.html` in any modern web browser

2. **Add Subjects**:
   - Navigate to "Subjects" section
   - Fill in subject name, teacher, priority, and color
   - Click "Add Subject"

3. **Create Schedule**:
   - Go to "Schedule" section
   - Select subject, day, start time, and end time
   - Add optional topic/lesson notes
   - System will detect time conflicts automatically

4. **Manage Tasks**:
   - Visit "Tasks" section
   - Enter task title, select subject and type
   - Set deadline and description
   - Filter tasks by status
   - Mark tasks complete when done

5. **View Analytics**:
   - Check "Analytics" section for insights
   - See completion rates and study patterns
   - Get personalized recommendations

6. **Customize Settings**:
   - Go to "Settings" to personalize
   - Choose theme and enable dark mode
   - Configure deadline reminders
   - Export/import or reset data

## 📁 File Structure

```
Smart Study Planner/
├── 📄 index.html          # Main application structure
├── 🎨 styles.css          # Complete styling and responsive design  
├── ⚡ script.js           # JavaScript logic and LocalStorage handling
└── 📋 README.md           # Project documentation
```

⭐ **Star this repository if you found it helpful!** ⭐
