/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { WILAYAS_LIST } from '../data/mockData';
import { Complaint } from '../types';

interface MauritaniaMapProps {
  complaints: Complaint[];
  selectedWilaya: string | null;
  onSelectWilaya: (wilayaName: string | null) => void;
  isDarkMode: boolean;
}

export const MauritaniaMap: React.FC<MauritaniaMapProps> = ({
  complaints,
  selectedWilaya,
  onSelectWilaya,
  isDarkMode,
}) => {
  const [hoveredWilaya, setHoveredWilaya] = useState<string | null>(null);

  // Calculate stats for each Wilaya
  const getWilayaStats = (wilayaName: string) => {
    const wilayaComplaints = complaints.filter(
      (c) => c.wilaya.toLowerCase() === wilayaName.toLowerCase()
    );
    const resolved = wilayaComplaints.filter((c) => c.status === 'resolue').length;
    const active = wilayaComplaints.length - resolved;
    return {
      total: wilayaComplaints.length,
      resolved,
      active,
    };
  };

  // Custom high-fidelity polygons resembling the physical shape of Mauritania
  // Map dimensions are calibrated for a clean aspect ratio
  const WILAYAS_MAP_PATHS = [
    {
      id: 'tiris_zemmour',
      name: 'Tiris Zemmour',
      points: '160,20 280,20 290,120 210,130 140,90 140,50',
      labelX: 205,
      labelY: 65,
    },
    {
      id: 'adrar',
      name: 'Adrar',
      points: '140,90 210,130 250,150 240,210 180,210 140,160 110,130',
      labelX: 180,
      labelY: 160,
    },
    {
      id: 'nouadhibou',
      name: 'Dakhlet Nouadhibou',
      points: '50,110 80,110 110,130 100,160 70,150 50,120',
      labelX: 75,
      labelY: 130,
    },
    {
      id: 'inchiri',
      name: 'Inchiri',
      points: '100,160 140,160 160,180 130,200 95,190',
      labelX: 125,
      labelY: 180,
    },
    {
      id: 'tagant',
      name: 'Tagant',
      points: '180,210 240,210 250,270 195,280 160,250',
      labelX: 205,
      labelY: 245,
    },
    {
      id: 'hodh_chargui',
      name: 'Hodh Ech Chargui',
      points: '250,150 310,150 310,290 260,290 250,230',
      labelX: 280,
      labelY: 220,
    },
    {
      id: 'hodh_gharbi',
      name: 'Hodh El Gharbi',
      points: '210,285 250,285 260,290 220,310 195,280',
      labelX: 228,
      labelY: 295,
    },
    {
      id: 'assaba',
      name: 'Assaba',
      points: '160,250 195,280 210,285 190,320 160,300 150,275',
      labelX: 175,
      labelY: 285,
    },
    {
      id: 'brakna',
      name: 'Brakna',
      points: '115,225 150,225 160,250 150,275 110,265',
      labelX: 130,
      labelY: 245,
    },
    {
      id: 'trarza',
      name: 'Trarza',
      points: '75,195 115,225 110,265 80,270 65,240',
      labelX: 90,
      labelY: 235,
    },
    {
      id: 'gorgol',
      name: 'Gorgol',
      points: '110,265 150,275 160,300 135,310 115,290',
      labelX: 132,
      labelY: 288,
    },
    {
      id: 'guidimaka',
      name: 'Guidimaka',
      points: '150,300 190,320 180,335 150,325 135,310',
      labelX: 160,
      labelY: 320,
    },
    {
      id: 'nktt_group', // Representing Nouakchott collectively as a clickable hub
      name: 'Nouakchott Ouest',
      points: '65,200 75,195 80,205 70,210',
      labelX: 55,
      labelY: 185,
      isNouakchott: true,
    }
  ];

  return (
    <div className="relative w-full flex flex-col items-center">
      {/* Map Card Header with selection breadcrumb */}
      <div className="w-full flex justify-between items-center mb-4 px-2">
        <div>
          <h3 className={`font-sans font-semibold text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Carte Interactive des Réclamations
          </h3>
          <p className="text-xs text-gray-500 font-sans">
            Sélectionnez une Wilaya pour filtrer les réclamations
          </p>
        </div>
        {selectedWilaya && (
          <button
            onClick={() => onSelectWilaya(null)}
            className="text-xs px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500 font-sans border border-amber-500/25 hover:bg-amber-500/20 transition-all cursor-pointer"
            id="btn-clear-map-filter"
          >
            Réinitialiser ({selectedWilaya})
          </button>
        )}
      </div>

      {/* SVG Canvas Container */}
      <div className={`relative w-full max-w-[420px] aspect-[4/5] rounded-2xl p-4 flex items-center justify-center transition-all ${
        isDarkMode ? 'bg-slate-900/60 border border-slate-800/80' : 'bg-slate-50 border border-slate-100'
      }`}>
        {/* Subtle Watermark Map Grid Lines */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-2xl">
          <div className="w-full h-full grid grid-cols-12 grid-rows-12">
            {Array.from({ length: 144 }).map((_, i) => (
              <div key={i} className="border-b border-r border-teal-500"></div>
            ))}
          </div>
        </div>

        {/* The SVG Mauritania Map */}
        <svg
          viewBox="0 0 340 360"
          className="w-full h-full select-none"
          style={{ filter: 'drop-shadow(0px 8px 16px rgba(0,0,0,0.12))' }}
        >
          {/* Legend Grid */}
          <g transform="translate(10, 320)" className="text-[9px] font-mono pointer-events-none opacity-60">
            <text x="0" y="0" fill={isDarkMode ? '#94A3B8' : '#64748B'}>12° N / 16° W</text>
            <text x="0" y="12" fill={isDarkMode ? '#94A3B8' : '#64748B'}>République de Mauritanie</text>
          </g>

          <g>
            {WILAYAS_MAP_PATHS.map((wil) => {
              const stats = getWilayaStats(wil.name);
              const isSelected = selectedWilaya?.toLowerCase() === wil.name.toLowerCase();
              const isHovered = hoveredWilaya === wil.id;

              // Determine fill color based on complaint densities & state
              let fillColor = isDarkMode ? '#1e293b' : '#f1f5f9'; // default
              let strokeColor = isDarkMode ? '#475569' : '#cbd5e1';
              let strokeWidth = '1.5';

              if (stats.total > 0) {
                if (stats.active > 0) {
                  // High active complains -> richer green/amber shade
                  fillColor = isDarkMode ? '#00331e' : '#e6f3ec';
                  strokeColor = '#006B3F';
                } else {
                  // Fully resolved -> calming teal/slate
                  fillColor = isDarkMode ? '#022c22' : '#f0fdf4';
                  strokeColor = '#10B981';
                }
              }

              if (isSelected) {
                fillColor = '#004D2D'; // Mauritania Deep Green
                strokeColor = '#D4AF37'; // Golden Accent
                strokeWidth = '2.5';
              } else if (isHovered) {
                fillColor = isDarkMode ? '#004D2D' : '#006B3F';
                strokeColor = '#D4AF37';
                strokeWidth = '2';
              }

              return (
                <g
                  key={wil.id}
                  onClick={() => onSelectWilaya(isSelected ? null : wil.name)}
                  onMouseEnter={() => setHoveredWilaya(wil.id)}
                  onMouseLeave={() => setHoveredWilaya(null)}
                  className="cursor-pointer transition-all duration-300"
                  id={`map-region-${wil.id}`}
                >
                  {/* Outer Shadow glow for selected/hovered region */}
                  <polygon
                    points={wil.points}
                    fill={fillColor}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeLinejoin="round"
                    className="transition-all duration-300 hover:scale-[1.01] origin-center"
                  />

                  {/* High Priority Notification Pulsing Dot */}
                  {stats.active > 0 && (
                    <circle
                      cx={wil.labelX}
                      cy={wil.labelY + 10}
                      r="3"
                      fill={isDarkMode ? '#D4AF37' : '#C1272D'}
                      className="animate-ping origin-center"
                    />
                  )}

                  {/* Region Labels */}
                  <text
                    x={wil.labelX}
                    y={wil.labelY}
                    textAnchor="middle"
                    className={`font-sans font-semibold tracking-tight pointer-events-none select-none`}
                    style={{
                      fontSize: '8px',
                      fill: isSelected
                        ? '#D4AF37'
                        : isDarkMode
                        ? isHovered
                          ? '#ffffff'
                          : '#94a3b8'
                        : isHovered
                        ? '#004D2D'
                        : '#475569',
                    }}
                  >
                    {wil.name.replace('Dakhlet ', '').replace('Hodh ', 'H. ')}
                  </text>

                  {/* Small Badge with count */}
                  {stats.total > 0 && (
                    <g transform={`translate(${wil.labelX}, ${wil.labelY + 8})`} className="pointer-events-none">
                      <rect
                        x="-7"
                        y="-4"
                        width="14"
                        height="8"
                        rx="3"
                        fill={isSelected ? '#D4AF37' : '#006B3F'}
                        opacity="0.9"
                      />
                      <text
                        textAnchor="middle"
                        y="2"
                        className="font-mono text-[6px] font-bold fill-white"
                      >
                        {stats.total}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>

          {/* Capital Nouakchott Connector line for clarity */}
          <path
            d="M 60,195 Q 40,210 24,210"
            fill="none"
            stroke={isDarkMode ? '#64748B' : '#94A3B8'}
            strokeDasharray="2,2"
            strokeWidth="1"
            className="pointer-events-none"
          />
          <text
            x="18"
            y="218"
            className="font-sans font-bold fill-[#006B3F] text-[7px] select-none pointer-events-none"
          >
            Nouakchott (Capitale)
          </text>
        </svg>

        {/* Floating Interactive Map Tooltip */}
        {hoveredWilaya && (
          <div
            className={`absolute bottom-4 left-4 right-4 p-3 rounded-xl shadow-xl z-20 transition-all border animate-fade-in ${
              isDarkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-100 text-slate-800'
            }`}
          >
            {(() => {
              const wilInfo = WILAYAS_LIST.find((w) => w.id === hoveredWilaya);
              if (!wilInfo) return null;
              const stats = getWilayaStats(wilInfo.name);

              return (
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-sans font-bold text-xs flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                      Wilaya de {wilInfo.name}
                    </h4>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">
                      Chef-lieu: {wilInfo.capital}
                    </p>
                  </div>
                  <div className="flex gap-3 text-right">
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-emerald-500">
                        {stats.resolved}
                      </span>
                      <span className="text-[8px] text-gray-400 font-sans uppercase">Résolues</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold font-mono text-amber-500">
                        {stats.active}
                      </span>
                      <span className="text-[8px] text-gray-400 font-sans uppercase">En cours</span>
                    </div>
                    <div className="flex flex-col border-l pl-2 border-gray-700/20">
                      <span className="text-xs font-bold font-mono text-indigo-500">
                        {stats.total}
                      </span>
                      <span className="text-[8px] text-gray-400 font-sans uppercase">Total</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
};
