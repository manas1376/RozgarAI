import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import {
  users, profiles, mockJobs, mockApplications,
  mockNotifications, skillGapData, activityLog
} from './data/mockData.js';

const app = express();
app.use(cors());
app.use(express.json());

// In-memory state
let applicationsDB = [...mockApplications];
let notificationsDB = [...mockNotifications];
let activityDB = [...activityLog];
let profilesDB = { ...profiles };
let tokensDB = {};

// ─── AUTH ───────────────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const token = uuidv4();
  tokensDB[token] = user.id;
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
});

app.post('/api/auth/signup', (req, res) => {
  const { name, email, password } = req.body;
  if (users.find(u => u.email === email)) return res.status(400).json({ error: 'Email exists' });
  const newUser = { id: uuidv4(), email, password, name, createdAt: new Date().toISOString() };
  users.push(newUser);
  const token = uuidv4();
  tokensDB[token] = newUser.id;
  res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
});

app.post('/api/auth/forgot-password', (req, res) => {
  res.json({ message: 'Reset link sent to your email' });
});

// ─── AUTH MIDDLEWARE ────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token || !tokensDB[token]) return res.status(401).json({ error: 'Unauthorized' });
  req.userId = tokensDB[token];
  next();
};

// ─── PROFILE ────────────────────────────────────────────────────────
app.get('/api/profile', auth, (req, res) => {
  const profile = profilesDB[req.userId] || null;
  res.json(profile);
});

app.put('/api/profile', auth, (req, res) => {
  profilesDB[req.userId] = { ...profilesDB[req.userId], ...req.body, userId: req.userId };
  res.json(profilesDB[req.userId]);
});

// ─── DASHBOARD ──────────────────────────────────────────────────────
app.get('/api/dashboard', auth, (req, res) => {
  const apps = applicationsDB;
  const stats = {
    totalApplications: apps.length,
    responses: apps.filter(a => a.status === 'Response' || a.status === 'Interview').length,
    interviews: apps.filter(a => a.status === 'Interview').length,
    pending: apps.filter(a => a.status === 'Pending').length,
    atsScore: profilesDB[req.userId]?.atsScore || 74,
    topMatchScore: Math.max(...mockJobs.map(j => j.matchScore)),
    responseRate: Math.round((apps.filter(a => ['Response','Interview'].includes(a.status)).length / apps.length) * 100),
  };
  const weeklyData = [
    { day: 'Mon', applied: 3, responses: 1 },
    { day: 'Tue', applied: 5, responses: 2 },
    { day: 'Wed', applied: 2, responses: 0 },
    { day: 'Thu', applied: 7, responses: 3 },
    { day: 'Fri', applied: 4, responses: 1 },
    { day: 'Sat', applied: 1, responses: 2 },
    { day: 'Sun', applied: 0, responses: 1 },
  ];
  const platformStats = [
    { platform: 'LinkedIn', count: 12, color: '#0A66C2' },
    { platform: 'Naukri', count: 8, color: '#FF6600' },
    { platform: 'Indeed', count: 5, color: '#003A9B' },
    { platform: 'Glassdoor', count: 4, color: '#0CAA41' },
  ];
  const statusDist = [
    { status: 'Pending', count: apps.filter(a => a.status === 'Pending').length, color: '#F59E0B' },
    { status: 'Applied', count: apps.filter(a => a.status === 'Applied').length, color: '#6366F1' },
    { status: 'Response', count: apps.filter(a => a.status === 'Response').length, color: '#3B82F6' },
    { status: 'Interview', count: apps.filter(a => a.status === 'Interview').length, color: '#10B981' },
  ];
  res.json({ stats, weeklyData, platformStats, statusDist, recentActivity: activityDB.slice(0, 6) });
});

// ─── JOBS ────────────────────────────────────────────────────────────
app.get('/api/jobs', auth, (req, res) => {
  let jobs = [...mockJobs];
  const { platform, workMode, minMatch, decision, search } = req.query;
  if (platform) jobs = jobs.filter(j => j.platform === platform);
  if (workMode) jobs = jobs.filter(j => j.workMode === workMode);
  if (decision) jobs = jobs.filter(j => j.decision === decision);
  if (minMatch) jobs = jobs.filter(j => j.matchScore >= parseInt(minMatch));
  if (search) jobs = jobs.filter(j =>
    j.title.toLowerCase().includes(search.toLowerCase()) ||
    j.company.toLowerCase().includes(search.toLowerCase())
  );
  jobs.sort((a, b) => b.matchScore - a.matchScore);
  res.json(jobs);
});

app.get('/api/jobs/:id', auth, (req, res) => {
  const job = mockJobs.find(j => j.id === req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  res.json(job);
});

// ─── APPLICATIONS ────────────────────────────────────────────────────
app.get('/api/applications', auth, (req, res) => {
  res.json(applicationsDB);
});

app.post('/api/applications', auth, (req, res) => {
  const newApp = {
    id: uuidv4(),
    ...req.body,
    status: 'Applied',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  applicationsDB.unshift(newApp);
  const notif = {
    id: uuidv4(),
    type: 'applied',
    title: 'Application Submitted ✓',
    message: `Successfully applied to ${newApp.company} – ${newApp.jobTitle}`,
    timestamp: new Date().toISOString(),
    read: false,
    icon: 'check'
  };
  notificationsDB.unshift(notif);
  activityDB.unshift({
    id: uuidv4(),
    action: `Auto-applied to ${newApp.company} – ${newApp.jobTitle}`,
    timestamp: new Date().toISOString(),
    type: 'apply'
  });
  res.json(newApp);
});

app.patch('/api/applications/:id', auth, (req, res) => {
  const idx = applicationsDB.findIndex(a => a.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  applicationsDB[idx] = { ...applicationsDB[idx], ...req.body, updatedAt: new Date().toISOString() };
  res.json(applicationsDB[idx]);
});

// ─── RESUME ──────────────────────────────────────────────────────────
app.post('/api/resume/score', auth, (req, res) => {
  setTimeout(() => {
    res.json({
      score: 74,
      generatedScore: 89,
      improvements: [
        { category: "Keywords", issue: "Missing ATS keywords: 'scalable', 'microservices', 'agile'", impact: "+8 pts" },
        { category: "Formatting", issue: "Use standard section headers (Experience, Education, Skills)", impact: "+4 pts" },
        { category: "Quantification", issue: "Add metrics to 2 more experience bullets", impact: "+6 pts" },
        { category: "Summary", issue: "Include target role keywords in professional summary", impact: "+5 pts" },
        { category: "Skills", issue: "List skills in order of relevance to target roles", impact: "+3 pts" }
      ],
      aiGeneratedResume: {
        sections: ["Professional Summary", "Technical Skills", "Work Experience", "Projects", "Education", "Certifications"]
      }
    });
  }, 1500);
});

app.post('/api/resume/customize', auth, (req, res) => {
  const { jobId } = req.body;
  const job = mockJobs.find(j => j.id === jobId);
  setTimeout(() => {
    res.json({
      jobTitle: job?.title || 'Target Role',
      company: job?.company || 'Target Company',
      customizations: [
        `Highlighted ${job?.skills?.[0] || 'React'} experience prominently`,
        `Added keyword: "${job?.skills?.[1] || 'TypeScript'}" to summary`,
        `Reordered experience bullets to match JD priorities`,
        `Added missing keyword: "${job?.skills?.[2] || 'GraphQL'}"`,
        `Tailored project descriptions for ${job?.company || 'target'} industry`
      ],
      newScore: Math.min(97, (job?.matchScore || 80) + 5),
      resumeId: uuidv4()
    });
  }, 2000);
});

// ─── AUTO APPLY ──────────────────────────────────────────────────────
app.post('/api/apply/simulate', auth, (req, res) => {
  const { jobId } = req.body;
  const job = mockJobs.find(j => j.id === jobId);
  const steps = [
    { step: 1, action: "Loading job application portal", status: "done", delay: 500 },
    { step: 2, action: "Filling personal details from profile", status: "done", delay: 1000 },
    { step: 3, action: "Uploading customized resume", status: "done", delay: 1500 },
    { step: 4, action: "Answering screening questions", status: "done", delay: 2000 },
    { step: 5, action: "Submitting application", status: "done", delay: 2500 },
  ];
  const newApp = {
    id: uuidv4(),
    jobId,
    jobTitle: job?.title || 'Unknown',
    company: job?.company || 'Unknown',
    platform: job?.platform || 'LinkedIn',
    status: 'Applied',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    resumeVersion: `${job?.company}_Customized_v1`,
    matchScore: job?.matchScore || 75,
    notes: 'Applied via ApplyAI Auto-Apply Agent'
  };
  applicationsDB.unshift(newApp);
  notificationsDB.unshift({
    id: uuidv4(),
    type: 'applied',
    title: 'Auto-Apply Successful! ✓',
    message: `Applied to ${job?.company} – ${job?.title}`,
    timestamp: new Date().toISOString(),
    read: false,
    icon: 'check'
  });
  res.json({ success: true, steps, application: newApp });
});

// ─── NOTIFICATIONS ───────────────────────────────────────────────────
app.get('/api/notifications', auth, (req, res) => {
  res.json(notificationsDB);
});

app.patch('/api/notifications/:id/read', auth, (req, res) => {
  const n = notificationsDB.find(n => n.id === req.params.id);
  if (n) n.read = true;
  res.json({ success: true });
});

app.patch('/api/notifications/read-all', auth, (req, res) => {
  notificationsDB.forEach(n => n.read = true);
  res.json({ success: true });
});

// ─── SKILL GAP ───────────────────────────────────────────────────────
app.get('/api/skill-gap', auth, (req, res) => {
  res.json(skillGapData);
});

// ─── ACTIVITY ─────────────────────────────────────────────────────────
app.get('/api/activity', auth, (req, res) => {
  res.json(activityDB);
});

const PORT = 3001;
app.listen(PORT, () => console.log(`✅ ApplyAI API running on http://localhost:${PORT}`));
