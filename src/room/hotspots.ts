/** Add an entry here and a matching object anchor in scene.ts to extend the space. */
export const sceneHotspots = [
  { id: 'papers', label: '论文 Papers', action: 'papers', path: 'M4 5c3-1 5-1 8 1 3-2 5-2 8-1v14c-3-1-5-1-8 1-3-2-5-2-8-1V5zm8 1v14' },
  { id: 'projects', label: '作品集 Collection', action: 'projects', path: 'm5 15-1 5 5-1L20 8l-4-4L5 15zm8-8 4 4M5 15l4 4' },
  { id: 'music', label: '音乐 Music', action: 'music', path: 'M4 10v4m4-8v12m4-15v18m4-15v12m4-8v4' },
] as const
