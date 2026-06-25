/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ComplaintCategory =
  | 'voirie'
  | 'eau'
  | 'electricite'
  | 'assainissement'
  | 'environnement'
  | 'securite'
  | 'sante'
  | 'education';

export type ComplaintStatus =
  | 'signalee'
  | 'assignee'
  | 'en_cours'
  | 'resolue'
  | 'fermee';

export type ComplaintPriority = 'basse' | 'moyenne' | 'haute' | 'critique';

export interface Complaint {
  id: string;
  reference: string;
  title: string;
  category: ComplaintCategory;
  description: string;
  status: ComplaintStatus;
  priority: ComplaintPriority;
  wilaya: string;
  moughataa: string;
  gpsLocation?: {
    lat: number;
    lng: number;
    addressName?: string;
  };
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  citizenName: string;
  citizenNni: string;
  assignedAgent?: string;
  comments: ComplaintComment[];
}

export interface ComplaintComment {
  id: string;
  author: string;
  role: 'citoyen' | 'agent' | 'systeme';
  text: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  complaintId?: string;
  createdAt: string;
  read: boolean;
}

export interface CitizenUser {
  name: string;
  nni: string;
  phone: string;
  email: string;
  wilaya: string;
  moughataa: string;
  avatarUrl?: string;
}

export interface WilayaData {
  id: string;
  name: string;
  capital: string;
  complaintsCount: number;
  resolvedCount: number;
  coordinates: { x: number; y: number }; // Percentage coordinates for custom interactive map
}
