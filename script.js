/* =============================================
   Smart Study Planner - JavaScript
   ============================================= */

// =============================================
// Data Management (LocalStorage)
// =============================================

const STORAGE_KEYS = {
    SUBJECTS: 'studyPlanner_subjects',
    SCHEDULE: 'studyPlanner_schedule',
    TASKS: 'studyPlanner_tasks',
    SETTINGS: 'studyPlanner_settings'
};

// Initialize default data structure
const defaultSettings = {
    theme: 'light',
    color: 'blue',
    reminders: true,
    reminderDays: 3
};

// Data getters
function getSubjects() {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : [];
}

function getSchedule() {
    const data = localStorage.getItem(STORAGE_KEYS.SCHEDULE);
    return data ? JSON.parse(data) : [];
}

function getTasks() {
    const data = localStorage.getItem(STORAGE_KEYS.TASKS);
    return data ? JSON.parse(data) : [];
}

function getSettings() {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : { ...defaultSettings };
}

// Data setters
function saveSubjects(subjects) {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
}

function saveSchedule(schedule) {
    localStorage.setItem(STORAGE_KEYS.SCHEDULE, JSON.stringify(schedule));
}

function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// =============================================
// Toast Notifications
// =============================================

function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-circle',
        info: 'fa-info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas ${icons[type]} toast-icon"></i>
        <span class="toast-message">${message}</span>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// =============================================
// Navigation
// =============================================

const navItems = document.querySelectorAll('.nav-item');
const sections = document.querySelectorAll('.section');

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = item.dataset.section;
        
        // Update active nav item
        navItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');
        
        // Show active section
        sections.forEach(section => section.classList.remove('active'));
        document.getElementById(sectionId).classList.add('active');
        
        // Close mobile sidebar
        closeMobileSidebar();
        
        // Refresh section data
        refreshSection(sectionId);
    });
});

function refreshSection(sectionId) {
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'subjects':
            renderSubjectsList();
            break;
        case 'schedule':
            updateScheduleDropdown();
            renderSchedule();
            break;
        case 'tasks':
            updateTaskDropdown();
            renderTasks();
            break;
        case 'analytics':
            updateAnalytics();
            break;
    }
}

// =============================================
// Mobile Navigation
// =============================================

const menuToggle = document.getElementById('menuToggle');
const sidebar = document.getElementById('sidebar');

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'sidebar-overlay';
document.body.appendChild(overlay);

menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    overlay.classList.toggle('active');
});

overlay.addEventListener('click', closeMobileSidebar);

function closeMobileSidebar() {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
}

// =============================================
// Theme Management
// =============================================

const themeToggle = document.getElementById('themeToggle');
const themeToggleMobile = document.getElementById('themeToggleMobile');
const darkModeToggle = document.getElementById('darkModeToggle');
const themeColors = document.querySelectorAll('.theme-color');

function applyTheme() {
    const settings = getSettings();
    
    // Apply dark mode
    if (settings.theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        darkModeToggle.checked = true;
        updateThemeIcons(true);
    } else {
        document.body.removeAttribute('data-theme');
        darkModeToggle.checked = false;
        updateThemeIcons(false);
    }
    
    // Apply color theme
    document.body.setAttribute('data-color', settings.color);
    themeColors.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.theme === settings.color);
    });
    
    // Apply reminder settings
    document.getElementById('reminderToggle').checked = settings.reminders;
    document.getElementById('reminderDays').value = settings.reminderDays;
}

function updateThemeIcons(isDark) {
    const icon = isDark ? 'fa-sun' : 'fa-moon';
    themeToggle.innerHTML = `<i class="fas ${icon}"></i>`;
    themeToggleMobile.innerHTML = `<i class="fas ${icon}"></i>`;
}

function toggleDarkMode() {
    const settings = getSettings();
    settings.theme = settings.theme === 'dark' ? 'light' : 'dark';
    saveSettings(settings);
    applyTheme();
}

themeToggle.addEventListener('click', toggleDarkMode);
themeToggleMobile.addEventListener('click', toggleDarkMode);
darkModeToggle.addEventListener('change', toggleDarkMode);

themeColors.forEach(btn => {
    btn.addEventListener('click', () => {
        const settings = getSettings();
        settings.color = btn.dataset.theme;
        saveSettings(settings);
        applyTheme();
        showToast('Theme color updated', 'success');
    });
});

// Reminder settings
document.getElementById('reminderToggle').addEventListener('change', (e) => {
    const settings = getSettings();
    settings.reminders = e.target.checked;
    saveSettings(settings);
    showToast(`Reminders ${settings.reminders ? 'enabled' : 'disabled'}`, 'info');
});

document.getElementById('reminderDays').addEventListener('change', (e) => {
    const settings = getSettings();
    settings.reminderDays = parseInt(e.target.value);
    saveSettings(settings);
    showToast(`Reminder set to ${settings.reminderDays} days before deadline`, 'info');
});

// =============================================
// Subject Management
// =============================================

const subjectForm = document.getElementById('subjectForm');
const subjectsList = document.getElementById('subjectsList');

subjectForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('subjectName').value.trim();
    const teacher = document.getElementById('teacherName').value.trim();
    const priority = document.getElementById('subjectPriority').value;
    const color = document.getElementById('subjectColor').value;
    
    if (!name) {
        showToast('Please enter a subject name', 'error');
        return;
    }
    
    const subjects = getSubjects();
    
    // Check for duplicate
    if (subjects.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        showToast('Subject already exists', 'error');
        return;
    }
    
    const newSubject = {
        id: generateId(),
        name,
        teacher,
        priority,
        color
    };
    
    subjects.push(newSubject);
    saveSubjects(subjects);
    
    subjectForm.reset();
    document.getElementById('subjectColor').value = '#4A90A4';
    
    renderSubjectsList();
    updateScheduleDropdown();
    updateTaskDropdown();
    updateDashboard();
    
    showToast('Subject added successfully', 'success');
});

function renderSubjectsList() {
    const subjects = getSubjects();
    
    if (subjects.length === 0) {
        subjectsList.innerHTML = '<p class="empty-state">No subjects added yet</p>';
        return;
    }
    
    subjectsList.innerHTML = subjects.map(subject => `
        <div class="subject-item" style="border-left-color: ${subject.color}">
            <div class="subject-color" style="background-color: ${subject.color}"></div>
            <div class="subject-info">
                <div class="subject-name">${escapeHtml(subject.name)}</div>
                ${subject.teacher ? `<div class="subject-teacher"><i class="fas fa-user"></i> ${escapeHtml(subject.teacher)}</div>` : ''}
            </div>
            <div class="subject-meta">
                <span class="priority-badge ${subject.priority}">${subject.priority}</span>
                <div class="subject-actions">
                    <button class="btn-icon" onclick="editSubject('${subject.id}')" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon danger" onclick="deleteSubject('${subject.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function editSubject(id) {
    const subjects = getSubjects();
    const subject = subjects.find(s => s.id === id);
    
    if (!subject) return;
    
    document.getElementById('editSubjectId').value = id;
    document.getElementById('editSubjectName').value = subject.name;
    document.getElementById('editTeacherName').value = subject.teacher || '';
    document.getElementById('editSubjectPriority').value = subject.priority;
    document.getElementById('editSubjectColor').value = subject.color;
    
    document.getElementById('editSubjectModal').classList.add('active');
}

document.getElementById('editSubjectForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('editSubjectId').value;
    const subjects = getSubjects();
    const index = subjects.findIndex(s => s.id === id);
    
    if (index === -1) return;
    
    subjects[index] = {
        ...subjects[index],
        name: document.getElementById('editSubjectName').value.trim(),
        teacher: document.getElementById('editTeacherName').value.trim(),
        priority: document.getElementById('editSubjectPriority').value,
        color: document.getElementById('editSubjectColor').value
    };
    
    saveSubjects(subjects);
    closeEditSubjectModal();
    renderSubjectsList();
    updateScheduleDropdown();
    updateTaskDropdown();
    renderSchedule();
    renderTasks();
    
    showToast('Subject updated successfully', 'success');
});

function closeEditSubjectModal() {
    document.getElementById('editSubjectModal').classList.remove('active');
}

document.getElementById('closeSubjectModal').addEventListener('click', closeEditSubjectModal);
document.getElementById('cancelSubjectEdit').addEventListener('click', closeEditSubjectModal);

function deleteSubject(id) {
    showConfirmModal(
        'Delete Subject',
        'Are you sure you want to delete this subject? All related schedule sessions and tasks will also be deleted.',
        () => {
            let subjects = getSubjects();
            subjects = subjects.filter(s => s.id !== id);
            saveSubjects(subjects);
            
            // Also delete related schedule and tasks
            let schedule = getSchedule();
            schedule = schedule.filter(s => s.subjectId !== id);
            saveSchedule(schedule);
            
            let tasks = getTasks();
            tasks = tasks.filter(t => t.subjectId !== id);
            saveTasks(tasks);
            
            renderSubjectsList();
            updateScheduleDropdown();
            updateTaskDropdown();
            renderSchedule();
            renderTasks();
            updateDashboard();
            
            showToast('Subject deleted', 'success');
        }
    );
}

// =============================================
// Schedule Management
// =============================================

const scheduleForm = document.getElementById('scheduleForm');
const scheduleContent = document.getElementById('scheduleContent');
const scheduleTabs = document.querySelectorAll('.tab-btn');
let currentDay = 'monday';

scheduleTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        scheduleTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentDay = tab.dataset.day;
        renderSchedule();
    });
});

function updateScheduleDropdown() {
    const subjects = getSubjects();
    const dropdown = document.getElementById('scheduleSubject');
    
    dropdown.innerHTML = '<option value="">Select Subject</option>' +
        subjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
}

scheduleForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const subjectId = document.getElementById('scheduleSubject').value;
    const day = document.getElementById('scheduleDay').value;
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const topic = document.getElementById('scheduleTopic').value.trim();
    
    if (!subjectId || !startTime || !endTime) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    if (startTime >= endTime) {
        showToast('End time must be after start time', 'error');
        return;
    }
    
    const schedule = getSchedule();
    
    // Check for time conflicts
    const conflict = schedule.find(s => 
        s.day === day && 
        ((startTime >= s.startTime && startTime < s.endTime) ||
         (endTime > s.startTime && endTime <= s.endTime) ||
         (startTime <= s.startTime && endTime >= s.endTime))
    );
    
    if (conflict) {
        const subjects = getSubjects();
        const conflictSubject = subjects.find(s => s.id === conflict.subjectId);
        showToast(`Time conflict with ${conflictSubject?.name || 'another session'} (${conflict.startTime} - ${conflict.endTime})`, 'error');
        return;
    }
    
    const newSession = {
        id: generateId(),
        subjectId,
        day,
        startTime,
        endTime,
        topic
    };
    
    schedule.push(newSession);
    saveSchedule(schedule);
    
    scheduleForm.reset();
    
    // Navigate to the day of the new session
    currentDay = day;
    scheduleTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.day === day);
    });
    
    renderSchedule();
    updateDashboard();
    
    showToast('Session added successfully', 'success');
});

function renderSchedule() {
    const schedule = getSchedule().filter(s => s.day === currentDay);
    const subjects = getSubjects();
    
    if (schedule.length === 0) {
        scheduleContent.innerHTML = '<p class="empty-state">No sessions scheduled for this day</p>';
        return;
    }
    
    // Sort by start time
    schedule.sort((a, b) => a.startTime.localeCompare(b.startTime));
    
    scheduleContent.innerHTML = schedule.map(session => {
        const subject = subjects.find(s => s.id === session.subjectId);
        return `
            <div class="schedule-item" style="border-left-color: ${subject?.color || '#4A90A4'}">
                <div class="schedule-time">
                    <span>${formatTime(session.startTime)}</span>
                    <span>to ${formatTime(session.endTime)}</span>
                </div>
                <div class="schedule-info">
                    <div class="schedule-subject">${escapeHtml(subject?.name || 'Unknown Subject')}</div>
                    ${session.topic ? `<div class="schedule-topic">${escapeHtml(session.topic)}</div>` : ''}
                </div>
                <div class="schedule-actions">
                    <button class="btn-icon danger" onclick="deleteSchedule('${session.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function deleteSchedule(id) {
    let schedule = getSchedule();
    schedule = schedule.filter(s => s.id !== id);
    saveSchedule(schedule);
    renderSchedule();
    updateDashboard();
    showToast('Session deleted', 'success');
}

// =============================================
// Task Management
// =============================================

const taskForm = document.getElementById('taskForm');
const tasksList = document.getElementById('tasksList');
const filterBtns = document.querySelectorAll('.filter-btn');
let currentFilter = 'all';

filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

function updateTaskDropdown() {
    const subjects = getSubjects();
    const dropdown = document.getElementById('taskSubject');
    
    dropdown.innerHTML = '<option value="">Select Subject</option>' +
        subjects.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('');
}

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('taskTitle').value.trim();
    const subjectId = document.getElementById('taskSubject').value;
    const type = document.getElementById('taskType').value;
    const deadline = document.getElementById('taskDeadline').value;
    const description = document.getElementById('taskDescription').value.trim();
    
    if (!title || !subjectId || !deadline) {
        showToast('Please fill all required fields', 'error');
        return;
    }
    
    const tasks = getTasks();
    
    const newTask = {
        id: generateId(),
        title,
        subjectId,
        type,
        deadline,
        description,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    saveTasks(tasks);
    
    taskForm.reset();
    renderTasks();
    updateDashboard();
    updateAnalytics();
    
    showToast('Task added successfully', 'success');
});

function renderTasks() {
    let tasks = getTasks();
    const subjects = getSubjects();
    
    // Apply filter
    if (currentFilter === 'pending') {
        tasks = tasks.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        tasks = tasks.filter(t => t.completed);
    }
    
    if (tasks.length === 0) {
        const emptyMessage = currentFilter === 'all' ? 'No tasks added yet' :
            currentFilter === 'pending' ? 'No pending tasks' : 'No completed tasks';
        tasksList.innerHTML = `<p class="empty-state">${emptyMessage}</p>`;
        return;
    }
    
    // Sort by deadline
    tasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
    
    const settings = getSettings();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    tasksList.innerHTML = tasks.map(task => {
        const subject = subjects.find(s => s.id === task.subjectId);
        const deadlineDate = new Date(task.deadline);
        deadlineDate.setHours(0, 0, 0, 0);
        const daysUntil = Math.ceil((deadlineDate - today) / (1000 * 60 * 60 * 24));
        
        let alertHtml = '';
        if (!task.completed) {
            if (daysUntil < 0) {
                alertHtml = `<div class="task-alert overdue"><i class="fas fa-exclamation-triangle"></i> Overdue by ${Math.abs(daysUntil)} day(s)</div>`;
            } else if (daysUntil <= settings.reminderDays && settings.reminders) {
                alertHtml = `<div class="task-alert upcoming"><i class="fas fa-clock"></i> Due in ${daysUntil} day(s)</div>`;
            }
        }
        
        return `
            <div class="task-item ${task.completed ? 'completed' : ''}" style="border-left-color: ${subject?.color || '#4A90A4'}">
                <div class="task-checkbox">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTask('${task.id}')">
                </div>
                <div class="task-info">
                    <div class="task-header">
                        <span class="task-title">${escapeHtml(task.title)}</span>
                        <span class="task-type">${task.type}</span>
                    </div>
                    <div class="task-meta">
                        <span><i class="fas fa-folder"></i> ${escapeHtml(subject?.name || 'Unknown')}</span>
                        <span><i class="fas fa-calendar"></i> ${formatDate(task.deadline)}</span>
                    </div>
                    ${task.description ? `<div class="task-description">${escapeHtml(task.description)}</div>` : ''}
                    ${alertHtml}
                </div>
                <div class="task-actions">
                    <button class="btn-icon danger" onclick="deleteTask('${task.id}')" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function toggleTask(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    
    if (task) {
        task.completed = !task.completed;
        saveTasks(tasks);
        renderTasks();
        updateDashboard();
        updateAnalytics();
        
        showToast(task.completed ? 'Task completed!' : 'Task marked as pending', 'success');
    }
}

function deleteTask(id) {
    let tasks = getTasks();
    tasks = tasks.filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
    updateDashboard();
    updateAnalytics();
    showToast('Task deleted', 'success');
}

// =============================================
// Dashboard
// =============================================

function updateDashboard() {
    const subjects = getSubjects();
    const tasks = getTasks();
    const schedule = getSchedule();
    const settings = getSettings();
    
    // Stats
    document.getElementById('totalSubjects').textContent = subjects.length;
    document.getElementById('pendingTasks').textContent = tasks.filter(t => !t.completed).length;
    document.getElementById('completedTasks').textContent = tasks.filter(t => t.completed).length;
    
    // Today's study hours
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const today = days[new Date().getDay()];
    const todaySessions = schedule.filter(s => s.day === today);
    
    let totalMinutes = 0;
    todaySessions.forEach(session => {
        const start = session.startTime.split(':').map(Number);
        const end = session.endTime.split(':').map(Number);
        totalMinutes += (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    });
    
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    document.getElementById('todayHours').textContent = mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    
    // Upcoming deadlines
    const upcomingDeadlines = document.getElementById('upcomingDeadlines');
    const pendingTasks = tasks.filter(t => !t.completed);
    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    
    const upcoming = pendingTasks
        .filter(t => new Date(t.deadline) >= todayDate)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .slice(0, 5);
    
    if (upcoming.length === 0) {
        upcomingDeadlines.innerHTML = '<p class="empty-state">No upcoming deadlines</p>';
    } else {
        upcomingDeadlines.innerHTML = upcoming.map(task => {
            const subject = subjects.find(s => s.id === task.subjectId);
            const deadlineDate = new Date(task.deadline);
            deadlineDate.setHours(0, 0, 0, 0);
            const daysUntil = Math.ceil((deadlineDate - todayDate) / (1000 * 60 * 60 * 24));
            
            let urgencyClass = 'normal';
            if (daysUntil <= 1) urgencyClass = 'urgent';
            else if (daysUntil <= settings.reminderDays) urgencyClass = 'warning';
            
            return `
                <div class="deadline-item" style="border-left-color: ${subject?.color || '#4A90A4'}">
                    <div class="deadline-info">
                        <div class="deadline-title">${escapeHtml(task.title)}</div>
                        <div class="deadline-subject">${escapeHtml(subject?.name || 'Unknown')}</div>
                    </div>
                    <span class="deadline-date ${urgencyClass}">
                        ${daysUntil === 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                    </span>
                </div>
            `;
        }).join('');
    }
    
    // Today's schedule
    const todaySchedule = document.getElementById('todaySchedule');
    
    if (todaySessions.length === 0) {
        todaySchedule.innerHTML = '<p class="empty-state">No sessions scheduled for today</p>';
    } else {
        const sortedSessions = [...todaySessions].sort((a, b) => a.startTime.localeCompare(b.startTime));
        
        todaySchedule.innerHTML = sortedSessions.map(session => {
            const subject = subjects.find(s => s.id === session.subjectId);
            return `
                <div class="today-schedule-item" style="border-left-color: ${subject?.color || '#4A90A4'}">
                    <span class="today-time">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</span>
                    <div class="today-info">
                        <div class="today-subject">${escapeHtml(subject?.name || 'Unknown')}</div>
                        ${session.topic ? `<div class="today-topic">${escapeHtml(session.topic)}</div>` : ''}
                    </div>
                </div>
            `;
        }).join('');
    }
}

// =============================================
// Analytics
// =============================================

function updateAnalytics() {
    const subjects = getSubjects();
    const tasks = getTasks();
    const schedule = getSchedule();
    
    // Completion rate
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    document.getElementById('completionRate').textContent = `${completionRate}%`;
    
    // Total study hours
    let totalMinutes = 0;
    schedule.forEach(session => {
        const start = session.startTime.split(':').map(Number);
        const end = session.endTime.split(':').map(Number);
        totalMinutes += (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
    });
    
    const totalHours = Math.floor(totalMinutes / 60);
    document.getElementById('totalStudyHours').textContent = `${totalHours}h`;
    
    // Most studied subject
    const subjectHours = {};
    schedule.forEach(session => {
        const start = session.startTime.split(':').map(Number);
        const end = session.endTime.split(':').map(Number);
        const mins = (end[0] * 60 + end[1]) - (start[0] * 60 + start[1]);
        
        if (!subjectHours[session.subjectId]) {
            subjectHours[session.subjectId] = 0;
        }
        subjectHours[session.subjectId] += mins;
    });
    
    let topSubjectId = null;
    let topHours = 0;
    for (const [id, mins] of Object.entries(subjectHours)) {
        if (mins > topHours) {
            topHours = mins;
            topSubjectId = id;
        }
    }
    
    const topSubject = subjects.find(s => s.id === topSubjectId);
    document.getElementById('topSubject').textContent = topSubject ? topSubject.name : '-';
    
    // Weekly tasks
    const today = new Date();
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const weeklyTasks = tasks.filter(t => new Date(t.createdAt) >= weekStart).length;
    document.getElementById('weeklyTasks').textContent = weeklyTasks;
    
    // Subject progress
    const subjectProgress = document.getElementById('subjectProgress');
    
    if (subjects.length === 0) {
        subjectProgress.innerHTML = '<p class="empty-state">Add subjects and tasks to see progress</p>';
    } else {
        subjectProgress.innerHTML = subjects.map(subject => {
            const subjectTasks = tasks.filter(t => t.subjectId === subject.id);
            const completed = subjectTasks.filter(t => t.completed).length;
            const total = subjectTasks.length;
            const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
            
            return `
                <div class="progress-item">
                    <div class="progress-header">
                        <span class="progress-label">${escapeHtml(subject.name)}</span>
                        <span class="progress-value">${completed}/${total} tasks</span>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%; background-color: ${subject.color}"></div>
                    </div>
                </div>
            `;
        }).join('');
    }
    
    // Insights
    const insights = document.getElementById('insights');
    const insightsList = [];
    
    if (completionRate >= 80) {
        insightsList.push({
            type: 'success',
            icon: 'fa-trophy',
            text: 'Excellent! You have completed over 80% of your tasks. Keep up the great work!'
        });
    } else if (completionRate >= 50) {
        insightsList.push({
            type: 'info',
            icon: 'fa-chart-line',
            text: `You're making good progress with ${completionRate}% tasks completed. Stay focused!`
        });
    } else if (totalTasks > 0) {
        insightsList.push({
            type: 'warning',
            icon: 'fa-exclamation-circle',
            text: 'Consider prioritizing your tasks. Try completing at least one task today.'
        });
    }
    
    const pendingCount = tasks.filter(t => !t.completed).length;
    if (pendingCount > 5) {
        insightsList.push({
            type: 'warning',
            icon: 'fa-list-check',
            text: `You have ${pendingCount} pending tasks. Consider breaking them into smaller chunks.`
        });
    }
    
    if (topSubject && totalMinutes > 0) {
        const topPercent = Math.round((topHours / totalMinutes) * 100);
        insightsList.push({
            type: 'info',
            icon: 'fa-book',
            text: `${topSubject.name} takes ${topPercent}% of your study time. Balance your schedule if needed.`
        });
    }
    
    if (schedule.length === 0) {
        insightsList.push({
            type: 'info',
            icon: 'fa-calendar-plus',
            text: 'Create a study schedule to organize your learning time better.'
        });
    }
    
    if (insightsList.length === 0) {
        insights.innerHTML = '<p class="empty-state">Complete more tasks to get insights</p>';
    } else {
        insights.innerHTML = insightsList.map(insight => `
            <div class="insight-item">
                <div class="insight-icon ${insight.type}">
                    <i class="fas ${insight.icon}"></i>
                </div>
                <span class="insight-text">${insight.text}</span>
            </div>
        `).join('');
    }
}

// =============================================
// Settings - Data Management
// =============================================

// Export data
document.getElementById('exportBtn').addEventListener('click', () => {
    const data = {
        subjects: getSubjects(),
        schedule: getSchedule(),
        tasks: getTasks(),
        settings: getSettings(),
        exportedAt: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    
    showToast('Data exported successfully', 'success');
});

// Import data
document.getElementById('importBtn').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const data = JSON.parse(event.target.result);
            
            if (data.subjects) saveSubjects(data.subjects);
            if (data.schedule) saveSchedule(data.schedule);
            if (data.tasks) saveTasks(data.tasks);
            if (data.settings) saveSettings(data.settings);
            
            applyTheme();
            renderSubjectsList();
            updateScheduleDropdown();
            updateTaskDropdown();
            renderSchedule();
            renderTasks();
            updateDashboard();
            updateAnalytics();
            
            showToast('Data imported successfully', 'success');
        } catch (err) {
            showToast('Invalid backup file', 'error');
        }
    };
    reader.readAsText(file);
    e.target.value = '';
});

// Reset data
document.getElementById('resetBtn').addEventListener('click', () => {
    showConfirmModal(
        'Reset All Data',
        'This will permanently delete all your subjects, schedules, tasks, and settings. This action cannot be undone.',
        () => {
            localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
            localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
            localStorage.removeItem(STORAGE_KEYS.TASKS);
            localStorage.removeItem(STORAGE_KEYS.SETTINGS);
            
            applyTheme();
            renderSubjectsList();
            updateScheduleDropdown();
            updateTaskDropdown();
            renderSchedule();
            renderTasks();
            updateDashboard();
            updateAnalytics();
            
            showToast('All data has been reset', 'success');
        }
    );
});

// =============================================
// Confirm Modal
// =============================================

const confirmModal = document.getElementById('confirmModal');
let confirmCallback = null;

function showConfirmModal(title, message, callback) {
    document.getElementById('confirmTitle').textContent = title;
    document.getElementById('confirmMessage').textContent = message;
    confirmCallback = callback;
    confirmModal.classList.add('active');
}

function closeConfirmModal() {
    confirmModal.classList.remove('active');
    confirmCallback = null;
}

document.getElementById('closeConfirmModal').addEventListener('click', closeConfirmModal);
document.getElementById('cancelConfirm').addEventListener('click', closeConfirmModal);

document.getElementById('confirmAction').addEventListener('click', () => {
    if (confirmCallback) {
        confirmCallback();
    }
    closeConfirmModal();
});

// =============================================
// Utility Functions
// =============================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(time) {
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${minutes} ${ampm}`;
}

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// =============================================
// Initialize Application
// =============================================

function init() {
    applyTheme();
    renderSubjectsList();
    updateScheduleDropdown();
    updateTaskDropdown();
    renderSchedule();
    renderTasks();
    updateDashboard();
    updateAnalytics();
    
    // Set minimum date for task deadline
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('taskDeadline').setAttribute('min', today);
}

// Run on DOM load
document.addEventListener('DOMContentLoaded', init);
