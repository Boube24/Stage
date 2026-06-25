/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Users,
  MapPin,
  FileSpreadsheet,
  Settings,
  Search,
  Filter,
  Check,
  UserCheck,
  ChevronRight,
  Eye,
  MessageSquare,
  ShieldCheck,
  RefreshCw,
  TrendingUp,
  Inbox,
  UserCheck2,
  Send,
  Sliders,
  X
} from 'lucide-react';
import { Complaint, ComplaintCategory, ComplaintStatus, ComplaintPriority, WilayaData, CitizenUser, NotificationItem } from '../types';
import { CATEGORY_DETAILS, WILAYAS_LIST } from '../data/mockData';
import { MauritaniaMap } from './MauritaniaMap';

interface AdminPortalProps {
  complaints: Complaint[];
  onUpdateComplaint: (updatedComplaint: Complaint) => void;
  onAddNotification: (notification: NotificationItem) => void;
  isDarkMode: boolean;
  currentUser: CitizenUser;
}

type AdminTab = 'dashboard' | 'reclamations' | 'services' | 'statistiques';

export const AdminPortal: React.FC<AdminPortalProps> = ({
  complaints,
  onUpdateComplaint,
  onAddNotification,
  isDarkMode,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [selectedWilaya, setSelectedWilaya] = useState<string | null>(null);
  
  // Table Filtering & Queue States
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  
  // Admin Action States for Selected Complaint
  const [assigneeAgent, setAssigneeAgent] = useState('');
  const [adminComment, setAdminComment] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // -----------------------------------------------------------------
  // KPI METRIC CALCULATIONS
  // -----------------------------------------------------------------
  const totalCount = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolue').length;
  const pendingCount = complaints.filter((c) => c.status === 'signalee').length;
  const inProgressCount = complaints.filter((c) => c.status === 'en_cours' || c.status === 'assignee').length;
  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 100;

  // Calculate statistics per category
  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    Object.keys(CATEGORY_DETAILS).forEach((key) => {
      stats[key] = complaints.filter((c) => c.category === key).length;
    });
    return stats;
  };

  // Helper labels
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'signalee': return 'Nouveau (Signalé)';
      case 'assignee': return 'Assigné au Service';
      case 'en_cours': return 'En cours de traitement';
      case 'resolue': return 'Résolu / Clôturé';
      case 'fermee': return 'Fermé';
      default: return status;
    }
  };

  // Perform Agent Assignment / Status Update Action
  const handleAdminAction = (e: React.FormEvent, statusToSet?: ComplaintStatus) => {
    e.preventDefault();
    if (!selectedComplaintId) return;

    const original = complaints.find((c) => c.id === selectedComplaintId);
    if (!original) return;

    let updatedStatus = statusToSet || original.status;
    let comments = [...original.comments];

    // Build comment if administrative feedback is entered
    if (adminComment.trim()) {
      comments.push({
        id: `c-adm-${Date.now()}`,
        author: assigneeAgent || 'Superviseur National SAWTI',
        role: 'agent',
        text: adminComment.trim(),
        createdAt: new Date().toISOString(),
      });
    }

    // Build comment if status is changed
    if (statusToSet && statusToSet !== original.status) {
      comments.push({
        id: `c-sys-${Date.now()}`,
        author: 'Système Administrateur',
        role: 'systeme',
        text: `Statut mis à jour de "${getStatusLabel(original.status)}" à "${getStatusLabel(statusToSet)}" par le Ministère de la Transition Numérique.`,
        createdAt: new Date().toISOString(),
      });

      // PUSH LIVE SYSTEM NOTIFICATION TO CLIENT SIMULATOR STATE
      onAddNotification({
        id: `notif-sys-${Date.now()}`,
        title: `Mise à jour : ${original.title.substring(0, 25)}...`,
        description: `Votre réclamation est passée à l'état : ${getStatusLabel(statusToSet)}.`,
        type: statusToSet === 'resolue' ? 'success' : 'info',
        complaintId: original.id,
        createdAt: new Date().toISOString(),
        read: false,
      });
    }

    const updatedComplaint: Complaint = {
      ...original,
      status: updatedStatus,
      assignedAgent: assigneeAgent.trim() || original.assignedAgent || 'Service Technique Central',
      comments,
      updatedAt: new Date().toISOString(),
    };

    onUpdateComplaint(updatedComplaint);

    // Clean field values and trigger success animation
    setAdminComment('');
    setActionSuccessMsg('Réclamation mise à jour avec succès !');
    setTimeout(() => setActionSuccessMsg(''), 3000);
  };

  // Filter queue records based on search keywords, selected Wilaya (clicked on map), status, and category
  const getFilteredQueue = () => {
    return complaints.filter((c) => {
      const matchSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.citizenNni.includes(searchTerm);

      const matchWilaya = selectedWilaya
        ? c.wilaya.toLowerCase() === selectedWilaya.toLowerCase()
        : true;

      const matchStatus = statusFilter === 'all' ? true : c.status === statusFilter;
      const matchCategory = categoryFilter === 'all' ? true : c.category === categoryFilter;

      return matchSearch && matchWilaya && matchStatus && matchCategory;
    });
  };

  const selectedComplaint = complaints.find((c) => c.id === selectedComplaintId);

  return (
    <div className="w-full h-full flex flex-col lg:flex-row">
      {/* 🏛️ GOVERNMENTAL SIDEBAR PANELS */}
      <div className={`w-full lg:w-64 flex-shrink-0 flex flex-col justify-between border-r ${
        isDarkMode 
          ? 'bg-slate-900 border-slate-800 text-slate-100' 
          : 'bg-emerald-950 border-emerald-900 text-white shadow-xl'
      }`}>
        
        {/* Portal Header */}
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
            {/* National Crest Mini Shield */}
            <svg viewBox="0 0 100 100" className="w-6 h-6 fill-amber-500 drop-shadow">
              <path d="M50,75 C68.5,75 80,60 80,45 C75,58 62,65 50,65 C38,65 25,58 20,45 C20,60 31.5,75 50,75 Z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-black tracking-widest text-amber-500">SAWTI ADMIN</h2>
            <span className="text-[9px] text-gray-400 block tracking-wider uppercase font-mono">République de Mauritanie</span>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 py-6 flex flex-col gap-1.5 select-none">
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2 block">
            SUPERVISION COMMUNE
          </span>

          {[
            { id: 'dashboard', label: 'Tableau de bord', icon: <BarChart3 className="w-4.5 h-4.5" /> },
            { id: 'reclamations', label: 'File des Réclamations', icon: <Inbox className="w-4.5 h-4.5" /> },
            { id: 'services', label: 'Services de l\'État', icon: <Building2 className="w-4.5 h-4.5" /> },
            { id: 'statistiques', label: 'Données statistiques', icon: <FileSpreadsheet className="w-4.5 h-4.5" /> }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as AdminTab)}
              className={`w-full px-4 py-3 rounded-xl flex items-center gap-3.5 text-xs font-bold transition-all cursor-pointer ${
                activeTab === item.id
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-md shadow-amber-500/5'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logged Administrative User Footer */}
        <div className="p-4 border-t border-white/10 flex items-center gap-3 bg-black/10">
          <div className="w-8 h-8 rounded-full bg-slate-700 overflow-hidden flex items-center justify-center border border-white/20">
            <UserCheck2 className="w-4.5 h-4.5 text-amber-500" />
          </div>
          <div>
            <span className="text-xs font-bold block">Adm. Mohamed Lemine</span>
            <span className="text-[9px] text-amber-500 block">Ministère Transition Numérique</span>
          </div>
        </div>

      </div>

      {/* 💼 MAIN DASHBOARD CONTENT AREA */}
      <div className={`flex-1 overflow-y-auto p-6 transition-all ${
        isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-[#F8FAFC] text-slate-900'
      }`}>

        {/* TAB 1: OVERVIEW & INTERACTIVE MAP VIEW */}
        {activeTab === 'dashboard' && (
          <div className="flex flex-col gap-6">
            
            {/* Top Bar Welcome Greeting */}
            <div className="flex justify-between items-center pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-2xl font-black tracking-tight">Supervision des Services Publics</h1>
                <p className="text-xs text-gray-500 font-sans mt-0.5">
                  Gérer en temps réel les requêtes, réclamations et doléances des citoyens mauritaniens.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 text-xs font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Connexion Serveur Active
              </div>
            </div>

            {/* WIDGET CARDS ROW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Total Card */}
              <div className={`p-4 rounded-2xl border transition-all hover:shadow-md shadow-sm ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/60'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Total Réclamations</span>
                  <div className="p-2 bg-indigo-500/10 text-indigo-500 rounded-lg">
                    <Inbox className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono">{totalCount}</span>
                  <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-0.5 font-sans">
                    <TrendingUp className="w-3.5 h-3.5" /> +12%
                  </span>
                </div>
                <p className="text-[9.5px] text-gray-400 font-sans mt-1">Dépôts citoyens cumulés 2026</p>
              </div>

              {/* Resolved Card */}
              <div className={`p-4 rounded-2xl border transition-all hover:shadow-md shadow-sm ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/60'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">Cas Résolus</span>
                  <div className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-emerald-500">{resolvedCount}</span>
                  <span className="text-[10px] text-gray-400 font-mono">({resolutionRate}%)</span>
                </div>
                <p className="text-[9.5px] text-gray-400 font-sans mt-1">Incidents entièrement clôturés</p>
              </div>

              {/* Pending Card */}
              <div className={`p-4 rounded-2xl border transition-all hover:shadow-md shadow-sm ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/60'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">En attente</span>
                  <div className="p-2 bg-red-500/10 text-red-500 rounded-lg">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-red-500">{pendingCount}</span>
                  <span className="text-[10px] text-red-500 font-bold font-sans">Action Requise</span>
                </div>
                <p className="text-[9.5px] text-gray-400 font-sans mt-1">Nouveaux dossiers non-assignés</p>
              </div>

              {/* In Progress Card */}
              <div className={`p-4 rounded-2xl border transition-all hover:shadow-md shadow-sm ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-200/60'
              }`}>
                <div className="flex justify-between items-start">
                  <span className="text-xs text-gray-500 font-bold uppercase tracking-wider font-sans">En cours de traitement</span>
                  <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-2xl font-black font-mono text-amber-500">{inProgressCount}</span>
                  <span className="text-[10px] text-gray-400 font-sans">Sur le terrain</span>
                </div>
                <p className="text-[9.5px] text-gray-400 font-sans mt-1">Opérations techniques lancées</p>
              </div>

            </div>

            {/* SPLIT LAYOUT: INTERACTIVE HEATMAP MAP vs REGIONAL LISTINGS */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              
              {/* Map Panel (7 columns) */}
              <div className={`xl:col-span-7 p-5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <MauritaniaMap
                  complaints={complaints}
                  selectedWilaya={selectedWilaya}
                  onSelectWilaya={setSelectedWilaya}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Regional Complaints Queue & KPI list (5 columns) */}
              <div className={`xl:col-span-5 p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b pb-3 border-slate-100 dark:border-slate-800/60">
                    <div>
                      <h3 className="font-sans font-bold text-sm">Rapport Régional</h3>
                      <p className="text-[10px] text-gray-500 mt-0.5">Focus géographique sur les incidents</p>
                    </div>
                    {selectedWilaya && (
                      <span className="px-2.5 py-0.5 rounded bg-emerald-500/10 text-[#006B3F] dark:text-amber-400 text-[10px] font-bold font-mono">
                        {selectedWilaya}
                      </span>
                    )}
                  </div>

                  {/* List of Wilayas with progress bar of volumes */}
                  <div className="flex flex-col gap-3 max-h-[240px] overflow-y-auto pr-1">
                    {WILAYAS_LIST.slice(0, 7).map((wil) => {
                      const wComplaints = complaints.filter(c => c.wilaya.toLowerCase() === wil.name.toLowerCase());
                      const wResolved = wComplaints.filter(c => c.status === 'resolue').length;
                      const ratio = wComplaints.length > 0 ? Math.round((wResolved / wComplaints.length) * 100) : 100;

                      return (
                        <div
                          key={wil.id}
                          onClick={() => setSelectedWilaya(selectedWilaya === wil.name ? null : wil.name)}
                          className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                            selectedWilaya?.toLowerCase() === wil.name.toLowerCase()
                              ? 'bg-[#006B3F]/10 border-[#006B3F] dark:border-amber-400/50'
                              : 'bg-slate-50 dark:bg-slate-950 border-transparent hover:border-slate-200 dark:hover:border-slate-800'
                          }`}
                        >
                          <div className="flex-1">
                            <div className="flex justify-between items-center mb-1 text-xs">
                              <span className="font-bold">{wil.name}</span>
                              <span className="font-mono font-black text-[#006B3F] dark:text-amber-400">
                                {wComplaints.length}
                              </span>
                            </div>
                            <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#006B3F] dark:bg-amber-400 rounded-full"
                                style={{ width: `${Math.min(100, (wComplaints.length / Math.max(1, complaints.length)) * 250)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-4 flex justify-between items-center text-xs text-gray-500">
                  <span>Filtré par carte : {selectedWilaya ? selectedWilaya : 'Toutes Wilayas'}</span>
                  <button
                    onClick={() => setActiveTab('reclamations')}
                    className="text-[#006B3F] dark:text-amber-400 font-bold hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    Voir toute la file <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

              </div>

            </div>

          </div>
        )}

        {/* TAB 2: ACTIVE INCIDENTS QUEUE TABLE MANAGEMENT */}
        {activeTab === 'reclamations' && (
          <div className="flex flex-col gap-6">
            
            {/* Topbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div>
                <h1 className="text-2xl font-black tracking-tight">Queue des Réclamations Citoyennes</h1>
                <p className="text-xs text-gray-500 mt-0.5">Suivre, assigner et résoudre les dysfonctionnements reportés.</p>
              </div>
              
              {/* Filter controls row */}
              <div className="flex flex-wrap gap-2">
                {/* Search input bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher (REF, Nom, NNI...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9 pr-4 py-1.5 bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs rounded-xl outline-none focus:border-[#006B3F] dark:focus:border-amber-400 w-48 transition-colors"
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs rounded-xl outline-none"
                >
                  <option value="all">Tous statuts</option>
                  <option value="signalee">Nouvelle (Signalée)</option>
                  <option value="assignee">Assignée</option>
                  <option value="en_cours">En cours</option>
                  <option value="resolue">Résolue</option>
                </select>

                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-2 py-1.5 bg-white dark:bg-slate-900 border dark:border-slate-800 text-xs rounded-xl outline-none"
                >
                  <option value="all">Toutes catégories</option>
                  {Object.entries(CATEGORY_DETAILS).map(([key, value]) => (
                    <option key={key} value={key}>{value.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* QUEUE RECORDS TABLE PANEL */}
            <div className={`rounded-2xl border overflow-hidden shadow-sm ${
              isDarkMode ? 'bg-slate-900/30 border-slate-800/80' : 'bg-white border-slate-100'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className={`border-b text-[10px] font-bold text-gray-400 uppercase tracking-wider ${
                      isDarkMode ? 'bg-slate-900/60 border-slate-800/80' : 'bg-slate-50 border-slate-100'
                    }`}>
                      <th className="py-3.5 px-4 font-bold">Référence</th>
                      <th className="py-3.5 px-4 font-bold">Citoyen</th>
                      <th className="py-3.5 px-4 font-bold">Catégorie</th>
                      <th className="py-3.5 px-4 font-bold">Détails réclamation</th>
                      <th className="py-3.5 px-4 font-bold">Localisation (Wilaya)</th>
                      <th className="py-3.5 px-4 font-bold text-center">Priorité</th>
                      <th className="py-3.5 px-4 font-bold text-center">Statut</th>
                      <th className="py-3.5 px-4 font-bold text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50 text-xs">
                    {getFilteredQueue().length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-12 text-center text-gray-400 font-sans">
                          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-2.5" />
                          <h4 className="font-bold text-sm">Aucune réclamation dans la file active</h4>
                          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">Ajustez vos filtres ou effectuez une autre recherche.</p>
                        </td>
                      </tr>
                    ) : (
                      getFilteredQueue().map((comp) => {
                        return (
                          <tr
                            key={comp.id}
                            className={`hover:bg-[#006B3F]/5 transition-colors ${
                              comp.id === selectedComplaintId ? 'bg-[#006B3F]/5' : ''
                            }`}
                          >
                            {/* Ref */}
                            <td className="py-3.5 px-4 font-mono font-bold text-[#006B3F] dark:text-amber-400">
                              {comp.reference}
                            </td>
                            {/* Citizen */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold block text-slate-900 dark:text-white">{comp.citizenName}</span>
                              <span className="text-[10px] text-gray-400 font-mono">NNI: {comp.citizenNni}</span>
                            </td>
                            {/* Category */}
                            <td className="py-3.5 px-4 font-semibold text-slate-700 dark:text-slate-300">
                              {CATEGORY_DETAILS[comp.category]?.label}
                            </td>
                            {/* Details */}
                            <td className="py-3.5 px-4 max-w-xs">
                              <span className="font-bold block text-slate-900 dark:text-white line-clamp-1">{comp.title}</span>
                              <span className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">{comp.description}</span>
                            </td>
                            {/* Location */}
                            <td className="py-3.5 px-4">
                              <span className="font-semibold block">{comp.moughataa}</span>
                              <span className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                                <MapPin className="w-3 h-3 text-[#006B3F] dark:text-amber-400" />
                                {comp.wilaya}
                              </span>
                            </td>
                            {/* Priority */}
                            <td className="py-3.5 px-4 text-center">
                              {comp.priority === 'critique' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-red-600 text-white">CRITIQUE</span>
                              )}
                              {comp.priority === 'haute' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-orange-500 text-white">HAUTE</span>
                              )}
                              {comp.priority === 'moyenne' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-amber-500 text-white">MOYENNE</span>
                              )}
                              {comp.priority === 'basse' && (
                                <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-400 text-white">BASSE</span>
                              )}
                            </td>
                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              {comp.status === 'signalee' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-100 text-red-800 border border-red-200">Nouveau</span>
                              )}
                              {comp.status === 'assignee' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Assignée</span>
                              )}
                              {comp.status === 'en_cours' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">En cours</span>
                              )}
                              {comp.status === 'resolue' && (
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Résolue</span>
                              )}
                            </td>
                            {/* Action */}
                            <td className="py-3.5 px-4 text-center">
                              <button
                                onClick={() => setSelectedComplaintId(comp.id)}
                                className="p-1.5 rounded-lg bg-[#006B3F]/10 hover:bg-[#006B3F] text-[#006B3F] dark:text-amber-400 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1.5 text-[10px] font-bold"
                              >
                                <Eye className="w-3.5 h-3.5" /> Gérer
                              </button>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* EXPANDED ACTION CONTROL MODAL PANELS (WHEN USER CLICKS ON GÉRER) */}
            {selectedComplaintId && selectedComplaint && (
              <div className={`rounded-2xl border p-5 mt-4 transition-all flex flex-col md:flex-row gap-6 animate-fade-in ${
                isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200 shadow-lg'
              }`}>
                {/* Left side details summary (7 columns) */}
                <div className="flex-1 flex flex-col gap-4">
                  <div className="flex justify-between items-start border-b pb-3 border-slate-100 dark:border-slate-800/80">
                    <div>
                      <span className="text-[10px] font-mono text-gray-400">ID DOSSIER: {selectedComplaint.id}</span>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {selectedComplaint.title}
                      </h3>
                    </div>
                    <button
                      onClick={() => setSelectedComplaintId(null)}
                      className="p-1 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-gray-500 leading-relaxed font-sans">{selectedComplaint.description}</p>

                  <div className="grid grid-cols-2 gap-3.5 text-xs text-slate-700 dark:text-slate-300">
                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Auteur citoyen</span>
                      <span className="font-bold block mt-0.5">{selectedComplaint.citizenName}</span>
                      <span className="text-[10px] text-gray-400 block font-mono">NNI: {selectedComplaint.citizenNni}</span>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/60">
                      <span className="text-[10px] text-gray-400 font-sans block uppercase font-bold">Localisation précise</span>
                      <span className="font-bold block mt-0.5">{selectedComplaint.moughataa}</span>
                      <span className="text-[10px] text-gray-400 block flex items-center gap-0.5 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#006B3F]" />
                        {selectedComplaint.wilaya}
                      </span>
                    </div>
                  </div>

                  {selectedComplaint.imageUrl && (
                    <div>
                      <span className="text-[10px] text-gray-400 block uppercase font-bold mb-1.5">Preuve visuelle fournie</span>
                      <div className="w-full max-w-sm h-40 rounded-xl overflow-hidden border">
                        <img
                          src={selectedComplaint.imageUrl}
                          alt="Preuve"
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}

                  {/* Comments Feed list */}
                  <div className="flex flex-col gap-2 mt-2">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">Historique de communication</span>
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80">
                      {selectedComplaint.comments.map((comm) => (
                        <div key={comm.id} className="text-xs border-b pb-2 last:border-0 last:pb-0 border-slate-100 dark:border-slate-800/60 mt-1">
                          <div className="flex justify-between items-center font-bold text-[10px]">
                            <span className={comm.role === 'agent' ? 'text-amber-500' : 'text-slate-500'}>
                              {comm.author} ({comm.role.toUpperCase()})
                            </span>
                            <span className="text-gray-400 font-mono text-[9px]">{new Date(comm.createdAt).toLocaleString()}</span>
                          </div>
                          <p className="font-sans text-slate-600 dark:text-slate-300 leading-relaxed mt-0.5">{comm.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right side interactive form inputs (5 columns) */}
                <div className="w-full md:w-80 flex-shrink-0 flex flex-col gap-4 border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-5 border-slate-200 dark:border-slate-800">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white border-b pb-2 border-slate-100 dark:border-slate-800">
                    Actions Administratives
                  </h4>

                  {actionSuccessMsg && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-bold text-center">
                      {actionSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handleAdminAction} className="flex flex-col gap-4">
                    {/* Status selection buttons */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">
                        Changer le statut du dossier
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { id: 'assignee', label: 'Assigner', color: 'bg-blue-500/10 text-blue-500 border-blue-500/30' },
                          { id: 'en_cours', label: 'Lancer Travaux', color: 'bg-amber-500/10 text-amber-500 border-amber-500/30' },
                          { id: 'resolue', label: 'Déclarer Résolu', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={(e) => handleAdminAction(e, btn.id as ComplaintStatus)}
                            className={`px-3 py-2 text-xs font-bold rounded-xl border text-center cursor-pointer transition-all hover:scale-[1.01] ${
                              selectedComplaint.status === btn.id
                                ? 'bg-slate-900 text-amber-500 border-amber-500'
                                : btn.color
                            }`}
                          >
                            {btn.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Agent selection inputs */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Agent / Équipe Responsable
                      </label>
                      <input
                        type="text"
                        placeholder="Ex: Technicien SNDE - S. Ould Bilal"
                        value={assigneeAgent}
                        onChange={(e) => setAssigneeAgent(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-none focus:border-[#006B3F]"
                      />
                      <p className="text-[9px] text-gray-400 mt-1">L'agent assigné sera visible par l'usager citoyen.</p>
                    </div>

                    {/* Feedback message */}
                    <div>
                      <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                        Message / Commentaire officiel
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Ex: Une équipe d'intervention SNDE se rend sur place ce mardi matin..."
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-none focus:border-[#006B3F] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-[#006B3F] hover:bg-[#004D2D] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> Enregistrer les modifications
                    </button>
                  </form>
                </div>
              </div>
            )}

          </div>
        )}

        {/* TAB 3: SERVICES STATUS */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-black tracking-tight">Services et Sociétés Nationales de l'État</h1>
              <p className="text-xs text-gray-500 mt-0.5">Surveillance de l'efficacité opérationnelle des organismes publics.</p>
            </div>

            {/* List of services in Mauritanie */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'SNDE (Société Nationale d\'Eau)', label: 'Réseau d\'Eau & Assainissement', code: 'SNDE', total: 14, active: 4, resolved: 10, rate: '71%', status: 'Normal' },
                { name: 'SOMELEC (Électricité Mauritanie)', label: 'Énergie publique & Éclairage', code: 'SOMELEC', total: 18, active: 6, resolved: 12, rate: '66%', status: 'Surchargé' },
                { name: 'ATTM / Équipement & Infrastructures', label: 'Voirie publique & Routes nationales', code: 'ATTM', total: 9, active: 2, resolved: 7, rate: '77%', status: 'Normal' },
                { name: 'Mairie Municipale de Nouakchott', label: 'Salubrité urbaine & Ordures', code: 'MAIRIE', total: 22, active: 8, resolved: 14, rate: '63%', status: 'Perturbé' },
                { name: 'Sûreté Nationale / Gendarmerie', label: 'Sécurité & Voie publique', code: 'SURETE', total: 5, active: 1, resolved: 4, rate: '80%', status: 'Normal' }
              ].map((serv) => {
                return (
                  <div
                    key={serv.code}
                    className={`p-5 rounded-2xl border flex flex-col justify-between shadow-sm ${
                      isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100'
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="text-[10px] font-bold uppercase text-gray-400 font-sans tracking-wide">
                          {serv.label}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                          serv.status === 'Normal'
                            ? 'bg-emerald-100 text-emerald-800'
                            : serv.status === 'Surchargé'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {serv.status}
                        </span>
                      </div>

                      <h3 className="text-sm font-black tracking-tight text-slate-900 dark:text-white mt-1.5">
                        {serv.name}
                      </h3>

                      {/* Performance Counters */}
                      <div className="grid grid-cols-3 gap-2 mt-4 text-center">
                        <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          <span className="text-xs font-mono font-bold block">{serv.total}</span>
                          <span className="text-[8px] text-gray-400 uppercase tracking-wide">Reçues</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          <span className="text-xs font-mono font-bold text-[#006B3F] block">{serv.resolved}</span>
                          <span className="text-[8px] text-gray-400 uppercase tracking-wide font-sans">Résolues</span>
                        </div>
                        <div className="p-2 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-100 dark:border-slate-800/40">
                          <span className="text-xs font-mono font-bold text-amber-500 block">{serv.active}</span>
                          <span className="text-[8px] text-gray-400 uppercase tracking-wide">Actives</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/60 flex justify-between items-center text-xs">
                      <span className="text-gray-400">Taux de résolution</span>
                      <span className="font-black font-mono text-[#006B3F] dark:text-amber-400">{serv.rate}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: VISUAL ANALYTICS AND STATISTICS CHARTS */}
        {activeTab === 'statistiques' && (
          <div className="flex flex-col gap-6">
            <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
              <h1 className="text-2xl font-black tracking-tight">Rapports d'Analytique et Performances</h1>
              <p className="text-xs text-gray-500 mt-0.5">Synthèse statistique de la plateforme citoyenne SAWTI.</p>
            </div>

            {/* CHARTS CONTAINER GRID */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Category Volume - Bar Chart */}
              <div className={`p-5 rounded-2xl border ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <h3 className="font-sans font-bold text-sm mb-4">Volume par Catégorie de Services</h3>
                
                <div className="flex flex-col gap-3.5">
                  {Object.entries(CATEGORY_DETAILS).map(([key, details]) => {
                    const count = complaints.filter(c => c.category === key).length;
                    const maxCount = Math.max(...Object.keys(CATEGORY_DETAILS).map(k => complaints.filter(c => c.category === k).length));
                    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;

                    return (
                      <div key={key} className="flex items-center gap-4 text-xs">
                        <span className="w-24 font-semibold text-gray-500 truncate">{details.label}</span>
                        <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: details.color
                            }}
                          ></div>
                        </div>
                        <span className="w-6 font-mono font-bold text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Status Distribution - Pie/Radial simulated chart */}
              <div className={`p-5 rounded-2xl border flex flex-col justify-between ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <div>
                  <h3 className="font-sans font-bold text-sm mb-4">Distribution des Statuts de Traitement</h3>
                  
                  {/* Dynamic circle drawing */}
                  <div className="flex justify-center py-6">
                    <svg viewBox="0 0 100 100" className="w-32 h-32 transform -rotate-90">
                      {/* Segment 1: Resolue */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#10B981" strokeWidth="15" strokeDasharray={`${resolutionRate * 2.51} 251`} />
                      {/* Segment 2: Remaining */}
                      <circle cx="50" cy="50" r="40" fill="transparent" stroke="#EF4444" strokeWidth="15" strokeDasharray={`${(100 - resolutionRate) * 2.51} 251`} strokeDashoffset={`-${resolutionRate * 2.51}`} />
                    </svg>
                  </div>
                </div>

                <div className="flex justify-around border-t pt-4 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-emerald-500">
                    <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                    Résolues ({resolutionRate}%)
                  </div>
                  <div className="flex items-center gap-1.5 text-red-500">
                    <span className="w-3 h-3 rounded-full bg-red-500"></span>
                    En cours/Attente ({100 - resolutionRate}%)
                  </div>
                </div>
              </div>

              {/* Line Chart - Trend incoming */}
              <div className={`p-5 rounded-2xl border lg:col-span-2 ${
                isDarkMode ? 'bg-slate-900/40 border-slate-800/80' : 'bg-white border-slate-100 shadow-sm'
              }`}>
                <h3 className="font-sans font-bold text-sm mb-4">Évolution des réclamations reçues (Hebdomadaire)</h3>
                
                {/* Visual SVG Line Chart */}
                <div className="h-44 flex items-end justify-between gap-2 border-b border-l border-slate-200 dark:border-slate-800 pb-2 pl-2">
                  {[
                    { day: 'Lun', val: 4, height: '40%' },
                    { day: 'Mar', val: 8, height: '80%' },
                    { day: 'Mer', val: 5, height: '50%' },
                    { day: 'Jeu', val: 9, height: '90%' },
                    { day: 'Ven', val: 3, height: '30%' },
                    { day: 'Sam', val: 6, height: '60%' },
                    { day: 'Dim', val: 2, height: '20%' }
                  ].map((d) => (
                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                      {/* Bar columns */}
                      <div
                        className="w-full max-w-[28px] bg-gradient-to-t from-[#006B3F] to-emerald-400 rounded-t-lg relative group transition-all"
                        style={{ height: d.height }}
                      >
                        {/* Tooltip */}
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20">
                          {d.val}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-sans">{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};
