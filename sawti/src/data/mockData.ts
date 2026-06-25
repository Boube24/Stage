/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Complaint, WilayaData, NotificationItem } from '../types';

export const WILAYAS_LIST = [
  { id: 'adrar', name: 'Adrar', capital: 'Atar', moughataas: ['Atar', 'Chinguetti', 'Ouadane', 'Aoujeft'], mapX: 48, mapY: 42 },
  { id: 'assaba', name: 'Assaba', capital: 'Kiffa', moughataas: ['Kiffa', 'Guerou', 'Kankossa', 'Barkeol', 'Boumdeid'], mapX: 54, mapY: 76 },
  { id: 'brakna', name: 'Brakna', capital: 'Aleg', moughataas: ['Aleg', 'Boghé', 'Bababé', 'M\'Bagne', 'Magta-Lahjar'], mapX: 38, mapY: 72 },
  { id: 'nouadhibou', name: 'Dakhlet Nouadhibou', capital: 'Nouadhibou', moughataas: ['Nouadhibou'], mapX: 12, mapY: 34 },
  { id: 'gorgol', name: 'Gorgol', capital: 'Kaédi', moughataas: ['Kaédi', 'M\'Bout', 'Maghama', 'Monguel'], mapX: 42, mapY: 81 },
  { id: 'guidimaka', name: 'Guidimaka', capital: 'Sélibaby', moughataas: ['Sélibaby', 'Ould Yengé'], mapX: 48, mapY: 85 },
  { id: 'hodh_chargui', name: 'Hodh Ech Chargui', capital: 'Néma', moughataas: ['Néma', 'Amourj', 'Bassikounou', 'Djiguenni', 'Oualata', 'Timbedra'], mapX: 78, mapY: 76 },
  { id: 'hodh_gharbi', name: 'Hodh El Gharbi', capital: 'Ayoun el Atrous', moughataas: ['Ayoun el Atrous', 'Kobenni', 'Tamchekett', 'Tintane'], mapX: 64, mapY: 78 },
  { id: 'inchiri', name: 'Inchiri', capital: 'Akjoujt', moughataas: ['Akjoujt'], mapX: 32, mapY: 46 },
  { id: 'nktt_nord', name: 'Nouakchott Nord', capital: 'Dar-Naim', moughataas: ['Dar-Naim', 'Teyarett', 'Toujouonine'], mapX: 25, mapY: 60 },
  { id: 'nktt_ouest', name: 'Nouakchott Ouest', capital: 'Tevragh-Zeina', moughataas: ['Ksar', 'Sebkha', 'Tevragh-Zeina'], mapX: 23, mapY: 61 },
  { id: 'nktt_sud', name: 'Nouakchott Sud', capital: 'Arafat', moughataas: ['Arafat', 'El Mina', 'Riyad'], mapX: 24, mapY: 62 },
  { id: 'tagant', name: 'Tagant', capital: 'Tidjikja', moughataas: ['Tidjikja', 'Moudjeria', 'Tichit'], mapX: 56, mapY: 58 },
  { id: 'tiris_zemmour', name: 'Tiris Zemmour', capital: 'Zouérat', moughataas: ['Zouérat', 'F\'Derick', 'Bir Moghrein'], mapX: 58, mapY: 18 },
  { id: 'trarza', name: 'Trarza', capital: 'Rosso', moughataas: ['Rosso', 'Boutilimit', 'Keur Macène', 'Mederdra', 'Ouad Naga', 'R\'Kiz'], mapX: 28, mapY: 68 },
];

export const CATEGORY_DETAILS = {
  voirie: { label: 'Voirie & Routes', icon: 'Construction', color: '#C1272D', bg: 'rgba(193, 39, 45, 0.1)' },
  eau: { label: 'Réseau d\'Eau', icon: 'Droplets', color: '#006B3F', bg: 'rgba(0, 107, 63, 0.1)' },
  electricite: { label: 'Électricité publique', icon: 'Zap', color: '#D4AF37', bg: 'rgba(212, 175, 55, 0.1)' },
  assainissement: { label: 'Assainissement', icon: 'Trash2', color: '#6B7280', bg: 'rgba(107, 114, 128, 0.1)' },
  environnement: { label: 'Environnement', icon: 'Trees', color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)' },
  securite: { label: 'Sécurité Municipale', icon: 'ShieldAlert', color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)' },
  sante: { label: 'Santé Publique', icon: 'HeartPulse', color: '#EC4899', bg: 'rgba(236, 72, 153, 0.1)' },
  education: { label: 'Écoles & Éducation', icon: 'GraduationCap', color: '#3B82F6', bg: 'rgba(59, 130, 246, 0.1)' },
};

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'REC-2026-001',
    reference: 'S-2026-7789',
    title: 'Rupture de canalisation d\'eau potable',
    category: 'eau',
    description: 'Une fuite d\'eau majeure s\'est déclarée sur la conduite principale alimentant le quartier Carrefour près de la clinique El Shifa. Des milliers de litres sont gaspillés et la pression a chuté dans tout le secteur.',
    status: 'en_cours',
    priority: 'haute',
    wilaya: 'Nouakchott Ouest',
    moughataa: 'Tevragh-Zeina',
    gpsLocation: { lat: 18.0945, lng: -15.9754, addressName: 'Avenue Charles de Gaulle, Tevragh-Zeina' },
    createdAt: '2026-06-20T10:30:00Z',
    updatedAt: '2026-06-21T14:15:00Z',
    citizenName: 'Ahmed Mahmoud',
    citizenNni: '2890471203',
    assignedAgent: 'Ing. Yahya Ould Bilal (SNDE)',
    comments: [
      { id: 'c1', author: 'Ahmed Mahmoud', role: 'citoyen', text: 'La fuite s\'aggrave d\'heure en heure, l\'eau commence à inonder les pas de porte.', createdAt: '2026-06-20T10:30:00Z' },
      { id: 'c2', author: 'Système SAWTI', role: 'systeme', text: 'Réclamation transmise automatiquement à la SNDE (Société Nationale d\'Eau).', createdAt: '2026-06-20T10:32:00Z' },
      { id: 'c3', author: 'Ing. Yahya Ould Bilal', role: 'agent', text: 'Équipe d\'intervention planifiée pour le colmatage de la conduite principale ce mardi matin.', createdAt: '2026-06-21T14:15:00Z' }
    ]
  },
  {
    id: 'REC-2026-002',
    reference: 'S-2026-3041',
    title: 'Panne totale de l\'éclairage public',
    category: 'electricite',
    description: 'Tout le boulevard principal reliant le Mellah au rond-point du Stade est plongé dans le noir complet depuis 3 nuits. Cela pose de graves problèmes de sécurité pour les piétons.',
    status: 'signalee',
    priority: 'moyenne',
    wilaya: 'Nouakchott Nord',
    moughataa: 'Dar-Naim',
    gpsLocation: { lat: 18.1062, lng: -15.9324, addressName: 'Boulevard de la Résistance, Dar-Naim' },
    createdAt: '2026-06-23T21:45:00Z',
    updatedAt: '2026-06-23T21:45:00Z',
    citizenName: 'Mariem Mint El Mokhtar',
    citizenNni: '1098432190',
    comments: [
      { id: 'c1', author: 'Mariem Mint El Mokhtar', role: 'citoyen', text: 'C\'est extrêmement dangereux pour les femmes et les enfants qui rentrent tard.', createdAt: '2026-06-23T21:45:00Z' }
    ]
  },
  {
    id: 'REC-2026-003',
    reference: 'S-2026-1102',
    title: 'Nid de poule béant sur la route de Rosso',
    category: 'voirie',
    description: 'Un énorme trou s\'est formé au milieu de la chaussée à la sortie sud de Rosso. Plusieurs véhicules ont déjà endommagé leurs pneus et amortisseurs en essayant de l\'éviter brusquement.',
    status: 'resolue',
    priority: 'haute',
    wilaya: 'Trarza',
    moughataa: 'Rosso',
    gpsLocation: { lat: 16.5123, lng: -15.8042, addressName: 'N2 Route de Rosso, km 4' },
    createdAt: '2026-06-18T08:00:00Z',
    updatedAt: '2026-06-22T17:30:00Z',
    citizenName: 'Cheikh Ould Sid\'Ahmed',
    citizenNni: '4598201294',
    assignedAgent: 'Direction Régionale de l\'Équipement (Trarza)',
    comments: [
      { id: 'c1', author: 'Cheikh Ould Sid\'Ahmed', role: 'citoyen', text: 'Le trou fait plus de 20cm de profondeur. Risque d\'accident grave.', createdAt: '2026-06-18T08:00:00Z' },
      { id: 'c2', author: 'Direction Régionale', role: 'agent', text: 'Une équipe de réparation des routes nationales a été dépêchée sur place.', createdAt: '2026-06-20T11:00:00Z' },
      { id: 'c3', author: 'Direction Régionale', role: 'agent', text: 'Le trou a été entièrement rebouché et goudronné. La circulation est rétablie en toute sécurité.', createdAt: '2026-06-22T17:30:00Z' }
    ]
  },
  {
    id: 'REC-2026-004',
    reference: 'S-2026-9042',
    title: 'Accumulation d\'ordures ménagères',
    category: 'assainissement',
    description: 'Un dépôt d\'ordures sauvage s\'est constitué à côté de l\'école primaire publique. L\'odeur est insupportable et cela attire des animaux errants.',
    status: 'assignee',
    priority: 'moyenne',
    wilaya: 'Nouakchott Sud',
    moughataa: 'Arafat',
    gpsLocation: { lat: 18.0642, lng: -15.9511, addressName: 'Quartier Arafat, Poteau 11' },
    createdAt: '2026-06-22T14:20:00Z',
    updatedAt: '2026-06-23T09:30:00Z',
    citizenName: 'Mohamed Lemine',
    citizenNni: '7748392019',
    assignedAgent: 'Service de Salubrité de la Commune d\'Arafat',
    comments: [
      { id: 'c1', author: 'Mohamed Lemine', role: 'citoyen', text: 'Les enfants doivent traverser les ordures pour entrer dans l\'école.', createdAt: '2026-06-22T14:20:00Z' },
      { id: 'c2', author: 'Service de Salubrité', role: 'agent', text: 'Prise en charge par le prestataire de collecte de la Wilaya de Nouakchott Sud. En attente du passage du camion-benne.', createdAt: '2026-06-23T09:30:00Z' }
    ]
  },
  {
    id: 'REC-2026-005',
    reference: 'S-2026-5591',
    title: 'Coupure d\'eau récurrente de 5 jours',
    category: 'eau',
    description: 'Le château d\'eau local ne fonctionne plus. Les habitants doivent acheter des citernes privées à des prix exorbitants.',
    status: 'signalee',
    priority: 'critique',
    wilaya: 'Adrar',
    moughataa: 'Chinguetti',
    gpsLocation: { lat: 20.4571, lng: -12.3611, addressName: 'Vieux Quartier de Chinguetti' },
    createdAt: '2026-06-23T12:00:00Z',
    updatedAt: '2026-06-23T12:00:00Z',
    citizenName: 'Fatimatou Mint Salek',
    citizenNni: '3490184201',
    comments: [
      { id: 'c1', author: 'Fatimatou Mint Salek', role: 'citoyen', text: 'Pas deau potable sous cette chaleur suffocante, c\'est urgent !', createdAt: '2026-06-23T12:00:00Z' }
    ]
  },
  {
    id: 'REC-2026-006',
    reference: 'S-2026-8812',
    title: 'Décharge sauvage polluante près du fleuve',
    category: 'environnement',
    description: 'Des camions déchargent des gravats et des plastiques à proximité de la rive du fleuve Sénégal, polluant l\'écosystème local.',
    status: 'en_cours',
    priority: 'critique',
    wilaya: 'Gorgol',
    moughataa: 'Kaédi',
    gpsLocation: { lat: 16.1524, lng: -13.5124, addressName: 'Bord du fleuve, Kaédi Nord' },
    createdAt: '2026-06-21T09:15:00Z',
    updatedAt: '2026-06-22T10:40:00Z',
    citizenName: 'Amadou Diallo',
    citizenNni: '9902381045',
    assignedAgent: 'Police de l\'Environnement du Gorgol',
    comments: [
      { id: 'c1', author: 'Amadou Diallo', role: 'citoyen', text: 'L\'eau devient noire et les poissons meurent à cet endroit.', createdAt: '2026-06-21T09:15:00Z' },
      { id: 'c2', author: 'Police de l\'Environnement', role: 'agent', text: 'Enquête ouverte. Des patrouilles de gendarmerie surveillent désormais la zone pour verbaliser les contrevenants.', createdAt: '2026-06-22T10:40:00Z' }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-001',
    title: 'Réclamation Résolue 🎉',
    description: 'Votre signalement concernant le nid de poule à Rosso a été marqué comme Résolu.',
    type: 'success',
    complaintId: 'REC-2026-003',
    createdAt: '2026-06-22T17:30:00Z',
    read: false,
  },
  {
    id: 'n-002',
    title: 'Nouveau commentaire d\'un agent 💬',
    description: 'Un technicien SNDE a mis à jour le statut de la fuite d\'eau à Tevragh-Zeina.',
    type: 'info',
    complaintId: 'REC-2026-001',
    createdAt: '2026-06-21T14:15:00Z',
    read: true,
  },
  {
    id: 'n-003',
    title: 'Alerte Sûreté Nationale 🛡️',
    description: 'Veuillez signaler tout comportement suspect ou perturbation de service sur la voie publique via SAWTI.',
    type: 'warning',
    createdAt: '2026-06-24T08:00:00Z',
    read: false,
  },
  {
    id: 'n-004',
    title: 'Communiqué Officiel 🇲🇷',
    description: 'Lancement de la plateforme nationale SAWTI par le Ministère de la Transition Numérique.',
    type: 'success',
    createdAt: '2026-06-24T00:00:00Z',
    read: false,
  }
];

export const MOCK_NEWS = [
  {
    id: 'news-1',
    title: 'Lancement National de SAWTI',
    excerpt: 'Le gouvernement mauritanien lance SAWTI, la plateforme citoyenne intelligente pour moderniser l\'administration publique.',
    date: '24 Juin 2026',
    category: 'Gouvernement',
    imageUrl: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'news-2',
    title: 'Modernisation de la SNDE',
    excerpt: 'Un plan d\'investissement massif de 500 millions MRU pour réhabiliter le réseau de distribution d\'eau de Nouakchott.',
    date: '22 Juin 2026',
    category: 'Eau & Assainissement',
    imageUrl: 'https://images.unsplash.com/photo-1581094288338-2314dddb7eed?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'news-3',
    title: 'Transition Énergétique Solaire',
    excerpt: 'Inauguration de trois nouvelles centrales solaires hybrides dans les Wilayas de l\'Est (Hodh Ech Chargui, Hodh El Gharbi).',
    date: '19 Juin 2026',
    category: 'Énergie',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&q=80&w=600'
  }
];
