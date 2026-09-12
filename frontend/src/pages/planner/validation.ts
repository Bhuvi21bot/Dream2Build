import { FloorPlanState, Wall, Room, Door, Window, Furniture, Point } from './types';

// Very basic type checking for numbers to avoid NaN and Infinity
const isValidNumber = (n: any): n is number => typeof n === 'number' && !isNaN(n) && isFinite(n);

const validatePoint = (p: any): p is Point => {
  return p && isValidNumber(p.x) && isValidNumber(p.y);
};

export const validateProjectData = (data: any): Partial<FloorPlanState> => {
  if (!data || typeof data !== 'object') throw new Error('Invalid project format.');

  const walls: Wall[] = Array.isArray(data.walls) ? data.walls.filter((w: any) => {
    return w && typeof w.id === 'string' &&
      validatePoint(w.start) && validatePoint(w.end) &&
      isValidNumber(w.thickness) && isValidNumber(w.height) &&
      typeof w.material === 'string';
  }) : [];

  const rooms: Room[] = Array.isArray(data.rooms) ? data.rooms.filter((r: any) => {
    return r && typeof r.id === 'string' &&
      typeof r.name === 'string' &&
      typeof r.type === 'string' &&
      Array.isArray(r.points) && r.points.every(validatePoint) &&
      typeof r.floorMaterial === 'string' &&
      typeof r.color === 'string';
  }) : [];

  const doors: Door[] = Array.isArray(data.doors) ? data.doors.filter((d: any) => {
    return d && typeof d.id === 'string' &&
      typeof d.wallId === 'string' &&
      isValidNumber(d.position) && isValidNumber(d.width) &&
      typeof d.swingDirection === 'string' &&
      typeof d.material === 'string';
  }) : [];

  const windows: Window[] = Array.isArray(data.windows) ? data.windows.filter((w: any) => {
    return w && typeof w.id === 'string' &&
      typeof w.wallId === 'string' &&
      isValidNumber(w.position) && isValidNumber(w.width) &&
      isValidNumber(w.height) && isValidNumber(w.sillHeight);
  }) : [];

  const furniture: Furniture[] = Array.isArray(data.furniture) ? data.furniture.filter((f: any) => {
    return f && typeof f.id === 'string' &&
      typeof f.type === 'string' &&
      validatePoint(f.position) &&
      isValidNumber(f.rotation) && isValidNumber(f.width) &&
      isValidNumber(f.depth) &&
      typeof f.color === 'string';
  }) : [];

  return { walls, rooms, doors, windows, furniture };
};
