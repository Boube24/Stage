/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Smartphone,
  Wifi,
  Battery,
  ChevronRight,
  User,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  Plus,
  Compass,
  MapPin,
  Clock,
  CheckCircle2,
  Bell,
  SlidersHorizontal,
  ChevronLeft,
  FileText,
  UploadCloud,
  Send,
  Building,
  UserCheck,
  Calendar,
  LogOut,
  Map,
  Moon,
  Sun,
  X,
  Construction,
  Droplets,
  Zap,
  Trash2,
  Trees,
  ShieldAlert,
  HeartPulse,
  GraduationCap
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintPriority, NotificationItem, CitizenUser } from '../types';
import { CATEGORY_DETAILS, WILAYAS_LIST, MOCK_NEWS } from '../data/mockData';

interface MobileSimulatorProps {
  complaints: Complaint[];
  onCreateComplaint: (newComplaint: Complaint) => void;
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  notifications: NotificationItem[];
  onReadNotifications: () => void;
  currentUser: CitizenUser;
  setCurrentUser: (user: CitizenUser) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
}

type MobileScreen =
  | 'splash'
  | 'onboarding'
  | 'login'
  | 'register'
  | 'home'
  | 'new_complaint'
  | 'complaint_list'
  | 'complaint_detail'
  | 'notifications'
  | 'profil';

export const MobileSimulator: React.FC<MobileSimulatorProps> = ({
  complaints,
  onCreateComplaint,
  onUpdateComplaint,
  notifications,
  onReadNotifications,
  currentUser,
  setCurrentUser,
  isDarkMode,
  setIsDarkMode,
}) => {
  // Mobile Simulator Navigation & UI State
  const [currentScreen, setCurrentScreen] = useState<MobileScreen>('splash');
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  
  // New Complaint Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newPriority, setNewPriority] = useState<ComplaintPriority>('moyenne');
  const [newWilaya, setNewWilaya] = useState('');
  const [newMoughataa, setNewMoughataa] = useState('');
  const [newImage, setNewImage] = useState<string | null>(null);
  const [gpsSimulated, setGpsSimulated] = useState<{ lat: number; lng: number; name: string } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Registration Form State
  const [regName, setRegName] = useState('');
  const [regNni, setRegNni] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regWilaya, setRegWilaya] = useState('');
  const [regMoughataa, setRegMoughataa] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [regErrors, setRegErrors] = useState<Record<string, string>>({});

  // Filter state for complaints tab
  const [complaintFilter, setComplaintFilter] = useState<'all' | 'signalee' | 'en_cours' | 'resolue'>('all');

  // Dynamic comment input on Details screen
  const [commentText, setCommentText] = useState('');

  // Handle splash screen timeout
  useEffect(() => {
    if (currentScreen === 'splash') {
      const timer = setTimeout(() => {
        setCurrentScreen('onboarding');
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [currentScreen]);

  // Sync default wilaya and moughataa when registering
  useEffect(() => {
    if (regWilaya) {
      const found = WILAYAS_LIST.find(w => w.name === regWilaya);
      if (found && found.moughataas.length > 0) {
        setRegMoughataa(found.moughataas[0]);
      }
    }
  }, [regWilaya]);

  // Also sync for new complaint form
  useEffect(() => {
    if (newWilaya) {
      const found = WILAYAS_LIST.find(w => w.name === newWilaya);
      if (found && found.moughataas.length > 0) {
        setNewMoughataa(found.moughataas[0]);
      }
    }
  }, [newWilaya]);

  // Set user default location on init
  useEffect(() => {
    if (currentUser) {
      setNewWilaya(currentUser.wilaya);
      setNewMoughataa(currentUser.moughataa);
    }
  }, [currentUser]);

  // Helper icons mapper
  const getIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'voirie': return <Construction className="w-5 h-5 text-red-500" />;
      case 'eau': return <Droplets className="w-5 h-5 text-teal-600" />;
      case 'electricite': return <Zap className="w-5 h-5 text-yellow-500" />;
      case 'assainissement': return <Trash2 className="w-5 h-5 text-gray-500" />;
      case 'environnement': return <Trees className="w-5 h-5 text-emerald-500" />;
      case 'securite': return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'sante': return <HeartPulse className="w-5 h-5 text-pink-500" />;
      case 'education': return <GraduationCap className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  // Mock upload trigger
  const handlePhotoUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      // Pick a beautiful random unsplash photo representing public services based on selected category
      const photos: Record<string, string[]> = {
        voirie: [
          'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1599740831144-530ba2741340?auto=format&fit=crop&q=80&w=600'
        ],
        eau: [
          'https://images.unsplash.com/photo-1542013936693-8848e574047e?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1508962914676-134849a727f0?auto=format&fit=crop&q=80&w=600'
        ],
        electricite: [
          'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=600',
          'https://images.unsplash.com/photo-1581093191214-bde2170a41d6?auto=format&fit=crop&q=80&w=600'
        ],
        assainissement: [
          'https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&q=80&w=600'
        ]
      };
      const cat = selectedCategory || 'voirie';
      const pool = photos[cat] || ['https://images.unsplash.com/photo-1584824486509-112e4181ff6b?auto=format&fit=crop&q=80&w=600'];
      const chosen = pool[Math.floor(Math.random() * pool.length)];
      setNewImage(chosen);
      setIsUploading(false);
    }, 1500);
  };

  // GPS Simulation Picker
  const handleSimulateGPS = () => {
    const lat = 18.0735 + (Math.random() - 0.5) * 0.05;
    const lng = -15.9582 + (Math.random() - 0.5) * 0.05;
    setGpsSimulated({
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
      name: `Secteur ${newMoughataa || 'Tevragh-Zeina'}, ${newWilaya || 'Nouakchott Ouest'}`
    });
  };

  // Submit Complaint
  const handleAddComplaintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !newTitle || !newDesc) return;

    const refNum = Math.floor(1000 + Math.random() * 9000);
    const mockRef = `S-2026-${refNum}`;
    const newId = `REC-2026-0${complaints.length + 1}`;

    const freshComplaint: Complaint = {
      id: newId,
      reference: mockRef,
      title: newTitle,
      category: selectedCategory,
      description: newDesc,
      status: 'signalee',
      priority: newPriority,
      wilaya: newWilaya || currentUser.wilaya,
      moughataa: newMoughataa || currentUser.moughataa,
      gpsLocation: gpsSimulated ? {
        lat: gpsSimulated.lat,
        lng: gpsSimulated.lng,
        addressName: gpsSimulated.name
      } : {
        lat: 18.0858,
        lng: -15.9785,
        addressName: `Avenue de la République, ${newMoughataa || 'Ksar'}, ${newWilaya || 'Nouakchott'}`
      },
      imageUrl: newImage || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      citizenName: currentUser.name,
      citizenNni: currentUser.nni,
      comments: [
        {
          id: `comment-init-${Date.now()}`,
          author: currentUser.name,
          role: 'citoyen',
          text: newDesc,
          createdAt: new Date().toISOString()
        },
        {
          id: `comment-sys-${Date.now()}`,
          author: 'Système SAWTI',
          role: 'systeme',
          text: 'Votre réclamation a été transmise avec succès au guichet municipal gouvernemental.',
          createdAt: new Date().toISOString()
        }
      ]
    };

    onCreateComplaint(freshComplaint);

    // Clean states and redirect
    setNewTitle('');
    setNewDesc('');
    setSelectedCategory(null);
    setNewImage(null);
    setGpsSimulated(null);
    setSelectedComplaintId(freshComplaint.id);
    setCurrentScreen('complaint_detail');
  };

  // Real-time Citizen Comment on details screen
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !selectedComplaintId) return;

    const activeComp = complaints.find(c => c.id === selectedComplaintId);
    if (!activeComp) return;

    const updatedComments = [
      ...activeComp.comments,
      {
        id: `c-cit-${Date.now()}`,
        author: currentUser.name,
        role: 'citoyen' as const,
        text: commentText.trim(),
        createdAt: new Date().toISOString()
      }
    ];

    onUpdateComplaint({
      ...activeComp,
      comments: updatedComments,
      updatedAt: new Date().toISOString()
    });

    setCommentText('');
  };

  // Perform Registration Action
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    if (!regName.trim()) errs.name = 'Nom complet requis';
    if (regNni.length !== 10 || !/^\d+$/.test(regNni)) errs.nni = 'Le NNI doit comporter exactement 10 chiffres';
    if (!regPhone.trim()) errs.phone = 'Téléphone requis';
    if (!regEmail.includes('@')) errs.email = 'Email invalide';
    if (!regPass || regPass.length < 6) errs.pass = 'Le mot de passe doit comporter au moins 6 caractères';
    if (regPass !== regConfirm) errs.confirm = 'Les mots de passe ne correspondent pas';

    if (Object.keys(errs).length > 0) {
      setRegErrors(errs);
      return;
    }

    // Set User
    setCurrentUser({
      name: regName,
      nni: regNni,
      phone: regPhone,
      email: regEmail,
      wilaya: regWilaya || 'Nouakchott Ouest',
      moughataa: regMoughataa || 'Tevragh-Zeina',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'
    });

    setCurrentScreen('home');
  };

  // Dynamic status badges styling in French/Mauritanie Government Style
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'signalee':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-100 text-red-800 border border-red-200">Signalée</span>;
      case 'assignee':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-100 text-blue-800 border border-blue-200">Assignée</span>;
      case 'en_cours':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">En cours</span>;
      case 'resolue':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">Résolue</span>;
      case 'fermee':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-800 border border-gray-200">Fermée</span>;
      default:
        return null;
    }
  };

  // Priority styling
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'critique':
        return <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-red-600 text-white">CRITIQUE</span>;
      case 'haute':
        return <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-orange-500 text-white">HAUTE</span>;
      case 'moyenne':
        return <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-amber-500 text-white">MOYENNE</span>;
      case 'basse':
        return <span className="px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-bold bg-slate-400 text-white">BASSE</span>;
      default:
        return null;
    }
  };

  // Filter complaints based on user and selection tab
  const filteredComplaints = complaints
    .filter(c => c.citizenNni === currentUser.nni)
    .filter(c => {
      if (complaintFilter === 'all') return true;
      return c.status === complaintFilter;
    });

  const selectedComplaint = complaints.find(c => c.id === selectedComplaintId);

  // Stats Counters
  const myTotal = complaints.filter(c => c.citizenNni === currentUser.nni).length;
  const myResolved = complaints.filter(c => c.citizenNni === currentUser.nni && c.status === 'resolue').length;
  const myActive = myTotal - myResolved;

  return (
    <div className="flex justify-center items-center p-4">
      {/* Dynamic Mobile Bezel */}
      <div className={`relative w-[375px] h-[780px] rounded-[48px] border-[12px] shadow-2xl transition-all flex flex-col overflow-hidden ${
        isDarkMode 
          ? 'bg-slate-950 border-slate-800 shadow-slate-950/80 text-white' 
          : 'bg-[#F5F7FA] border-slate-900 shadow-slate-300/60 text-slate-900'
      }`}>
        
        {/* Notch Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-slate-950 rounded-b-2xl z-50 flex items-center justify-center">
          <div className="w-12 h-1 bg-slate-800 rounded-full mb-2"></div>
          <div className="absolute right-6 top-1.5 w-2.5 h-2.5 bg-indigo-950 border border-slate-800 rounded-full"></div>
        </div>

        {/* Status Bar */}
        <div className="h-10 px-6 pt-2 flex justify-between items-center z-40 font-semibold text-xs select-none pointer-events-none">
          <span className={isDarkMode ? 'text-gray-300' : 'text-slate-800'}>09:41</span>
          <div className="flex items-center gap-1.5">
            <Wifi className={`w-3.5 h-3.5 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`} />
            <div className="flex gap-0.5 items-end h-2.5">
              <span className={`w-0.5 h-1 rounded-full ${isDarkMode ? 'bg-gray-300' : 'bg-slate-800'}`}></span>
              <span className={`w-0.5 h-1.5 rounded-full ${isDarkMode ? 'bg-gray-300' : 'bg-slate-800'}`}></span>
              <span className={`w-0.5 h-2 rounded-full ${isDarkMode ? 'bg-gray-300' : 'bg-slate-800'}`}></span>
              <span className={`w-0.5 h-2.5 rounded-full ${isDarkMode ? 'bg-gray-300' : 'bg-slate-800'}`}></span>
            </div>
            <Battery className={`w-4 h-4 ${isDarkMode ? 'text-gray-300' : 'text-slate-800'}`} />
          </div>
        </div>

        {/* INNER SCREEN CONTAINER */}
        <div className="flex-1 overflow-y-auto relative flex flex-col outline-none">
          
          <AnimatePresence mode="wait">
            
            {/* SCREEN 1: SPLASH SCREEN */}
            {currentScreen === 'splash' && (
              <motion.div
                key="splash"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-40 bg-gradient-to-b from-[#004D2D] via-[#006B3F] to-emerald-950 text-white flex flex-col justify-between p-8 text-center"
              >
                {/* Micro Mauritanie Watermark Grid */}
                <div className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>

                <div className="mt-8 flex justify-center">
                  <div className="px-3 py-1 rounded-full bg-emerald-900/40 border border-emerald-500/20 text-[10px] tracking-widest uppercase text-amber-400 font-mono">
                    République Islamique de Mauritanie
                  </div>
                </div>

                <div className="flex flex-col items-center">
                  {/* Glowing Crest */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="relative w-28 h-28 bg-emerald-950/60 rounded-full border-2 border-amber-500/55 flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-amber-500/10 animate-pulse"></div>
                    {/* Mauritania Custom Crest design with SVG crescent and star */}
                    <svg viewBox="0 0 100 100" className="w-16 h-16 fill-amber-500 drop-shadow-[0_2px_8px_rgba(212,175,55,0.4)]">
                      <circle cx="50" cy="50" r="42" fill="none" stroke="#D4AF37" strokeWidth="2" strokeDasharray="3,3" />
                      {/* Crescent and star */}
                      <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
                      <polygon points="50,22 53,29 61,29 55,34 57,41 50,37 43,41 45,34 39,29 47,29" />
                    </svg>
                  </motion.div>

                  <motion.h1 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-4xl font-extrabold tracking-widest text-white drop-shadow"
                  >
                    SAWTI
                  </motion.h1>
                  
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="w-16 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent my-3"
                  />

                  <motion.p 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.9 }}
                    transition={{ delay: 1 }}
                    className="text-xs text-emerald-200 uppercase font-sans tracking-widest"
                  >
                    Signalez. Suivez. Améliorez.
                  </motion.p>
                </div>

                <div className="flex flex-col items-center gap-4">
                  {/* Mauritanian Flag Waves footer layout */}
                  <div className="flex justify-center gap-1.5 opacity-80 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                  
                  <div className="text-[10px] text-emerald-300 font-sans tracking-wide">
                    Plateforme Citoyenne Intelligente
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: ONBOARDING SCREEN */}
            {currentScreen === 'onboarding' && (
              <motion.div
                key="onboarding"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-white"
              >
                <div className="flex justify-between items-center mt-4">
                  <span className="font-sans font-bold text-[#006B3F] dark:text-amber-400 text-sm tracking-wider">SAWTI</span>
                  <button 
                    onClick={() => setCurrentScreen('login')}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-500 transition-colors font-sans"
                    id="btn-skip-onboarding"
                  >
                    Passer
                  </button>
                </div>

                {/* Onboarding Carousel Contents */}
                <div className="flex-1 flex flex-col justify-center my-4">
                  <AnimatePresence mode="wait">
                    {onboardingStep === 0 && (
                      <motion.div
                        key="onb-1"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center mb-8 border border-emerald-500/20">
                          {/* Animated vector representing user filing complaint */}
                          <svg viewBox="0 0 100 100" className="w-28 h-28">
                            <rect x="35" y="15" width="40" height="55" rx="4" fill="none" stroke="#006B3F" strokeWidth="2.5" />
                            <line x1="43" y1="28" x2="67" y2="28" stroke="#D4AF37" strokeWidth="3" strokeLinecap="round" />
                            <line x1="43" y1="38" x2="67" y2="38" stroke="#006B3F" strokeWidth="2" />
                            <line x1="43" y1="46" x2="59" y2="46" stroke="#006B3F" strokeWidth="2" />
                            <circle cx="25" cy="65" r="14" fill="#006B3F" />
                            <circle cx="25" cy="61" r="4" fill="#D4AF37" />
                            <path d="M15,79 C15,73 20,69 25,69 C30,69 35,73 35,79" fill="none" stroke="#D4AF37" strokeWidth="2" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-3 px-2">
                          Signalez facilement vos réclamations
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed font-sans">
                          Un nid de poule, une panne d'éclairage public ou une fuite d'eau ? Prenez une photo et signalez le problème en 30 secondes.
                        </p>
                      </motion.div>
                    )}

                    {onboardingStep === 1 && (
                      <motion.div
                        key="onb-2"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="w-48 h-48 rounded-full bg-amber-500/10 dark:bg-amber-500/5 flex items-center justify-center mb-8 border border-amber-500/20">
                          {/* Animated timeline mockup */}
                          <svg viewBox="0 0 100 100" className="w-28 h-28 text-[#D4AF37]">
                            <line x1="30" y1="20" x2="30" y2="80" stroke="#cbd5e1" strokeWidth="2" strokeDasharray="2,2" />
                            <circle cx="30" cy="25" r="6" fill="#006B3F" />
                            <circle cx="30" cy="50" r="6" fill="#D4AF37" />
                            <circle cx="30" cy="75" r="6" fill="#cbd5e1" />
                            <text x="44" y="29" fill="#006B3F" className="text-[10px] font-sans font-bold">Signalé</text>
                            <text x="44" y="54" fill="#D4AF37" className="text-[10px] font-sans font-bold">En traitement</text>
                            <text x="44" y="79" fill="#94a3b8" className="text-[10px] font-sans font-bold">Résolu</text>
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-3 px-2">
                          Suivez l'évolution en temps réel
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed font-sans">
                          Soyez informé à chaque étape : de la prise en charge par les équipes techniques municipales jusqu'à la résolution complète.
                        </p>
                      </motion.div>
                    )}

                    {onboardingStep === 2 && (
                      <motion.div
                        key="onb-3"
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -50 }}
                        className="flex flex-col items-center text-center"
                      >
                        <div className="w-48 h-48 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 flex items-center justify-center mb-8 border border-emerald-500/20">
                          {/* Smart Mauritania City skyline mockup */}
                          <svg viewBox="0 0 100 100" className="w-28 h-28">
                            <rect x="15" y="50" width="16" height="30" rx="1" fill="#004D2D" />
                            <rect x="36" y="35" width="20" height="45" rx="1" fill="#006B3F" />
                            <rect x="62" y="45" width="22" height="35" rx="1" fill="#D4AF37" />
                            <circle cx="46" cy="18" r="4" fill="#D4AF37" />
                            {/* Star and moon vector above city */}
                            <path d="M40,25 C45,25 48,22 48,18 C44,21 40,21 38,18" fill="#D4AF37" />
                          </svg>
                        </div>
                        <h2 className="text-xl font-bold tracking-tight mb-3 px-2">
                          Participez au progrès de votre ville
                        </h2>
                        <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs leading-relaxed font-sans">
                          En collaborant activement, vous aidez le gouvernement à prioriser et optimiser la qualité des infrastructures nationales.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer Controls */}
                <div className="flex flex-col items-center gap-6 mb-6">
                  {/* Indicator Dots */}
                  <div className="flex gap-2">
                    {[0, 1, 2].map((i) => (
                      <span
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          onboardingStep === i ? 'w-5 bg-[#006B3F] dark:bg-amber-400' : 'w-1.5 bg-gray-300 dark:bg-gray-700'
                        }`}
                      ></span>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="w-full flex flex-col gap-3">
                    {onboardingStep < 2 ? (
                      <button
                        onClick={() => setOnboardingStep((prev) => prev + 1)}
                        className="w-full py-3.5 bg-[#006B3F] hover:bg-[#004D2D] text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-emerald-800/10 hover:shadow-emerald-800/20 transition-all cursor-pointer"
                        id="btn-next-onboarding"
                      >
                        Suivant <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setCurrentScreen('login')}
                        className="w-full py-3.5 bg-gradient-to-r from-[#006B3F] to-[#004D2D] text-white rounded-2xl flex items-center justify-center gap-2 text-sm font-bold shadow-lg shadow-emerald-800/25 transition-all hover:scale-[1.01] cursor-pointer"
                        id="btn-commencer"
                      >
                        Commencer <ArrowRight className="w-4 h-4" />
                      </button>
                    )}

                    <button
                      onClick={() => setCurrentScreen('login')}
                      className="w-full py-3 bg-transparent text-[#006B3F] dark:text-amber-400 hover:bg-emerald-500/5 rounded-2xl text-xs font-bold transition-all cursor-pointer border border-[#006B3F]/25 dark:border-amber-400/25"
                      id="btn-onboarding-login"
                    >
                      Se connecter directement
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: LOGIN SCREEN */}
            {currentScreen === 'login' && (
              <motion.div
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-between bg-slate-50 dark:from-slate-900 dark:to-slate-950 text-slate-800 dark:text-white"
              >
                {/* Form header container */}
                <div className="p-6 flex-1 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#006B3F] to-[#004D2D] flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-950/20">
                      <svg viewBox="0 0 100 100" className="w-10 h-10 fill-amber-400">
                        <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
                        <polygon points="50,22 53,29 61,29 55,34 57,41 50,37 43,41 45,34 39,29 47,29" />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white">Bienvenue !</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-sans mt-1">
                      Connectez-vous à votre espace citoyen SAWTI
                    </p>
                  </div>

                  {/* Form fields */}
                  <form 
                    onSubmit={(e) => { e.preventDefault(); setCurrentScreen('home'); }} 
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">
                        Email ou Numéro de téléphone
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type="text"
                          required
                          defaultValue={currentUser.email}
                          placeholder="votre.email@domain.mr"
                          className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none focus:border-[#006B3F] dark:focus:border-amber-400 transition-colors shadow-sm text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                          Mot de passe
                        </label>
                        <button 
                          type="button" 
                          className="text-[10px] text-amber-500 font-bold font-sans hover:underline"
                        >
                          Oublié ?
                        </button>
                      </div>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          defaultValue="123456"
                          placeholder="••••••••"
                          className="w-full pl-11 pr-11 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none focus:border-[#006B3F] dark:focus:border-amber-400 transition-colors shadow-sm text-slate-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3.5 mt-2 bg-[#006B3F] hover:bg-[#004D2D] text-white rounded-xl flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-emerald-800/15 cursor-pointer transition-transform active:scale-95"
                      id="btn-login-submit"
                    >
                      Se connecter <ArrowRight className="w-4 h-4" />
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6 text-center">
                    <hr className="border-slate-200 dark:border-slate-800" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 bg-slate-50 dark:bg-slate-950 text-[10px] text-gray-400 font-sans">
                      OU
                    </span>
                  </div>

                  {/* Google Login */}
                  <button
                    onClick={() => setCurrentScreen('home')}
                    type="button"
                    className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center gap-2.5 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shadow-sm text-slate-800 dark:text-white"
                  >
                    <svg viewBox="0 0 24 24" className="w-4 h-4">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                    </svg>
                    Continuer avec Google
                  </button>

                  <p className="text-center text-xs text-gray-500 dark:text-gray-400 font-sans mt-8">
                    Vous n'avez pas de compte ?{' '}
                    <button
                      onClick={() => {
                        setRegErrors({});
                        setCurrentScreen('register');
                      }}
                      className="text-[#006B3F] dark:text-amber-400 font-bold font-sans hover:underline"
                    >
                      Créer un compte
                    </button>
                  </p>
                </div>

                {/* Governmental Ribon Footer */}
                <div className="h-2 w-full flex">
                  <div className="flex-1 bg-[#C1272D]"></div> {/* Red */}
                  <div className="flex-2 bg-[#006B3F]"></div> {/* Green */}
                  <div className="w-1/12 bg-[#D4AF37]"></div> {/* Gold */}
                  <div className="flex-2 bg-[#006B3F]"></div> {/* Green */}
                  <div className="flex-1 bg-[#C1272D]"></div> {/* Red */}
                </div>
              </motion.div>
            )}

            {/* SCREEN 4: REGISTER SCREEN */}
            {currentScreen === 'register' && (
              <motion.div
                key="register"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 p-5 text-slate-800 dark:text-white"
              >
                <div className="flex items-center gap-2 mb-4">
                  <button 
                    onClick={() => setCurrentScreen('login')}
                    className="p-1 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <div>
                    <h3 className="font-sans font-bold text-sm">Inscription</h3>
                    <p className="text-[10px] text-gray-400 font-sans">Création d'identité citoyenne sécurisée</p>
                  </div>
                </div>

                <form onSubmit={handleRegister} className="flex-1 flex flex-col gap-3.5 pb-6">
                  {/* Name field */}
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                      Nom complet (Français / Arabe)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Ahmed Ould Mohamed"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs font-sans outline-none ${
                        regErrors.name ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                    {regErrors.name && <p className="text-[9px] text-red-500 font-sans mt-0.5">{regErrors.name}</p>}
                  </div>

                  {/* NNI field with real validation */}
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                      Numéro National d'Identité (NNI)
                    </label>
                    <input
                      type="text"
                      maxLength={10}
                      required
                      placeholder="Ex: 2890471203 (10 chiffres)"
                      value={regNni}
                      onChange={(e) => setRegNni(e.target.value)}
                      className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-mono text-xs outline-none ${
                        regErrors.nni ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                      }`}
                    />
                    {regErrors.nni ? (
                      <p className="text-[9px] text-red-500 font-sans mt-0.5">{regErrors.nni}</p>
                    ) : (
                      <p className="text-[8px] text-gray-400 font-sans mt-0.5">Le NNI est obligatoire pour authentifier la réclamation auprès du gouvernement.</p>
                    )}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Téléphone
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ex: 44123456"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-sans text-xs outline-none ${
                          regErrors.phone ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Email
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="nom@domain.mr"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl font-sans text-xs outline-none ${
                          regErrors.email ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  {/* Wilaya & Moughataa dynamic mapping */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Wilaya
                      </label>
                      <select
                        value={regWilaya}
                        onChange={(e) => setRegWilaya(e.target.value)}
                        className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none text-slate-900 dark:text-white"
                      >
                        <option value="">Sélectionner</option>
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Moughataa
                      </label>
                      <select
                        value={regMoughataa}
                        onChange={(e) => setRegMoughataa(e.target.value)}
                        className="w-full px-2 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none text-slate-900 dark:text-white"
                        disabled={!regWilaya}
                      >
                        {!regWilaya ? (
                          <option value="">Sélectionner Wilaya</option>
                        ) : (
                          WILAYAS_LIST.find(w => w.name === regWilaya)?.moughataas.map((m) => (
                            <option key={m} value={m}>{m}</option>
                          ))
                        )}
                      </select>
                    </div>
                  </div>

                  {/* Password fields */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Mot de passe
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="6+ caractères"
                        value={regPass}
                        onChange={(e) => setRegPass(e.target.value)}
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs outline-none ${
                          regErrors.pass ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Confirmation
                      </label>
                      <input
                        type="password"
                        required
                        placeholder="Confirmer"
                        value={regConfirm}
                        onChange={(e) => setRegConfirm(e.target.value)}
                        className={`w-full px-3 py-2 bg-white dark:bg-slate-900 border rounded-xl text-xs outline-none ${
                          regErrors.confirm ? 'border-red-500' : 'border-slate-200 dark:border-slate-800'
                        }`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#006B3F] hover:bg-[#004D2D] text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-800/15 cursor-pointer mt-2 transition-transform active:scale-95"
                    id="btn-register-submit"
                  >
                    Créer mon compte citoyen
                  </button>
                </form>
              </motion.div>
            )}

            {/* SCREEN 5: HOME SCREEN */}
            {currentScreen === 'home' && (
              <motion.div
                key="home"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
              >
                {/* Header Section */}
                <div className="px-5 pt-4 pb-2 flex justify-between items-center bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/60 shadow-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 border border-emerald-300 overflow-hidden flex items-center justify-center">
                      <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                        alt="Ahmed avatar"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-black">Bonjour {currentUser.name.split(' ')[0]}</span>
                        <span>👋</span>
                      </div>
                      <span className="text-[9px] text-gray-400 font-sans block">Citoyen authentifié</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => { onReadNotifications(); setCurrentScreen('notifications'); }}
                    className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-300 hover:bg-[#006B3F]/10 hover:text-[#006B3F] transition-all cursor-pointer"
                  >
                    <Bell className="w-4.5 h-4.5" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-slate-900"></span>
                    )}
                  </button>
                </div>

                {/* Main Scroll Area */}
                <div className="flex-1 overflow-y-auto px-5 py-4 flex flex-col gap-5">
                  
                  {/* CARTE CITOYENNE NUMÉRIQUE */}
                  <div className="relative w-full aspect-[1.58/1] rounded-2xl bg-gradient-to-br from-[#004D2D] via-[#006B3F] to-emerald-950 p-4 text-white shadow-xl overflow-hidden border border-amber-500/20">
                    {/* Golden Pattern Accent */}
                    <div className="absolute right-0 bottom-0 top-0 w-2/5 opacity-[0.05] pointer-events-none">
                      {/* Stylized geometric background */}
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-amber-400 fill-none" strokeWidth="2">
                        <circle cx="100" cy="100" r="80" />
                        <circle cx="100" cy="100" r="50" />
                      </svg>
                    </div>

                    {/* Logo & Coat of Arms outline watermark */}
                    <div className="absolute -left-4 -bottom-4 w-28 h-28 opacity-[0.08] fill-white pointer-events-none">
                      <svg viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" stroke="white" strokeWidth="3" />
                        <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
                      </svg>
                    </div>

                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-[7px] font-mono tracking-widest text-amber-400 uppercase font-bold block">
                          République Islamique de Mauritanie
                        </span>
                        <h4 className="text-[10px] font-bold tracking-tight text-white mt-0.5">
                          CARTE CITOYENNE NUMÉRIQUE
                        </h4>
                      </div>
                      <div className="w-6 h-6 rounded bg-amber-400/10 flex items-center justify-center border border-amber-400/30">
                        <svg viewBox="0 0 100 100" className="w-4 h-4 fill-amber-400">
                          <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
                        </svg>
                      </div>
                    </div>

                    <div className="mt-5 flex justify-between items-end">
                      <div className="flex flex-col gap-1 z-10">
                        <div className="text-[11px] font-black tracking-wide">
                          {currentUser.name}
                        </div>
                        <div className="font-mono text-[9px] text-emerald-200 mt-1">
                          NNI: <span className="text-amber-400 font-bold">{currentUser.nni}</span>
                        </div>
                        <div className="text-[8px] text-emerald-100 flex items-center gap-1 font-sans">
                          <MapPin className="w-2 h-2 text-amber-400" />
                          {currentUser.moughataa}, {currentUser.wilaya}
                        </div>
                      </div>

                      {/* Mock QR Code */}
                      <div className="p-1 rounded bg-white border border-amber-500/25 shadow-md flex items-center justify-center">
                        <svg viewBox="0 0 100 100" className="w-9 h-9 stroke-slate-900 fill-slate-900" strokeWidth="1">
                          {/* Simulated QR Code pixels */}
                          <rect x="0" y="0" width="20" height="20" />
                          <rect x="0" y="80" width="20" height="20" />
                          <rect x="80" y="0" width="20" height="20" />
                          <rect x="30" y="30" width="40" height="40" />
                          <rect x="10" y="50" width="10" height="10" />
                          <rect x="50" y="10" width="10" height="10" />
                          <rect x="70" y="80" width="20" height="10" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* STATISTIQUES RAPIDES */}
                  <div>
                    <h3 className="text-xs font-bold tracking-tight mb-2 flex items-center gap-1">
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#006B3F] dark:text-amber-400" />
                      Statistiques de mes réclamations
                    </h3>
                    <div className="grid grid-cols-4 gap-2">
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
                        <span className="text-sm font-bold font-mono text-[#006B3F] dark:text-amber-400 block">{myTotal}</span>
                        <span className="text-[8px] text-gray-400 font-sans block">Total</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
                        <span className="text-sm font-bold font-mono text-emerald-500 block">{myResolved}</span>
                        <span className="text-[8px] text-gray-400 font-sans block">Résolues</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
                        <span className="text-sm font-bold font-mono text-amber-500 block">{myActive}</span>
                        <span className="text-[8px] text-gray-400 font-sans block">En cours</span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 shadow-sm text-center">
                        <span className="text-xs font-bold font-mono text-blue-500 block">48h</span>
                        <span className="text-[8px] text-gray-400 font-sans block">Tps Moyen</span>
                      </div>
                    </div>
                  </div>

                  {/* ACTIONS RAPIDES (CATEGORIES GRID) */}
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-xs font-bold tracking-tight">Signalement rapide</h3>
                      <span className="text-[9px] text-[#006B3F] dark:text-amber-400 font-sans font-bold uppercase">Sélectionnez</span>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-2">
                      {Object.entries(CATEGORY_DETAILS).map(([key, value]) => (
                        <button
                          key={key}
                          onClick={() => {
                            setSelectedCategory(key as ComplaintCategory);
                            setCurrentScreen('new_complaint');
                          }}
                          className="flex flex-col items-center justify-center p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#006B3F]/40 hover:bg-emerald-500/5 transition-all cursor-pointer group shadow-sm text-center"
                          id={`action-cat-${key}`}
                        >
                          <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-950 flex items-center justify-center mb-1.5 border border-slate-100 dark:border-slate-800/50 group-hover:scale-110 transition-transform">
                            {getIcon(key)}
                          </div>
                          <span className="text-[8px] font-bold text-gray-500 dark:text-gray-300 tracking-tight leading-none line-clamp-1 block">
                            {value.label.replace(' & Routes', '').replace(' publique', '').replace(' Municipale', '').replace(' Publique', '')}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* SECTION ACTUALITÉS */}
                  <div>
                    <h3 className="text-xs font-bold tracking-tight mb-2.5 flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#006B3F] dark:text-amber-400" />
                      Communiqués & Actualités
                    </h3>
                    <div className="flex flex-col gap-2.5">
                      {MOCK_NEWS.map((item) => (
                        <div
                          key={item.id}
                          className="flex gap-3 p-2 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/80 hover:border-slate-200 transition-all shadow-sm"
                        >
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                            <img
                              src={item.imageUrl}
                              alt={item.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div>
                              <div className="flex justify-between items-center">
                                <span className="text-[7px] font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-500/10 text-[#006B3F] dark:text-amber-400 font-sans">
                                  {item.category}
                                </span>
                                <span className="text-[7px] text-gray-400 font-mono">{item.date}</span>
                              </div>
                              <h4 className="text-[10px] font-bold tracking-tight mt-1 text-slate-900 dark:text-white line-clamp-1">
                                {item.title}
                              </h4>
                              <p className="text-[8px] text-gray-400 font-sans mt-0.5 line-clamp-2 leading-relaxed">
                                {item.excerpt}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* BOTTOM NAVIGATION */}
                <div className="h-14 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-around px-2 py-1 shadow-inner z-30">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                      currentScreen === 'home' ? 'text-[#006B3F] dark:text-amber-400' : 'text-gray-400 hover:text-slate-600'
                    }`}
                  >
                    <Compass className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5 font-sans">Accueil</span>
                  </button>

                  <button
                    onClick={() => {
                      setComplaintFilter('all');
                      setCurrentScreen('complaint_list');
                    }}
                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                      currentScreen === 'complaint_list' || currentScreen === 'complaint_detail' ? 'text-[#006B3F] dark:text-amber-400' : 'text-gray-400 hover:text-slate-600'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5 font-sans">Réclamations</span>
                  </button>

                  <button
                    onClick={() => {
                      setSelectedCategory(null);
                      setCurrentScreen('new_complaint');
                    }}
                    className="flex flex-col items-center justify-center -translate-y-4 w-11 h-11 rounded-full bg-gradient-to-br from-[#006B3F] to-[#004D2D] text-white shadow-lg shadow-emerald-800/30 border-4 border-white dark:border-slate-950 transition-transform active:scale-90 cursor-pointer"
                  >
                    <Plus className="w-6 h-6" />
                  </button>

                  <button
                    onClick={() => { onReadNotifications(); setCurrentScreen('notifications'); }}
                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer relative ${
                      currentScreen === 'notifications' ? 'text-[#006B3F] dark:text-amber-400' : 'text-gray-400 hover:text-slate-600'
                    }`}
                  >
                    <Bell className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5 font-sans">Notifications</span>
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-1 right-5 w-1.5 h-1.5 rounded-full bg-red-500 ring-1 ring-white"></span>
                    )}
                  </button>

                  <button
                    onClick={() => setCurrentScreen('profil')}
                    className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
                      currentScreen === 'profil' ? 'text-[#006B3F] dark:text-amber-400' : 'text-gray-400 hover:text-slate-600'
                    }`}
                  >
                    <User className="w-5 h-5" />
                    <span className="text-[8px] font-bold mt-0.5 font-sans">Profil</span>
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 6: NEW COMPLAINT FORM */}
            {currentScreen === 'new_complaint' && (
              <motion.div
                key="new_complaint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCurrentScreen('home')}
                      className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </button>
                    <span className="text-xs font-black">Nouveau signalement</span>
                  </div>
                  <button 
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg text-gray-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleAddComplaintSubmit} className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {/* Category Picker Selector */}
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5 font-sans">
                      Étape 1 : Choisir la catégorie
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(CATEGORY_DETAILS).map(([key, value]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedCategory(key as ComplaintCategory)}
                          className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                            selectedCategory === key
                              ? 'bg-emerald-500/10 border-[#006B3F] text-[#006B3F] dark:border-amber-400 dark:text-amber-400'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          <span className="p-1 bg-slate-100 dark:bg-slate-950 rounded-lg">{getIcon(key)}</span>
                          <span className="text-[10px] font-bold line-clamp-1">{value.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="flex flex-col gap-3">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Étape 2 : Titre court du problème
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Fuite d'eau Carrefour Shifa"
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none text-slate-900 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Description détaillée
                      </label>
                      <textarea
                        required
                        rows={3}
                        placeholder="Veuillez décrire le problème avec le plus de précisions possibles (lieux, repères, impact)..."
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-sans outline-none text-slate-900 dark:text-white resize-none"
                      />
                    </div>
                  </div>

                  {/* Photo Drag & Drop Upload simulated area */}
                  <div>
                    <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                      Étape 3 : Joindre une photo (Recommandé)
                    </label>
                    <div
                      onClick={handlePhotoUpload}
                      className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-white dark:bg-slate-900 text-center flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-[#006B3F] hover:bg-emerald-500/5 transition-colors"
                      id="upload-drag-drop-zone"
                    >
                      {newImage ? (
                        <div className="relative w-full h-24 rounded-lg overflow-hidden border">
                          <img
                            src={newImage}
                            alt="Mock upload"
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => { e.stopPropagation(); setNewImage(null); }}
                            className="absolute top-1 right-1 p-1 rounded-full bg-slate-950/70 text-white hover:bg-red-600 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : isUploading ? (
                        <div className="flex flex-col items-center gap-1.5 py-2">
                          <span className="w-5 h-5 rounded-full border-2 border-amber-500 border-t-transparent animate-spin"></span>
                          <span className="text-[10px] text-gray-400 font-sans">Chargement de la photo...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud className="w-6 h-6 text-[#006B3F] dark:text-amber-500" />
                          <span className="text-[10px] font-bold">Cliquez pour simuler une photo</span>
                          <span className="text-[8px] text-gray-400 font-sans">Prendre une photo ou parcourir vos fichiers</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Wilaya & Moughataa location configuration inside form */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Wilaya du problème
                      </label>
                      <select
                        value={newWilaya}
                        onChange={(e) => setNewWilaya(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-sans outline-none text-slate-900 dark:text-white"
                      >
                        {WILAYAS_LIST.map((w) => (
                          <option key={w.id} value={w.name}>{w.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1 font-sans">
                        Moughataa du problème
                      </label>
                      <select
                        value={newMoughataa}
                        onChange={(e) => setNewMoughataa(e.target.value)}
                        className="w-full px-2 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] font-sans outline-none text-slate-900 dark:text-white"
                      >
                        {WILAYAS_LIST.find(w => w.name === newWilaya)?.moughataas.map((m) => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Simulated Interactive GPS Point Picker */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                        Étape 4 : Localisation GPS
                      </span>
                      <button
                        type="button"
                        onClick={handleSimulateGPS}
                        className="text-[9px] text-[#006B3F] dark:text-amber-400 font-bold font-sans flex items-center gap-1 bg-emerald-500/5 px-2 py-0.5 rounded border border-emerald-500/10 cursor-pointer hover:bg-emerald-500/10"
                        id="btn-simulate-gps"
                      >
                        <MapPin className="w-2.5 h-2.5" />
                        Simuler position actuelle
                      </button>
                    </div>

                    <div className="h-24 bg-emerald-100 dark:bg-emerald-950/20 rounded-lg relative overflow-hidden flex items-center justify-center border border-emerald-200/50">
                      {/* Grid representation of Nouakchott map */}
                      <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#006b3f_1.5px,transparent_1.5px)] [background-size:12px_12px]"></div>
                      <div className="absolute left-6 top-4 w-2 h-2 rounded-full bg-emerald-700"></div>
                      <div className="absolute right-12 bottom-6 w-3 h-3 rounded-full bg-emerald-700/60"></div>
                      
                      {gpsSimulated ? (
                        <div className="z-10 flex flex-col items-center text-center p-2 animate-bounce">
                          <MapPin className="w-6 h-6 text-red-500 fill-red-100" />
                          <span className="text-[9px] font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded shadow mt-1">
                            Lat: {gpsSimulated.lat}, Lng: {gpsSimulated.lng}
                          </span>
                        </div>
                      ) : (
                        <div className="z-10 text-center p-2 text-gray-400">
                          <Map className="w-5 h-5 mx-auto text-emerald-600 mb-1" />
                          <span className="text-[8px] font-sans">Aucune coordonnée GPS fixée</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Priority and Submit button */}
                  <div className="flex items-center justify-between gap-4 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-sans">Priorité :</span>
                      <select
                        value={newPriority}
                        onChange={(e) => setNewPriority(e.target.value as ComplaintPriority)}
                        className="px-2 py-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-[9px] font-sans outline-none text-slate-900 dark:text-white"
                      >
                        <option value="basse">Basse</option>
                        <option value="moyenne">Moyenne</option>
                        <option value="haute">Haute</option>
                        <option value="critique">Critique</option>
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={!selectedCategory || !newTitle}
                      className="px-4 py-2 bg-gradient-to-r from-[#006B3F] to-[#004D2D] disabled:from-slate-400 disabled:to-slate-300 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center gap-1.5 hover:scale-[1.01] transition-all"
                      id="btn-send-complaint"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Envoyer la réclamation
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* SCREEN 7: MY COMPLAINTS LIST */}
            {currentScreen === 'complaint_list' && (
              <motion.div
                key="complaint_list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
              >
                {/* Header */}
                <div className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shadow-sm">
                  <h3 className="font-sans font-black text-sm">Mes Signalements</h3>
                  <button 
                    onClick={() => { setSelectedCategory(null); setCurrentScreen('new_complaint'); }}
                    className="p-1 rounded-lg bg-emerald-500/10 text-[#006B3F] dark:text-amber-400 border border-emerald-500/20 hover:bg-[#006B3F]/20 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Filter Tabs Row */}
                <div className="bg-white dark:bg-slate-900 px-3 py-2 flex gap-1.5 border-b border-slate-100 dark:border-slate-800 overflow-x-auto select-none">
                  {[
                    { id: 'all', label: 'Toutes' },
                    { id: 'signalee', label: 'Attente' },
                    { id: 'en_cours', label: 'En Cours' },
                    { id: 'resolue', label: 'Résolues' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setComplaintFilter(tab.id as any)}
                      className={`px-3 py-1.5 rounded-full text-[10px] font-semibold transition-all cursor-pointer ${
                        complaintFilter === tab.id
                          ? 'bg-[#006B3F] text-white dark:bg-amber-400 dark:text-slate-950 shadow-sm'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200'
                      }`}
                      id={`tab-filter-${tab.id}`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* List Container */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                  {filteredComplaints.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                      <FileText className="w-12 h-12 text-slate-300 dark:text-slate-700 mb-2.5" />
                      <h4 className="font-sans font-bold text-xs">Aucune réclamation trouvée</h4>
                      <p className="text-[10px] text-gray-500 dark:text-gray-400 max-w-[200px] mt-1">
                        Utilisez le bouton "+" pour signaler votre premier dysfonctionnement de service public.
                      </p>
                    </div>
                  ) : (
                    filteredComplaints.map((comp) => (
                      <div
                        key={comp.id}
                        onClick={() => {
                          setSelectedComplaintId(comp.id);
                          setCurrentScreen('complaint_detail');
                        }}
                        className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-[#006B3F]/25 transition-all shadow-sm p-3.5 cursor-pointer flex flex-col gap-2.5 hover:shadow"
                        id={`comp-card-${comp.id}`}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-mono text-[8px] font-bold text-gray-400">
                              REF: {comp.reference}
                            </span>
                            <h4 className="text-[11px] font-bold tracking-tight text-slate-900 dark:text-white mt-0.5 line-clamp-1">
                              {comp.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {getPriorityBadge(comp.priority)}
                            {getStatusBadge(comp.status)}
                          </div>
                        </div>

                        {/* Location and Category */}
                        <div className="flex items-center justify-between text-[8.5px] text-gray-500 border-t border-slate-100 dark:border-slate-800/80 pt-2 font-sans">
                          <div className="flex items-center gap-1">
                            {getIcon(comp.category)}
                            <span className="font-bold">{CATEGORY_DETAILS[comp.category]?.label}</span>
                          </div>
                          <div className="flex items-center gap-0.5 text-gray-400">
                            <MapPin className="w-2.5 h-2.5" />
                            {comp.moughataa}, {comp.wilaya.replace('Nouakchott ', 'N.')}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Bottom navigation footer shortcut */}
                <div className="h-10 border-t border-slate-100 dark:border-slate-800/60 bg-white dark:bg-slate-900 flex justify-center items-center">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="text-[10px] text-[#006B3F] dark:text-amber-400 font-bold font-sans hover:underline flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Retour à l'accueil
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 8: COMPLAINT DETAIL WITH INTERACTIVE TIMELINE */}
            {currentScreen === 'complaint_detail' && selectedComplaint && (
              <motion.div
                key="complaint_detail"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
              >
                {/* Header */}
                <div className="px-4 py-3 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shadow-sm">
                  <div className="flex items-center gap-1.5">
                    <button 
                      onClick={() => setCurrentScreen('complaint_list')}
                      className="p-1 rounded-lg text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      <ChevronLeft className="w-4.5 h-4.5" />
                    </button>
                    <div>
                      <span className="text-xs font-black block">Détails réclamation</span>
                      <span className="text-[8px] font-mono text-gray-400 block">{selectedComplaint.reference}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {getStatusBadge(selectedComplaint.status)}
                  </div>
                </div>

                {/* Main scroll details content */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                  {/* Title and stats summary card */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-2">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xs font-bold tracking-tight text-slate-900 dark:text-white">
                        {selectedComplaint.title}
                      </h3>
                      {getPriorityBadge(selectedComplaint.priority)}
                    </div>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 leading-relaxed font-sans">
                      {selectedComplaint.description}
                    </p>

                    {selectedComplaint.imageUrl && (
                      <div className="w-full h-32 rounded-lg overflow-hidden border mt-1">
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Réclamation"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div className="flex items-center justify-between text-[8px] text-gray-400 border-t pt-2 mt-1">
                      <span>Créé le: {new Date(selectedComplaint.createdAt).toLocaleDateString()}</span>
                      {selectedComplaint.assignedAgent && (
                        <span className="text-[#006B3F] dark:text-amber-400 font-bold font-sans">
                          Assigné: {selectedComplaint.assignedAgent}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* INTERACTIVE VERTICAL TIMELINE */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3 font-sans">
                      Suivi d'avancement de la réclamation
                    </h4>

                    {/* Timeline elements */}
                    <div className="relative flex flex-col gap-4 pl-6">
                      {/* Vertical line connector */}
                      <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-slate-200 dark:bg-slate-800"></div>

                      {[
                        { step: 'signalee', label: 'Réclamation Signalée', desc: 'Déposée avec succès sur la plateforme.' },
                        { step: 'assignee', label: 'Assignée à un Service', desc: 'Transmise aux ingénieurs municipaux compétents.' },
                        { step: 'en_cours', label: 'Traitement En cours', desc: 'Équipes de terrain en phase de réparation.' },
                        { step: 'resolue', label: 'Résolue & Finalisée', desc: 'Dysfonctionnement résorbé et contrôlé.' }
                      ].map((item, index) => {
                        // Check if current step was passed
                        const stepsOrder = ['signalee', 'assignee', 'en_cours', 'resolue'];
                        const currentIdx = stepsOrder.indexOf(selectedComplaint.status);
                        const stepIdx = stepsOrder.indexOf(item.step);
                        const isDone = stepIdx <= currentIdx;
                        const isActive = item.step === selectedComplaint.status;

                        return (
                          <div key={item.step} className="relative flex flex-col">
                            {/* Bullet icon */}
                            <div className={`absolute -left-[21px] top-0.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-colors z-10 ${
                              isDone
                                ? 'bg-[#006B3F] border-[#006B3F] text-white'
                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-transparent'
                            }`}>
                              <CheckCircle2 className="w-3 h-3 fill-white stroke-[#006B3F]" />
                            </div>

                            <span className={`text-[10px] font-bold ${
                              isActive ? 'text-[#006B3F] dark:text-amber-400' : isDone ? 'text-slate-800 dark:text-slate-200' : 'text-gray-400'
                            }`}>
                              {item.label}
                            </span>
                            <span className="text-[8px] text-gray-400 font-sans mt-0.5 leading-tight">
                              {item.desc}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* COMMENTS FEED AREA */}
                  <div className="bg-white dark:bg-slate-900 rounded-xl p-3.5 border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-sans">
                      Historique de communication
                    </h4>

                    {/* Messages */}
                    <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto">
                      {selectedComplaint.comments.map((comm) => (
                        <div
                          key={comm.id}
                          className={`p-2 rounded-lg text-[9.5px] max-w-[85%] ${
                            comm.role === 'citoyen'
                              ? 'bg-emerald-500/10 text-slate-800 dark:text-slate-200 self-end border border-emerald-500/10'
                              : comm.role === 'systeme'
                              ? 'bg-slate-100 dark:bg-slate-950 text-gray-500 text-center mx-auto w-full border border-slate-200/40 dark:border-slate-800/40'
                              : 'bg-amber-500/10 text-slate-800 dark:text-slate-200 self-start border border-amber-500/10'
                          }`}
                        >
                          <div className="flex justify-between items-center gap-2 font-bold mb-0.5 text-[8px]">
                            <span className={comm.role === 'agent' ? 'text-amber-500' : 'text-slate-400'}>
                              {comm.author}
                            </span>
                            <span className="text-gray-400 font-mono text-[7.5px]">
                              {new Date(comm.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="font-sans leading-relaxed text-[9px]">{comm.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Add reply box */}
                    <form onSubmit={handleAddComment} className="flex gap-2 border-t pt-2 mt-1">
                      <input
                        type="text"
                        required
                        placeholder="Répondre à l'agent responsable..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="flex-1 px-3 py-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-[10px] outline-none text-slate-900 dark:text-white"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-[#006B3F] hover:bg-[#004D2D] text-white rounded-lg flex items-center justify-center shadow transition-all cursor-pointer"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </form>
                  </div>

                </div>
              </motion.div>
            )}

            {/* SCREEN 9: NOTIFICATIONS SCREEN */}
            {currentScreen === 'notifications' && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white"
              >
                {/* Header */}
                <div className="px-5 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800/80 flex justify-between items-center shadow-sm">
                  <h3 className="font-sans font-black text-sm">Notifications</h3>
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="p-1 rounded-lg text-gray-400 hover:bg-slate-100 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Notifications Center List */}
                <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2.5">
                  {notifications.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-gray-400">
                      <Bell className="w-10 h-10 text-slate-300 mb-2" />
                      <span className="text-xs font-bold">Aucune notification</span>
                    </div>
                  ) : (
                    notifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          if (notif.complaintId) {
                            setSelectedComplaintId(notif.complaintId);
                            setCurrentScreen('complaint_detail');
                          }
                        }}
                        className={`p-3 rounded-xl border flex gap-3 transition-all cursor-pointer shadow-sm ${
                          notif.read
                            ? 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800/80 opacity-75'
                            : 'bg-white dark:bg-slate-900 border-[#006B3F]/25 dark:border-amber-400/25 shadow-emerald-500/5 font-semibold'
                        }`}
                      >
                        {/* Status Icon */}
                        <div className="mt-0.5">
                          {notif.type === 'success' ? (
                            <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500" />
                          ) : notif.type === 'alert' ? (
                            <ShieldAlert className="w-4.5 h-4.5 text-red-500" />
                          ) : (
                            <Bell className="w-4.5 h-4.5 text-amber-500" />
                          )}
                        </div>

                        <div className="flex-1 flex flex-col">
                          <span className="text-[10px] text-slate-900 dark:text-white tracking-tight">
                            {notif.title}
                          </span>
                          <span className="text-[8.5px] text-gray-400 font-sans mt-0.5 leading-relaxed">
                            {notif.description}
                          </span>
                          <span className="text-[7.5px] text-slate-400 font-mono mt-1">
                            {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Footer Back Button */}
                <div className="h-12 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="text-[10px] text-[#006B3F] dark:text-amber-400 font-bold font-sans hover:underline"
                  >
                    Retour à la page d'accueil
                  </button>
                </div>
              </motion.div>
            )}

            {/* SCREEN 10: PROFIL */}
            {currentScreen === 'profil' && (
              <motion.div
                key="profil"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-white font-sans"
              >
                {/* Header Profile Cover */}
                <div className="relative pt-8 pb-5 px-5 bg-gradient-to-br from-[#006B3F] to-[#004D2D] text-white flex flex-col items-center text-center">
                  {/* Flag Wave Accent */}
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/25 text-[8px] font-mono text-amber-400">
                    S-M-001
                  </div>

                  <div className="relative w-16 h-16 rounded-full border-2 border-white overflow-hidden shadow-md mb-2 bg-emerald-800 flex items-center justify-center">
                    <img
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200"
                      alt="Avatar"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h3 className="text-xs font-black tracking-tight">{currentUser.name}</h3>
                  <p className="text-[8px] text-emerald-200 mt-0.5">NNI: {currentUser.nni}</p>
                </div>

                {/* Profile Operations Info Settings */}
                <div className="flex-1 p-4 flex flex-col gap-4 overflow-y-auto">
                  {/* Personal Information Grid */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3.5 flex flex-col gap-2 text-xs">
                    <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1.5">
                      Coordonnées personnelles
                    </h4>

                    <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800/80">
                      <span className="text-gray-400 font-sans">Email</span>
                      <span className="font-semibold">{currentUser.email}</span>
                    </div>

                    <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800/80">
                      <span className="text-gray-400 font-sans">Téléphone</span>
                      <span className="font-semibold">{currentUser.phone}</span>
                    </div>

                    <div className="flex justify-between border-b pb-2 border-slate-100 dark:border-slate-800/80">
                      <span className="text-gray-400 font-sans">Wilaya</span>
                      <span className="font-semibold">{currentUser.wilaya}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-400 font-sans">Moughataa</span>
                      <span className="font-semibold">{currentUser.moughataa}</span>
                    </div>
                  </div>

                  {/* Settings toggles */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl p-3 flex flex-col gap-3">
                    <h4 className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                      Paramètres de l'application
                    </h4>

                    {/* Dark mode Toggle option */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold flex items-center gap-1.5">
                        {isDarkMode ? <Moon className="w-4 h-4 text-amber-500" /> : <Sun className="w-4 h-4 text-[#006B3F]" />}
                        Mode Sombre (Dark Mode)
                      </span>
                      <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className={`w-9 h-5 rounded-full p-0.5 transition-colors duration-300 ${
                          isDarkMode ? 'bg-amber-400' : 'bg-slate-200'
                        }`}
                        id="btn-toggle-dark-mode"
                      >
                        <div
                          className={`w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                            isDarkMode ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        ></div>
                      </button>
                    </div>

                    {/* Language selector selection */}
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold">Langue / اللغة</span>
                      <select className="px-2 py-0.5 border dark:border-slate-800 rounded bg-slate-50 dark:bg-slate-950 font-semibold text-[10px]">
                        <option value="fr">Français</option>
                        <option value="ar">العربية (Arabe)</option>
                      </select>
                    </div>
                  </div>

                  {/* Danger zone log out action */}
                  <button
                    onClick={() => {
                      setCurrentScreen('login');
                    }}
                    className="w-full py-3 bg-red-500/10 border border-red-500/25 text-red-600 rounded-xl text-xs font-bold hover:bg-red-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    id="btn-logout"
                  >
                    <LogOut className="w-4 h-4" /> Se déconnecter de SAWTI
                  </button>
                </div>

                {/* Bottom nav back shortcut */}
                <div className="h-12 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-center items-center">
                  <button
                    onClick={() => setCurrentScreen('home')}
                    className="text-[10px] text-[#006B3F] dark:text-amber-400 font-bold hover:underline"
                  >
                    Retourner à l'accueil
                  </button>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Home Indicator Bar */}
        <div className="h-5 flex items-center justify-center bg-transparent select-none pointer-events-none">
          <div className={`w-32 h-1 rounded-full ${isDarkMode ? 'bg-slate-800' : 'bg-slate-300'}`}></div>
        </div>

      </div>
    </div>
  );
};
