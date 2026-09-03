import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AccessibilityProvider } from './context/AccessibilityContext';
import { PatientProvider, usePatient } from './context/PatientContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CulturalAboutModal } from './components/CulturalAboutModal';

import { LandingPage } from './pages/LandingPage';
import { AuthPage } from './pages/AuthPage';
import { PatientSetupPage } from './pages/PatientSetupPage';
import { QuestionnairePage } from './pages/QuestionnairePage';
import { MemoryProfilePage } from './pages/MemoryProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { GamesHubPage } from './pages/GamesHubPage';
import { FamilyMemoriesPage } from './pages/FamilyMemoriesPage';
import { RemindersPage } from './pages/RemindersPage';
import { ProgressDashboardPage } from './pages/ProgressDashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { HelpSupportPage } from './pages/HelpSupportPage';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [selectedGame, setSelectedGame] = useState(null);
  const [isCultureModalOpen, setIsCultureModalOpen] = useState(false);

  const { isAuthenticated } = useAuth();
  const { patient } = usePatient();

  const renderCurrentPage = () => {
    switch (activePage) {
      case 'home':
        return (
          <LandingPage
            setActivePage={setActivePage}
            onOpenCulture={() => setIsCultureModalOpen(true)}
          />
        );

      case 'auth':
        return <AuthPage setActivePage={setActivePage} />;

      case 'patient-setup':
        return <PatientSetupPage setActivePage={setActivePage} />;

      case 'questionnaire':
        return <QuestionnairePage setActivePage={setActivePage} />;

      case 'memory-profile':
        return <MemoryProfilePage setActivePage={setActivePage} />;

      case 'dashboard':
        return (
          <DashboardPage
            setActivePage={setActivePage}
            setSelectedGame={(gameId) => {
              setSelectedGame(gameId);
              setActivePage('games');
            }}
          />
        );

      case 'games':
        return (
          <GamesHubPage
            initialGame={selectedGame}
            setActivePage={setActivePage}
          />
        );

      case 'family':
        return <FamilyMemoriesPage setActivePage={setActivePage} />;

      case 'reminders':
        return <RemindersPage setActivePage={setActivePage} />;

      case 'progress':
        return <ProgressDashboardPage setActivePage={setActivePage} />;

      case 'settings':
        return <SettingsPage setActivePage={setActivePage} />;

      case 'help':
        return (
          <HelpSupportPage
            onOpenCulture={() => setIsCultureModalOpen(true)}
          />
        );

      default:
        return (
          <LandingPage
            setActivePage={setActivePage}
            onOpenCulture={() => setIsCultureModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden flex flex-col bg-[#FAF7F0] text-stone-900 transition-colors">
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenCulture={() => setIsCultureModalOpen(true)}
      />

      <main className="flex-1">
        {renderCurrentPage()}
      </main>

      <Footer
        onOpenCulture={() => setIsCultureModalOpen(true)}
        setActivePage={setActivePage}
      />

      {/* Cultural Heritage 8-States Modal */}
      <CulturalAboutModal
        isOpen={isCultureModalOpen}
        onClose={() => setIsCultureModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AccessibilityProvider>
          <PatientProvider>
            <AppContent />
          </PatientProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
