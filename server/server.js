import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), platform: 'CogniCare', tagline: 'when memories meet care' });
});

// ================= AUTHENTICATION ROUTES =================
app.post('/api/auth/register', (req, res) => {
  const { fullName, email, phone, password, preferredLanguage } = req.body;

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Please provide full name, email, and password.' });
  }

  const existing = db.findCaretakerByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'An account with this email address already exists.' });
  }

  const newCaretaker = db.createCaretaker({
    fullName,
    email,
    phone: phone || '',
    passwordHash: password, // In production, bcrypt hash
    preferredLanguage: preferredLanguage || 'en'
  });

  // Create initial linked patient record template
  const initialPatient = db.savePatient({
    caretakerId: newCaretaker.id,
    name: 'Family Elder',
    age: 72,
    gender: 'Female',
    preferredLanguage: preferredLanguage || 'en',
    state: 'Assam',
    setupCompleted: false,
    questionnaireCompleted: false
  });

  res.status(201).json({
    message: 'Account successfully created! Welcome to CogniCare.',
    caretaker: {
      id: newCaretaker.id,
      fullName: newCaretaker.fullName,
      email: newCaretaker.email,
      phone: newCaretaker.phone,
      preferredLanguage: newCaretaker.preferredLanguage
    },
    patient: initialPatient,
    token: `memroots_token_${newCaretaker.id}`
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const caretaker = db.findCaretakerByEmail(email);
  if (!caretaker || caretaker.passwordHash !== password) {
    return res.status(401).json({ error: 'Invalid email or password. Please try again.' });
  }

  const patient = db.findPatientByCaretakerId(caretaker.id);

  res.json({
    message: 'Welcome back!',
    caretaker: {
      id: caretaker.id,
      fullName: caretaker.fullName,
      email: caretaker.email,
      phone: caretaker.phone,
      preferredLanguage: caretaker.preferredLanguage
    },
    patient: patient || null,
    token: `memroots_token_${caretaker.id}`
  });
});

// Quick 1-Click Demo Login for Caretaker
app.post('/api/auth/demo-login', (req, res) => {
  const caretaker = db.findCaretakerById('caretaker_demo_1');
  if (!caretaker) {
    db.resetToDemo();
  }
  const demoCaretaker = db.findCaretakerById('caretaker_demo_1');
  const patient = db.findPatientByCaretakerId(demoCaretaker.id);

  res.json({
    message: 'Signed in as Demo Caretaker (Dr. Ananya Sharma)',
    caretaker: {
      id: demoCaretaker.id,
      fullName: demoCaretaker.fullName,
      email: demoCaretaker.email,
      phone: demoCaretaker.phone,
      preferredLanguage: demoCaretaker.preferredLanguage
    },
    patient: patient,
    token: `memroots_token_${demoCaretaker.id}`
  });
});

app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer memroots_token_')) {
    return res.status(401).json({ error: 'Unauthorized session' });
  }

  const caretakerId = authHeader.replace('Bearer memroots_token_', '');
  const caretaker = db.findCaretakerById(caretakerId);

  if (!caretaker) {
    return res.status(401).json({ error: 'Session expired or user not found' });
  }

  const patient = db.findPatientByCaretakerId(caretaker.id);

  res.json({
    caretaker: {
      id: caretaker.id,
      fullName: caretaker.fullName,
      email: caretaker.email,
      phone: caretaker.phone,
      preferredLanguage: caretaker.preferredLanguage
    },
    patient: patient
  });
});

// ================= PATIENT ROUTES =================
app.get('/api/patient/:caretakerId', (req, res) => {
  const patient = db.findPatientByCaretakerId(req.params.caretakerId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient profile not found' });
  }
  res.json(patient);
});

app.post('/api/patient/setup', (req, res) => {
  const {
    caretakerId,
    name,
    age,
    gender,
    preferredLanguage,
    state,
    relationship,
    favoriteActivities,
    favoriteFoods,
    favoriteSongs,
    favoritePlaces,
    childhoodHobbies,
    traditionalGames,
    importantFamilyMembers,
    dailyRoutine,
    preferredTimeForActivities
  } = req.body;

  if (!caretakerId || !name) {
    return res.status(400).json({ error: 'Caretaker ID and patient name are required.' });
  }

  const updatedPatient = db.savePatient({
    caretakerId,
    name,
    age: parseInt(age, 10) || 70,
    gender: gender || 'Other',
    preferredLanguage: preferredLanguage || 'en',
    state: state || 'Assam',
    relationship: relationship || 'Family Member',
    favoriteActivities: Array.isArray(favoriteActivities) ? favoriteActivities : [favoriteActivities].filter(Boolean),
    favoriteFoods: Array.isArray(favoriteFoods) ? favoriteFoods : [favoriteFoods].filter(Boolean),
    favoriteSongs: Array.isArray(favoriteSongs) ? favoriteSongs : [favoriteSongs].filter(Boolean),
    favoritePlaces: Array.isArray(favoritePlaces) ? favoritePlaces : [favoritePlaces].filter(Boolean),
    childhoodHobbies: Array.isArray(childhoodHobbies) ? childhoodHobbies : [childhoodHobbies].filter(Boolean),
    traditionalGames: Array.isArray(traditionalGames) ? traditionalGames : [traditionalGames].filter(Boolean),
    importantFamilyMembers: Array.isArray(importantFamilyMembers) ? importantFamilyMembers : [importantFamilyMembers].filter(Boolean),
    dailyRoutine: dailyRoutine || 'Standard routine',
    preferredTimeForActivities: preferredTimeForActivities || 'Morning',
    setupCompleted: true
  });

  res.json({
    message: 'Patient profile successfully saved!',
    patient: updatedPatient
  });
});

// ================= QUESTIONNAIRE & MEMORY PROFILE =================
app.post('/api/questionnaire', (req, res) => {
  const { patientId, caretakerId, answers } = req.body;

  if (!patientId || !answers) {
    return res.status(400).json({ error: 'Patient ID and answers are required.' });
  }

  // Calculate memory activity profile indicators purely for supportive personalization
  // (NOT A CLINICAL DIAGNOSIS)
  const calcScore = (ans) => {
    switch (ans) {
      case 'Never': return 92;
      case 'Sometimes': return 75;
      case 'Often': return 58;
      case 'Very Often': return 42;
      case 'Good': case 'Happy': case 'Yes': return 90;
      case 'Average': case 'Okay': return 70;
      case 'Poor': case 'Worried': case 'Sad': case 'No': return 50;
      default: return 75;
    }
  };

  const visualMemory = Math.round((calcScore(answers.familiarPlaces) + calcScore(answers.recentMemory)) / 2);
  const shortTermRecall = calcScore(answers.recentMemory);
  const recognition = calcScore(answers.familiarPeople);
  const attention = Math.round((calcScore(answers.dailyActivities) + calcScore(answers.recentMemory)) / 2);
  const sequenceMemory = calcScore(answers.dailyActivities);
  const dailyRoutineRecall = calcScore(answers.dailyActivities);
  const emotionalWellbeing = Math.round((calcScore(answers.mood) + calcScore(answers.sleep) + calcScore(answers.socialInteraction)) / 3);

  const profile = {
    visualMemory,
    shortTermRecall,
    recognition,
    attention,
    sequenceMemory,
    dailyRoutineRecall,
    emotionalWellbeing,
    disclaimer: 'Personalized for activity comfort only. Not a medical diagnosis.'
  };

  const saved = db.saveQuestionnaire({
    patientId,
    caretakerId,
    answers,
    profile
  });

  res.json({
    message: 'Activity profile generated successfully.',
    questionnaire: saved
  });
});

app.get('/api/questionnaire/:patientId', (req, res) => {
  const quest = db.getQuestionnaireByPatientId(req.params.patientId);
  if (!quest) {
    return res.status(404).json({ error: 'Questionnaire not found' });
  }
  res.json(quest);
});

// ================= GAME RESULTS & ANALYTICS =================
app.post('/api/games/result', (req, res) => {
  const { patientId, gameId, gameName, category, score, accuracy, responseTimeMs, difficulty, itemsCount } = req.body;

  if (!patientId || !gameId) {
    return res.status(400).json({ error: 'Patient ID and game ID are required.' });
  }

  const result = db.saveGameResult({
    patientId,
    gameId,
    gameName,
    category: category || 'Childhood',
    score: score || 0,
    accuracy: accuracy || 0,
    responseTimeMs: responseTimeMs || 2000,
    difficulty: difficulty || 1,
    itemsCount: itemsCount || 3
  });

  res.json({
    message: 'Game result saved.',
    result
  });
});

app.get('/api/games/history/:patientId', (req, res) => {
  const results = db.getGameResultsByPatientId(req.params.patientId);
  res.json(results);
});

// ================= REMINDERS =================
app.get('/api/reminders/:patientId', (req, res) => {
  const reminders = db.getRemindersByPatientId(req.params.patientId);
  res.json(reminders);
});

app.post('/api/reminders', (req, res) => {
  const { patientId, title, category, time, frequency, notes } = req.body;

  if (!patientId || !title || !time) {
    return res.status(400).json({ error: 'Patient ID, title, and time are required.' });
  }

  const reminder = db.createReminder({
    patientId,
    title,
    category: category || 'Daily Routine',
    time,
    frequency: frequency || 'Daily',
    notes: notes || ''
  });

  res.status(201).json({
    message: 'Reminder created successfully.',
    reminder
  });
});

app.put('/api/reminders/:id', (req, res) => {
  const updated = db.updateReminder(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json({ message: 'Reminder updated', reminder: updated });
});

app.delete('/api/reminders/:id', (req, res) => {
  const success = db.deleteReminder(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Reminder not found' });
  }
  res.json({ message: 'Reminder deleted successfully' });
});

// ================= FAMILY MEMORIES =================
app.get('/api/memories/:patientId', (req, res) => {
  const memories = db.getFamilyMemoriesByPatientId(req.params.patientId);
  res.json(memories);
});

app.post('/api/memories', (req, res) => {
  const { patientId, title, category, imageUrl, description, personOrPlace, questions } = req.body;

  if (!patientId || !title || !imageUrl) {
    return res.status(400).json({ error: 'Patient ID, title, and image are required.' });
  }

  // Generate fallback reminiscence questions if none provided
  const generatedQuestions = questions && questions.length > 0 ? questions : [
    {
      questionText: `Do you remember what you felt during this moment in ${title}?`,
      options: ['Joy and warmth', 'Peaceful calm', 'Festive excitement', 'Family pride'],
      correctOption: 'Joy and warmth',
      hint: 'Think back to the happy smiles and familiar voices.'
    },
    {
      questionText: `What stands out the most to you in this picture?`,
      options: ['The bright colors', 'The loving people', 'The beautiful place', 'The fond memories'],
      correctOption: 'The loving people',
      hint: 'Look closely at the cherished family faces.'
    }
  ];

  const memory = db.createFamilyMemory({
    patientId,
    title,
    category: category || 'Family Gathering',
    imageUrl,
    description: description || '',
    personOrPlace: personOrPlace || 'Family Archive',
    questions: generatedQuestions
  });

  res.status(201).json({
    message: 'Family memory added successfully.',
    memory
  });
});

app.delete('/api/memories/:id', (req, res) => {
  const success = db.deleteFamilyMemory(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Memory not found' });
  }
  res.json({ message: 'Memory removed successfully' });
});

// ================= AI STORY / REMINISCENCE ASSISTANT =================
app.post('/api/ai/story', (req, res) => {
  const { patientName, state, favoriteActivity, favoriteFood, favoriteSong } = req.body;

  const stories = [
    `On a golden morning in ${state || 'Assam'}, the sweet fragrance of fresh ${favoriteFood || 'Pitha'} filled the wooden verandah. ${patientName || 'Aita'} enjoyed listening to the soft notes of ${favoriteSong || 'Bihu folk melodies'} while birds chirped in the green tea bushes.`,
    `Gentle afternoon memories bring back the peaceful sound of the river breeze. ${patientName || 'Koka'} used to cherish ${favoriteActivity || 'spending time in the garden'} with family, sharing smiles and telling old stories by the courtyard fire.`,
    `Under the soft North-Eastern mountain sky, the whole village would gather to celebrate festival traditions. The rhythm of folk tunes and warm laughter brought everyone together with love and joy.`
  ];

  const randomStory = stories[Math.floor(Math.random() * stories.length)];
  res.json({ story: randomStory });
});

// Serve static frontend in production if built
const distPath = path.join(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`CogniCare Backend Server running on http://localhost:${PORT}`);
});
