export const users = [
  { id: 'juan', name: 'Juan Pérez', role: 'admin', dept: null, avatar: 'JP' },
  { id: 'maria', name: 'María López', role: 'dept-lead', dept: 'audio', avatar: 'ML' },
  { id: 'carlos', name: 'Carlos Ruiz', role: 'load-lead', dept: null, avatar: 'CR' },
  { id: 'ana', name: 'Ana Torres', role: 'dept-lead', dept: 'video', avatar: 'AT' },
  { id: 'diego', name: 'Diego Herrera', role: 'dept-lead', dept: 'iluminacion', avatar: 'DH' },
  { id: 'laura', name: 'Laura Gómez', role: 'load-lead', dept: null, avatar: 'LG' },
]

export const show = {
  name: 'Latin Power Tour',
  city: 'Bogotá',
  venue: 'Estadio El Campín',
  date: '15 Feb 2026',
  phase: 'Carga',
  overallProgress: 68,
}

export const departments = [
  { id: 'audio', name: 'Audio', color: '#E30613', progress: 85, total: 8, loaded: 7 },
  { id: 'video', name: 'Video', color: '#F5A623', progress: 62, total: 8, loaded: 5 },
  { id: 'iluminacion', name: 'Iluminación', color: '#00C853', progress: 100, total: 6, loaded: 6 },
  { id: 'staging', name: 'Staging', color: '#448AFF', progress: 45, total: 4, loaded: 2 },
  { id: 'backline', name: 'Backline', color: '#AA00FF', progress: 50, total: 4, loaded: 2 },
]

export const trucks = [
  {
    id: 'truck-01',
    name: 'Camión 01',
    assignedTo: 'Audio / Video',
    capacity: 32,
    loaded: 24,
    progress: 75,
    status: 'open',
  },
  {
    id: 'truck-02',
    name: 'Camión 02',
    assignedTo: 'Iluminación / Staging',
    capacity: 28,
    loaded: 28,
    progress: 100,
    status: 'complete',
  },
  {
    id: 'truck-03',
    name: 'Camión 03',
    assignedTo: 'Backline / Varios',
    capacity: 20,
    loaded: 8,
    progress: 40,
    status: 'open',
  },
]

export const items = [
  { id: 'AUDIO-01', name: 'Consola DiGiCo SD7', dept: 'audio', type: 'consola', truck: 'truck-01', order: 1, status: 'loaded', icon: 'Sliders' },
  { id: 'AUDIO-02', name: 'Rack FOH-01', dept: 'audio', type: 'rack', truck: 'truck-01', order: 2, status: 'loaded', icon: 'Server' },
  { id: 'AUDIO-03', name: 'Rack FOH-02', dept: 'audio', type: 'rack', truck: 'truck-01', order: 3, status: 'loaded', icon: 'Server' },
  { id: 'AUDIO-04', name: 'Sub L-Acoustics KS28 x8', dept: 'audio', type: 'case', truck: 'truck-01', order: 4, status: 'loaded', icon: 'Speaker' },
  { id: 'AUDIO-05', name: 'Line Array K2 x12', dept: 'audio', type: 'case', truck: 'truck-01', order: 5, status: 'loaded', icon: 'Speaker' },
  { id: 'AUDIO-06', name: 'Rack Monitor', dept: 'audio', type: 'rack', truck: 'truck-01', order: 6, status: 'ready-to-load', icon: 'Server' },
  { id: 'AUDIO-07', name: 'Rack Amplificadores', dept: 'audio', type: 'rack', truck: 'truck-01', order: 7, status: 'ready-to-load', icon: 'Server' },
  { id: 'AUDIO-08', name: 'Case Microfonía', dept: 'audio', type: 'case', truck: 'truck-01', order: 8, status: 'pending', icon: 'Mic' },
  { id: 'VIDEO-01', name: 'Pantalla LED P3.9 #1', dept: 'video', type: 'case', truck: 'truck-01', order: 9, status: 'loaded', icon: 'Monitor' },
  { id: 'VIDEO-02', name: 'Pantalla LED P3.9 #2', dept: 'video', type: 'case', truck: 'truck-01', order: 10, status: 'loaded', icon: 'Monitor' },
  { id: 'VIDEO-03', name: 'Case Procesadores Video', dept: 'video', type: 'case', truck: 'truck-01', order: 11, status: 'missing', icon: 'Cpu' },
  { id: 'VIDEO-04', name: 'Rack Señal Video', dept: 'video', type: 'rack', truck: 'truck-01', order: 12, status: 'loaded', icon: 'Server' },
  { id: 'VIDEO-05', name: 'Case Cámaras PTZ', dept: 'video', type: 'case', truck: 'truck-01', order: 13, status: 'loaded', icon: 'Camera' },
  { id: 'VIDEO-06', name: 'Switcher ATEM 4K', dept: 'video', type: 'consola', truck: 'truck-01', order: 14, status: 'ready-to-load', icon: 'Sliders' },
  { id: 'VIDEO-07', name: 'Case Cableado Video', dept: 'video', type: 'case', truck: 'truck-01', order: 15, status: 'pending', icon: 'Cable' },
  { id: 'VIDEO-08', name: 'Monitores Referencia x4', dept: 'video', type: 'case', truck: 'truck-01', order: 16, status: 'loaded', icon: 'Monitor' },
  { id: 'ILUM-01', name: 'Case Moving Head x8', dept: 'iluminacion', type: 'case', truck: 'truck-02', order: 1, status: 'loaded', icon: 'Lightbulb' },
  { id: 'ILUM-02', name: 'Case Wash LED x12', dept: 'iluminacion', type: 'case', truck: 'truck-02', order: 2, status: 'loaded', icon: 'Lightbulb' },
  { id: 'ILUM-03', name: 'Consola MA3 Full', dept: 'iluminacion', type: 'consola', truck: 'truck-02', order: 3, status: 'loaded', icon: 'Sliders' },
  { id: 'ILUM-04', name: 'Case Strobes x6', dept: 'iluminacion', type: 'case', truck: 'truck-02', order: 4, status: 'loaded', icon: 'Zap' },
  { id: 'ILUM-05', name: 'Rack Dimmer', dept: 'iluminacion', type: 'rack', truck: 'truck-02', order: 5, status: 'loaded', icon: 'Server' },
  { id: 'ILUM-06', name: 'Case Cableado Ilum', dept: 'iluminacion', type: 'case', truck: 'truck-02', order: 6, status: 'loaded', icon: 'Cable' },
  { id: 'STAG-01', name: 'Truss Circular 12m', dept: 'staging', type: 'case', truck: 'truck-02', order: 7, status: 'loaded', icon: 'Box' },
  { id: 'STAG-02', name: 'Case Motores CM x8', dept: 'staging', type: 'case', truck: 'truck-02', order: 8, status: 'loaded', icon: 'Settings' },
  { id: 'STAG-03', name: 'Risers 2x1m x6', dept: 'staging', type: 'case', truck: 'truck-02', order: 9, status: 'ready-to-load', icon: 'Box' },
  { id: 'STAG-04', name: 'Case Herrajes Staging', dept: 'staging', type: 'case', truck: 'truck-02', order: 10, status: 'pending', icon: 'Wrench' },
  { id: 'BACK-01', name: 'Case Guitarras', dept: 'backline', type: 'case', truck: 'truck-03', order: 1, status: 'loaded', icon: 'Guitar' },
  { id: 'BACK-02', name: 'Case Bajos + Amps', dept: 'backline', type: 'case', truck: 'truck-03', order: 2, status: 'loaded', icon: 'Guitar' },
  { id: 'BACK-03', name: 'Case Teclados', dept: 'backline', type: 'case', truck: 'truck-03', order: 3, status: 'ready-to-load', icon: 'Piano' },
  { id: 'BACK-04', name: 'Case Batería', dept: 'backline', type: 'case', truck: 'truck-03', order: 4, status: 'pending', icon: 'Disc' },
]

export const scanHistory = [
  { id: 1, itemId: 'AUDIO-05', itemName: 'Line Array K2 x12', result: 'success', message: 'Cargado correctamente', time: '22:15', userId: 'carlos' },
  { id: 2, itemId: 'AUDIO-07', itemName: 'Rack Amplificadores', result: 'error', message: 'Camión incorrecto', time: '22:08', userId: 'laura' },
  { id: 3, itemId: 'ILUM-04', itemName: 'Case Strobes x6', result: 'success', message: 'Cargado correctamente', time: '21:55', userId: 'diego' },
  { id: 4, itemId: 'VIDEO-04', itemName: 'Rack Señal Video', result: 'success', message: 'Cargado correctamente', time: '21:42', userId: 'ana' },
]

export const movementHistory = {
  'AUDIO-02': [
    { action: 'Descargado', userId: 'juan', time: '14:30' },
    { action: 'En posición montaje', userId: 'maria', time: '15:20' },
    { action: 'Desmontado', userId: 'juan', time: '21:00' },
    { action: 'Listo para carga', userId: 'maria', time: '22:15' },
    { action: 'Cargado en Camión 01', userId: 'carlos', time: '22:30' },
  ],
}

export const statusLabels = {
  loaded: 'Cargado',
  'ready-to-load': 'Listo para cargar',
  pending: 'Pendiente',
  missing: 'Faltante',
  'wrong-truck': 'Camión incorrecto',
}

export const statusColors = {
  loaded: 'var(--status-ok)',
  'ready-to-load': 'var(--status-ready)',
  pending: 'var(--status-pending)',
  missing: 'var(--status-error)',
  'wrong-truck': 'var(--accent-yellow)',
}

export const deptColors = {
  audio: '#E30613',
  video: '#F5A623',
  iluminacion: '#00C853',
  staging: '#448AFF',
  backline: '#AA00FF',
}

export const deptNames = {
  audio: 'Audio',
  video: 'Video',
  iluminacion: 'Iluminación',
  staging: 'Staging',
  backline: 'Backline',
}
