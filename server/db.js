import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { seedData } from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '../data');
const DB_FILE = path.join(DATA_DIR, 'memoryroots_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

class Database {
  constructor() {
    this.data = {
      caretakers: [],
      patients: [],
      questionnaires: [],
      gameResults: [],
      reminders: [],
      familyMemories: []
    };
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DB_FILE)) {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
        // Ensure all collections exist
        if (!this.data.caretakers || this.data.caretakers.length === 0) {
          this.data = JSON.parse(JSON.stringify(seedData));
          this.save();
        }
      } else {
        this.data = JSON.parse(JSON.stringify(seedData));
        this.save();
      }
    } catch (err) {
      console.error('Error initializing database, using seed data:', err);
      this.data = JSON.parse(JSON.stringify(seedData));
      this.save();
    }
  }

  save() {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  // Caretaker Operations
  findCaretakerByEmail(email) {
    return this.data.caretakers.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  findCaretakerById(id) {
    return this.data.caretakers.find(c => c.id === id);
  }

  createCaretaker(caretaker) {
    const newCaretaker = {
      id: 'caretaker_' + Date.now(),
      ...caretaker,
      createdAt: new Date().toISOString()
    };
    this.data.caretakers.push(newCaretaker);
    this.save();
    return newCaretaker;
  }

  updateCaretaker(id, updates) {
    const idx = this.data.caretakers.findIndex(c => c.id === id);
    if (idx !== -1) {
      this.data.caretakers[idx] = { ...this.data.caretakers[idx], ...updates };
      this.save();
      return this.data.caretakers[idx];
    }
    return null;
  }

  // Patient Operations
  findPatientByCaretakerId(caretakerId) {
    return this.data.patients.find(p => p.caretakerId === caretakerId);
  }

  findPatientById(id) {
    return this.data.patients.find(p => p.id === id);
  }

  savePatient(patientData) {
    const existingIdx = this.data.patients.findIndex(p => p.caretakerId === patientData.caretakerId);
    if (existingIdx !== -1) {
      this.data.patients[existingIdx] = {
        ...this.data.patients[existingIdx],
        ...patientData,
        updatedAt: new Date().toISOString()
      };
      this.save();
      return this.data.patients[existingIdx];
    } else {
      const newPatient = {
        id: 'patient_' + Date.now(),
        ...patientData,
        createdAt: new Date().toISOString()
      };
      this.data.patients.push(newPatient);
      this.save();
      return newPatient;
    }
  }

  // Questionnaire & Memory Profile
  saveQuestionnaire(data) {
    const existingIdx = this.data.questionnaires.findIndex(q => q.patientId === data.patientId);
    const questObj = {
      id: existingIdx !== -1 ? this.data.questionnaires[existingIdx].id : 'quest_' + Date.now(),
      patientId: data.patientId,
      caretakerId: data.caretakerId,
      answers: data.answers,
      profile: data.profile,
      completedAt: new Date().toISOString()
    };

    if (existingIdx !== -1) {
      this.data.questionnaires[existingIdx] = questObj;
    } else {
      this.data.questionnaires.push(questObj);
    }

    // Also update patient setup status
    const pIdx = this.data.patients.findIndex(p => p.id === data.patientId);
    if (pIdx !== -1) {
      this.data.patients[pIdx].questionnaireCompleted = true;
    }

    this.save();
    return questObj;
  }

  getQuestionnaireByPatientId(patientId) {
    return this.data.questionnaires.find(q => q.patientId === patientId);
  }

  // Game Results & Progress
  saveGameResult(result) {
    const newResult = {
      id: 'gr_' + Date.now(),
      ...result,
      completedAt: new Date().toISOString()
    };
    this.data.gameResults.push(newResult);
    this.save();
    return newResult;
  }

  seedBaselineSessions(patientId) {
    if (!this.data.gameResults.some(gr => gr.patientId === patientId)) {
      const base = (seedData.gameResults || []).map((s, idx) => ({
        ...s,
        id: `gr_${patientId}_${idx + 1}`,
        patientId
      }));
      this.data.gameResults.push(...base);
      this.save();
      return base;
    }
    return this.data.gameResults.filter(gr => gr.patientId === patientId);
  }

  getGameResultsByPatientId(patientId) {
    const existing = this.data.gameResults.filter(gr => gr.patientId === patientId);
    if (existing.length === 0 && patientId) {
      return this.seedBaselineSessions(patientId);
    }
    return existing;
  }

  // Reminders
  getRemindersByPatientId(patientId) {
    return this.data.reminders.filter(r => r.patientId === patientId);
  }

  createReminder(reminder) {
    const newReminder = {
      id: 'rem_' + Date.now(),
      status: 'active',
      ...reminder,
      createdAt: new Date().toISOString()
    };
    this.data.reminders.push(newReminder);
    this.save();
    return newReminder;
  }

  updateReminder(id, updates) {
    const idx = this.data.reminders.findIndex(r => r.id === id);
    if (idx !== -1) {
      this.data.reminders[idx] = { ...this.data.reminders[idx], ...updates };
      this.save();
      return this.data.reminders[idx];
    }
    return null;
  }

  deleteReminder(id) {
    const initialLen = this.data.reminders.length;
    this.data.reminders = this.data.reminders.filter(r => r.id !== id);
    this.save();
    return this.data.reminders.length < initialLen;
  }

  // Family Memories
  getFamilyMemoriesByPatientId(patientId) {
    return this.data.familyMemories.filter(m => m.patientId === patientId);
  }

  createFamilyMemory(memory) {
    const newMemory = {
      id: 'mem_' + Date.now(),
      ...memory,
      createdAt: new Date().toISOString()
    };
    this.data.familyMemories.push(newMemory);
    this.save();
    return newMemory;
  }

  deleteFamilyMemory(id) {
    const initialLen = this.data.familyMemories.length;
    this.data.familyMemories = this.data.familyMemories.filter(m => m.id !== id);
    this.save();
    return this.data.familyMemories.length < initialLen;
  }

  // Reset demo
  resetToDemo() {
    this.data = JSON.parse(JSON.stringify(seedData));
    this.save();
    return true;
  }
}

export const db = new Database();
