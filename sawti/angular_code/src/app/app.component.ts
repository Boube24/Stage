import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Complaint {
  id: string;
  reference: string;
  title: string;
  description: string;
  category: string;
  status: 'submitted' | 'processing' | 'investigating' | 'resolved' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'critical';
  wilaya: string;
  moughataa: string;
  createdAt: string;
  citizenName: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Sawti Administration - République Islamique de Mauritanie';
  
  complaints: Complaint[] = [
    {
      id: '1',
      reference: 'MRT-2026-X83H',
      title: 'Coupure d\'eau prolongée secteur Tevragh-Zeina',
      description: 'Le réseau d\'eau potable est coupé depuis 72 heures au niveau de la rue du Palais des Congrès.',
      category: 'Eau & Électricité',
      status: 'investigating',
      priority: 'high',
      wilaya: 'Nouakchott Ouest',
      moughataa: 'Tevragh-Zeina',
      createdAt: '2026-06-24T08:30:00Z',
      citizenName: 'Ahmed Mahmoud'
    },
    {
      id: '2',
      reference: 'MRT-2026-A49P',
      title: 'Manque d\'équipements de premier secours au centre médical',
      description: 'Le dispensaire local ne dispose plus de bandages ni de thermomètres de base.',
      category: 'Santé & Hôpitaux',
      status: 'submitted',
      priority: 'critical',
      wilaya: 'Nouakchott Nord',
      moughataa: 'Dar-Naim',
      createdAt: '2026-06-23T14:15:00Z',
      citizenName: 'Fatimatou Souleymane'
    },
    {
      id: '3',
      reference: 'MRT-2026-Y91L',
      title: 'Accumulation de sable bloquant la route de Rosso',
      description: 'Une dune de sable s\'est formée suite aux derniers vents forts, bloquant une partie de la chaussée.',
      category: 'Infrastructures',
      status: 'resolved',
      priority: 'medium',
      wilaya: 'Trarza',
      moughataa: 'Rosso',
      createdAt: '2026-06-20T10:00:00Z',
      citizenName: 'Mohamed Lemine'
    }
  ];

  selectedComplaint: Complaint | null = null;
  searchQuery: string = '';
  categoryFilter: string = 'all';
  statusFilter: string = 'all';

  // Stats Counters
  stats = {
    total: 0,
    submitted: 0,
    processing: 0,
    investigating: 0,
    resolved: 0,
    rejected: 0
  };

  ngOnInit() {
    this.calculateStats();
    if (this.complaints.length > 0) {
      this.selectedComplaint = this.complaints[0];
    }
  }

  calculateStats() {
    this.stats.total = this.complaints.length;
    this.stats.submitted = this.complaints.filter(c => c.status === 'submitted').length;
    this.stats.processing = this.complaints.filter(c => c.status === 'processing').length;
    this.stats.investigating = this.complaints.filter(c => c.status === 'investigating').length;
    this.stats.resolved = this.complaints.filter(c => c.status === 'resolved').length;
    this.stats.rejected = this.complaints.filter(c => c.status === 'rejected').length;
  }

  selectComplaint(complaint: Complaint) {
    this.selectedComplaint = complaint;
  }

  updateStatus(complaintId: string, newStatus: any) {
    const item = this.complaints.find(c => c.id === complaintId);
    if (item) {
      item.status = newStatus;
      this.calculateStats();
    }
  }

  updatePriority(complaintId: string, newPriority: any) {
    const item = this.complaints.find(c => c.id === complaintId);
    if (item) {
      item.priority = newPriority;
    }
  }

  getFilteredComplaints(): Complaint[] {
    return this.complaints.filter(c => {
      const matchesSearch = c.title.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
                            c.reference.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                            c.citizenName.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = this.categoryFilter === 'all' || c.category === this.categoryFilter;
      const matchesStatus = this.statusFilter === 'all' || c.status === this.statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }
}
