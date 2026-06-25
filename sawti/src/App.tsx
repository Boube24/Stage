/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Smartphone, 
  Building2, 
  Eye, 
  Sparkles,
  RefreshCw,
  Info,
  Layers,
  Moon,
  Sun,
  Download
} from 'lucide-react';
import { MobileSimulator } from './components/MobileSimulator';
import { AdminPortal } from './components/AdminPortal';
import { INITIAL_COMPLAINTS, INITIAL_NOTIFICATIONS } from './data/mockData';
import { Complaint, NotificationItem, CitizenUser } from './types';

export default function App() {
  // Shared Live Platform State
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
  // Default logged citizen profile matching "Ahmed" in the requirements
  const [currentUser, setCurrentUser] = useState<CitizenUser>({
    name: 'Ahmed Mahmoud',
    nni: '2890471203',
    phone: '44123456',
    email: '24012@supnum.mr', // Dedicated local SupNum email
    wilaya: 'Nouakchott Ouest',
    moughataa: 'Tevragh-Zeina',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
  });

  // Presentation View Controller state
  // 'split' (side-by-side live demonstration), 'citizen' (mobile only), 'admin' (portal only)
  const [showcaseMode, setShowcaseMode] = useState<'split' | 'citizen' | 'admin'>('split');

  // Trigger browser styling based on dark mode selection
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Synchronized state action handlers
  const handleCreateComplaint = (newComplaint: Complaint) => {
    setComplaints((prev) => [newComplaint, ...prev]);
    
    // Auto-insert a new notification for submitting
    const submitNotif: NotificationItem = {
      id: `notif-sys-${Date.now()}`,
      title: 'Réclamation Enregistrée 🇲🇷',
      description: `Votre dossier ${newComplaint.reference} a été correctement transmis aux serveurs de l'État.`,
      type: 'info',
      complaintId: newComplaint.id,
      createdAt: new Date().toISOString(),
      read: false
    };
    setNotifications((prev) => [submitNotif, ...prev]);
  };

  const handleUpdateComplaint = (updatedComplaint: Complaint) => {
    setComplaints((prev) => 
      prev.map((c) => (c.id === updatedComplaint.id ? updatedComplaint : c))
    );
  };

  const handleAddNotification = (newNotif: NotificationItem) => {
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleReadNotifications = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleResetDemoData = () => {
    if (window.confirm('Voulez-vous réinitialiser toutes les réclamations et notifications aux valeurs par défaut ?')) {
      setComplaints(INITIAL_COMPLAINTS);
      setNotifications(INITIAL_NOTIFICATIONS);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col transition-all duration-300 ${
      isDarkMode ? 'bg-[#0B0F19] text-slate-100' : 'bg-[#F1F5F9] text-slate-900'
    }`}>
      
      {/* 🇲🇷 STATE TRI-COLOR TOP GLOW HEADER STRIP */}
      <div className="h-1.5 w-full flex">
        <div className="flex-1 bg-[#006B3F]"></div> {/* Vert Mauritanie */}
        <div className="w-1/12 bg-[#D4AF37]"></div> {/* Or */}
        <div className="flex-1 bg-[#006B3F]"></div> {/* Vert Mauritanie */}
        <div className="w-24 bg-[#C1272D]"></div> {/* Rouge Mauritanie */}
        <div className="flex-1 bg-[#006B3F]"></div> {/* Vert Mauritanie */}
      </div>

      {/* 🏛️ NATIONAL EXECUTIVE PORTAL PRESENTATION BAR */}
      <header className={`px-6 py-4 border-b flex flex-col md:flex-row justify-between items-center gap-4 shadow-sm z-50 ${
        isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/95 border-slate-200'
      }`}>
        
        {/* State logo branding */}
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#006B3F]/10 dark:bg-amber-500/10 border border-[#006B3F]/30 dark:border-amber-500/30 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 100 100" className="w-8 h-8 fill-[#006B3F] dark:fill-amber-400 drop-shadow-sm">
              <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
              <polygon points="50,22 53,29 61,29 55,34 57,41 50,37 43,41 45,34 39,29 47,29" />
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-widest text-[#006B3F] dark:text-amber-400">SAWTI</h1>
              <span className="text-[9px] font-bold bg-[#C1272D] text-white px-2 py-0.5 rounded uppercase font-mono tracking-wider">
                MAURITANIE 2026
              </span>
            </div>
            <p className="text-[10px] text-gray-500 font-sans tracking-wide">
              Plateforme Intelligente de Gestion des Réclamations Citoyennes • République Islamique de Mauritanie
            </p>
          </div>
        </div>

        {/* CONTROLS & DEMO SHUTTLES */}
        <div className="flex flex-wrap items-center gap-3.5">
          
          {/* Mode Selector pills */}
          <div className={`p-1 rounded-xl flex items-center gap-1 border select-none ${
            isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200/80'
          }`}>
            {[
              { id: 'split', label: 'Démo Synchronisée', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'citizen', label: 'Espace Citoyen (Flutter)', icon: <Smartphone className="w-3.5 h-3.5" /> },
              { id: 'admin', label: 'Portail Admin (Angular)', icon: <Building2 className="w-3.5 h-3.5" /> }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setShowcaseMode(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  showcaseMode === tab.id
                    ? 'bg-[#006B3F] text-white dark:bg-amber-400 dark:text-slate-950 shadow-md font-black'
                    : 'text-gray-500 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Quick utility controls */}
          <div className="flex items-center gap-2">
            
            {/* Theme Toggle option */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 transition-all cursor-pointer ${
                isDarkMode ? 'border-slate-800 text-amber-400' : 'border-slate-200'
              }`}
              title="Changer de thème"
              id="global-theme-toggle"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Reset Demo State Button */}
            <button
              onClick={handleResetDemoData}
              className={`p-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 text-gray-500 transition-all cursor-pointer ${
                isDarkMode ? 'border-slate-800' : 'border-slate-200'
              }`}
              title="Réinitialiser la Démo"
              id="global-demo-reset"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            {/* Download Flutter ZIP Button */}
            <a
              href="/flutter_code.zip"
              download="sawti_flutter_code.zip"
              className={`p-2 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold shadow-sm ${
                isDarkMode 
                  ? 'border-emerald-800/80 bg-emerald-950/20 text-emerald-400 hover:bg-emerald-950/40' 
                  : 'border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
              title="Télécharger le code source Flutter (.zip)"
              id="global-download-zip"
            >
              <Download className="w-4 h-4" />
              <span>Code Flutter (.zip)</span>
            </a>
          </div>

        </div>

      </header>

      {/* 🔔 LIVE SYNC PRESENTATION BANNER (Only in Split View) */}
      {showcaseMode === 'split' && (
        <div className="bg-amber-500/10 border-b border-amber-500/20 text-amber-600 dark:text-amber-400 px-6 py-2.5 text-xs flex items-center gap-2 font-sans select-none">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse flex-shrink-0" />
          <span>
            <strong>Mode Démonstration Actif :</strong> L'application mobile (Flutter) et le portail administratif (Angular) partagent la même mémoire locale. Soumettez un incident sur la gauche, puis traitez-le à droite pour observer la mise à jour des statuts instantanée !
          </span>
        </div>
      )}

      {/* 🚀 MAIN CONTENT SHELL CANVAS */}
      <main className="flex-1 flex flex-col overflow-hidden">
        
        <AnimatePresence mode="wait">
          
          {/* DISPLAY MODE 1: SPLIT DEMO LAYOUT */}
          {showcaseMode === 'split' && (
            <motion.div
              key="split-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="flex-1 grid grid-cols-1 xl:grid-cols-12 overflow-hidden h-full"
            >
              
              {/* Left Side: Citizen Mobile Simulator (4 of 12 cols) */}
              <div className="xl:col-span-4 border-r border-slate-200 dark:border-slate-800 overflow-y-auto flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-950/40">
                <div className="w-full max-w-[390px]">
                  <div className="text-center mb-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
                      📱 Émulateur Client Citoyen (Flutter)
                    </span>
                  </div>
                  <MobileSimulator
                    complaints={complaints}
                    onCreateComplaint={handleCreateComplaint}
                    onUpdateComplaint={handleUpdateComplaint}
                    notifications={notifications}
                    onReadNotifications={handleReadNotifications}
                    currentUser={currentUser}
                    setCurrentUser={setCurrentUser}
                    isDarkMode={isDarkMode}
                    setIsDarkMode={setIsDarkMode}
                  />
                </div>
              </div>

              {/* Right Side: Admin Portal (8 of 12 cols) */}
              <div className="xl:col-span-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col h-full">
                <div className="px-6 pt-4">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block">
                    🏛️ Portail Supervision Gouvernementale (Angular Web)
                  </span>
                </div>
                <div className="flex-1">
                  <AdminPortal
                    complaints={complaints}
                    onUpdateComplaint={handleUpdateComplaint}
                    onAddNotification={handleAddNotification}
                    isDarkMode={isDarkMode}
                    currentUser={currentUser}
                  />
                </div>
              </div>

            </motion.div>
          )}

          {/* DISPLAY MODE 2: CITIZEN APP MOBILE ONLY */}
          {showcaseMode === 'citizen' && (
            <motion.div
              key="citizen-only-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 overflow-y-auto flex items-center justify-center p-6 bg-slate-100 dark:bg-slate-900/60"
            >
              <div className="w-full max-w-sm flex flex-col items-center">
                <div className="mb-4 text-center">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    SAWTI Citizen App Simulator (Flutter Mobile Client)
                  </h3>
                  <p className="text-[10px] text-gray-400 font-sans mt-0.5">Simulateur d'interface mobile citoyenne</p>
                </div>
                <MobileSimulator
                  complaints={complaints}
                  onCreateComplaint={handleCreateComplaint}
                  onUpdateComplaint={handleUpdateComplaint}
                  notifications={notifications}
                  onReadNotifications={handleReadNotifications}
                  currentUser={currentUser}
                  setCurrentUser={setCurrentUser}
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
                />
              </div>
            </motion.div>
          )}

          {/* DISPLAY MODE 3: ADMIN WEB PORTAL ONLY */}
          {showcaseMode === 'admin' && (
            <motion.div
              key="admin-only-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex-1 overflow-y-auto"
            >
              <AdminPortal
                complaints={complaints}
                onUpdateComplaint={handleUpdateComplaint}
                onAddNotification={handleAddNotification}
                isDarkMode={isDarkMode}
                currentUser={currentUser}
              />
            </motion.div>
          )}

        </AnimatePresence>

      </main>

    </div>
  );
}
