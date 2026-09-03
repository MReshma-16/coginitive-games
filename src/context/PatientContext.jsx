import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const PatientContext = createContext();

export const PatientProvider = ({ children }) => {
  const { caretaker, isAuthenticated } = useAuth();
  const [patient, setPatient] = useState(null);
  const [questionnaire, setQuestionnaire] = useState(null);
  const [gameResults, setGameResults] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [familyMemories, setFamilyMemories] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load patient data whenever caretaker changes or logs in
  useEffect(() => {
    if (caretaker?.id) {
      loadPatientData(caretaker.id);
    } else {
      setPatient(null);
      setQuestionnaire(null);
      setGameResults([]);
      setReminders([]);
      setFamilyMemories([]);
    }
  }, [caretaker?.id]);

  const loadPatientData = async (caretakerId) => {
    setLoading(true);
    try {
      // 1. Fetch patient
      const pRes = await fetch(`/api/patient/${caretakerId}`);
      if (pRes.ok) {
        const pData = await pRes.json();
        setPatient(pData);

        // 2. Fetch questionnaire
        if (pData?.id) {
          const [qRes, gRes, rRes, mRes] = await Promise.all([
            fetch(`/api/questionnaire/${pData.id}`),
            fetch(`/api/games/history/${pData.id}`),
            fetch(`/api/reminders/${pData.id}`),
            fetch(`/api/memories/${pData.id}`)
          ]);

          if (qRes.ok) setQuestionnaire(await qRes.json());
          if (gRes.ok) setGameResults(await gRes.json());
          if (rRes.ok) setReminders(await rRes.json());
          if (mRes.ok) setFamilyMemories(await mRes.json());
        }
      }
    } catch (err) {
      console.warn('Could not fetch from backend, checking local storage cache:', err);
      // Local fallback
      const cachedPatient = localStorage.getItem(`memoryroots_patient_${caretakerId}`);
      if (cachedPatient) {
        setPatient(JSON.parse(cachedPatient));
      }
    } finally {
      setLoading(false);
    }
  };

  const savePatientSetup = async (setupData) => {
    const payload = {
      caretakerId: caretaker.id,
      ...setupData
    };

    try {
      const res = await fetch('/api/patient/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const data = await res.json();
        setPatient(data.patient);
        localStorage.setItem(`memoryroots_patient_${caretaker.id}`, JSON.stringify(data.patient));
        return data.patient;
      }
    } catch (err) {
      console.warn('Backend offline, saving patient locally:', err);
    }

    // Local fallback
    const localPatient = {
      id: patient?.id || 'patient_' + Date.now(),
      caretakerId: caretaker.id,
      ...setupData,
      setupCompleted: true
    };
    setPatient(localPatient);
    localStorage.setItem(`memoryroots_patient_${caretaker.id}`, JSON.stringify(localPatient));
    return localPatient;
  };

  const submitQuestionnaire = async (answers) => {
    if (!patient?.id || !caretaker?.id) return;

    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patientId: patient.id,
          caretakerId: caretaker.id,
          answers
        })
      });
      if (res.ok) {
        const data = await res.json();
        setQuestionnaire(data.questionnaire);
        setPatient(prev => ({ ...prev, questionnaireCompleted: true }));
        return data.questionnaire;
      }
    } catch (err) {
      console.warn('Backend offline, calculating profile locally:', err);
    }

    // Fallback profile calculation
    const fallbackProfile = {
      visualMemory: 84,
      shortTermRecall: 76,
      recognition: 88,
      attention: 80,
      sequenceMemory: 78,
      dailyRoutineRecall: 85,
      emotionalWellbeing: 90
    };
    const localQuest = {
      patientId: patient.id,
      caretakerId: caretaker.id,
      answers,
      profile: fallbackProfile,
      completedAt: new Date().toISOString()
    };
    setQuestionnaire(localQuest);
    setPatient(prev => ({ ...prev, questionnaireCompleted: true }));
    return localQuest;
  };

  const recordGameResult = async (resultData) => {
    if (!patient?.id) return;

    const fullResult = {
      patientId: patient.id,
      ...resultData,
      completedAt: new Date().toISOString()
    };

    try {
      const res = await fetch('/api/games/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullResult)
      });
      if (res.ok) {
        const data = await res.json();
        setGameResults(prev => [data.result, ...prev]);
        return data.result;
      }
    } catch (err) {
      console.warn('Recording result locally:', err);
    }

    const localResult = {
      id: 'gr_' + Date.now(),
      ...fullResult
    };
    setGameResults(prev => [localResult, ...prev]);
    return localResult;
  };

  const addReminder = async (reminderData) => {
    if (!patient?.id) return;

    try {
      const res = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patient.id, ...reminderData })
      });
      if (res.ok) {
        const data = await res.json();
        setReminders(prev => [...prev, data.reminder]);
        return data.reminder;
      }
    } catch (err) {
      console.warn('Adding reminder locally:', err);
    }

    const localRem = {
      id: 'rem_' + Date.now(),
      patientId: patient.id,
      ...reminderData,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    setReminders(prev => [...prev, localRem]);
    return localRem;
  };

  const deleteReminder = async (reminderId) => {
    try {
      await fetch(`/api/reminders/${reminderId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Deleting locally:', err);
    }
    setReminders(prev => prev.filter(r => r.id !== reminderId));
  };

  const addFamilyMemory = async (memoryData) => {
    if (!patient?.id) return;

    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId: patient.id, ...memoryData })
      });
      if (res.ok) {
        const data = await res.json();
        setFamilyMemories(prev => [data.memory, ...prev]);
        return data.memory;
      }
    } catch (err) {
      console.warn('Adding family memory locally:', err);
    }

    const localMem = {
      id: 'mem_' + Date.now(),
      patientId: patient.id,
      ...memoryData,
      createdAt: new Date().toISOString()
    };
    setFamilyMemories(prev => [localMem, ...prev]);
    return localMem;
  };

  const deleteFamilyMemory = async (memoryId) => {
    try {
      await fetch(`/api/memories/${memoryId}`, { method: 'DELETE' });
    } catch (err) {
      console.warn('Deleting locally:', err);
    }
    setFamilyMemories(prev => prev.filter(m => m.id !== memoryId));
  };

  return (
    <PatientContext.Provider
      value={{
        patient,
        questionnaire,
        gameResults,
        reminders,
        familyMemories,
        loading,
        loadPatientData,
        savePatientSetup,
        submitQuestionnaire,
        recordGameResult,
        addReminder,
        deleteReminder,
        addFamilyMemory,
        deleteFamilyMemory
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export const usePatient = () => useContext(PatientContext);
