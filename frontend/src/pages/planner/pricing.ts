import { FurnitureType, WallMaterial, FloorMaterial, DoorMaterial } from './types';

// Prices are per item
export const FURNITURE_PRICES: Record<FurnitureType, number> = {
  sofa: 899,
  bed: 650,
  'dining-table': 450,
  chair: 85,
  desk: 220,
  wardrobe: 550,
  'kitchen-counter': 1200,
  toilet: 250,
  bathtub: 780,
  stairs: 2500,
  armchair: 350,
  loveseat: 600,
  bench: 120,
  ottoman: 90,
  nightstand: 110,
  bookshelf: 180,
  'tv-console': 240,
  cabinet: 320,
  plant: 45,
  lamp: 65,
  mirror: 85,
  'outdoor-tree': 150,
  fence: 45
};

// Prices are per square centimeter of wall surface (or per linear cm, assuming standard height)
// Assuming per linear cm of wall
export const WALL_PRICES: Record<WallMaterial, number> = {
  'white-paint': 0.15,
  'concrete': 0.30,
  'brick': 0.85,
  'wood-panel': 1.20
};

// Prices are per square centimeter of floor area
export const FLOOR_PRICES: Record<FloorMaterial, number> = {
  'hardwood': 0.08,
  'tiles': 0.05,
  'marble': 0.25,
  'carpet': 0.04,
  'concrete': 0.02
};

export const DOOR_PRICES: Record<DoorMaterial, number> = {
  'wood': 250,
  'glass': 450,
  'metal': 350
};

// Base price per window
export const WINDOW_PRICE_BASE = 300;
