import { Wall, Room, Door, Window, Furniture, FurnitureType, RoomType } from '../types';

export interface PlanData {
    walls: Wall[];
    rooms: Room[];
    doors: Door[];
    windows: Window[];
    furniture: Furniture[];
}

export interface MarketPlan {
    id: number;
    title: string;
    creator: string;
    price: string;      // display string, e.g. "₹199"
    priceInr: number;   // numeric rupee amount used for checkout
    rating: string;
    reviews: string;
    size: string;
    planData: PlanData;
}

interface RectSpec {
    type: RoomType;
    name: string;
    x: number; y: number; w: number; h: number; // in layout units (0-100 scale, matches old glyph coords)
}

const FURNITURE_BY_ROOM: Record<RoomType, { type: FurnitureType; color: string }> = {
    living: { type: 'sofa', color: '#8b6565' },
    bedroom: { type: 'bed', color: '#5b6b9e' },
    kitchen: { type: 'kitchen-counter', color: '#8e8e8e' },
    bathroom: { type: 'toilet', color: '#cce8ff' },
    dining: { type: 'dining-table', color: '#9e7a4e' },
    balcony: { type: 'chair', color: '#7a9e6b' },
    corridor: { type: 'chair', color: '#7a9e6b' },
};

const ROOM_FILL: Record<RoomType, string> = {
    living: 'rgba(218,178,120,0.4)', bedroom: 'rgba(160,130,220,0.4)',
    kitchen: 'rgba(80,190,190,0.4)', bathroom: 'rgba(80,140,220,0.4)',
    dining: 'rgba(220,200,100,0.4)', balcony: 'rgba(80,200,120,0.4)',
    corridor: 'rgba(160,160,160,0.4)',
};

// Builds a simple, real (if not fully wall-merged) floor plan from a set of room
// rectangles — good enough for marketplace preview/purchase; each room gets its
// own 4-wall perimeter and one representative piece of furniture.
function buildPlan(rects: RectSpec[], scale: number, wallHeight = 270): PlanData {
    const walls: Wall[] = [];
    const rooms: Room[] = [];
    const furniture: Furniture[] = [];
    let wIdx = 0;

    rects.forEach((r, i) => {
        const x = r.x * scale, y = r.y * scale, w = r.w * scale, h = r.h * scale;
        const pts = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }];

        rooms.push({
            id: `r${i}`, name: r.name, type: r.type, points: pts,
            floorMaterial: 'hardwood', color: ROOM_FILL[r.type],
        });

        for (let k = 0; k < 4; k++) {
            const a = pts[k], b = pts[(k + 1) % 4];
            walls.push({ id: `w${wIdx++}`, start: a, end: b, thickness: 14, height: wallHeight, material: 'white-paint' });
        }

        const cfg = FURNITURE_BY_ROOM[r.type];
        furniture.push({
            id: `f${i}`, type: cfg.type, position: { x: x + w / 2, y: y + h / 2 }, rotation: 0,
            width: Math.min(w * 0.4, 180), depth: Math.min(h * 0.3, 90), color: cfg.color,
        });
    });

    return { walls, rooms, doors: [], windows: [], furniture };
}

// Three base footprints (same room-rectangle shapes the old thumbnail used),
// reused across listings at different scales/room assignments for variety.
const LAYOUT_A: Omit<RectSpec, 'type' | 'name'>[] = [
    { x: 4, y: 4, w: 42, h: 30 }, { x: 50, y: 4, w: 46, h: 18 },
    { x: 4, y: 38, w: 30, h: 28 }, { x: 38, y: 38, w: 58, h: 28 },
];
const LAYOUT_B: Omit<RectSpec, 'type' | 'name'>[] = [
    { x: 4, y: 4, w: 60, h: 22 }, { x: 68, y: 4, w: 28, h: 44 },
    { x: 4, y: 30, w: 28, h: 36 }, { x: 36, y: 40, w: 28, h: 26 },
];
const LAYOUT_C: Omit<RectSpec, 'type' | 'name'>[] = [
    { x: 4, y: 4, w: 28, h: 62 }, { x: 36, y: 4, w: 60, h: 18 },
    { x: 36, y: 26, w: 28, h: 40 }, { x: 68, y: 26, w: 28, h: 40 },
];

function withTypes(layout: Omit<RectSpec, 'type' | 'name'>[], assign: { type: RoomType; name: string }[]): RectSpec[] {
    return layout.map((r, i) => ({ ...r, ...assign[i] }));
}

export const PLANS: MarketPlan[] = [
    {
        id: 1, title: 'The Glass House', creator: '@studiomodern', price: '₹199', priceInr: 199,
        rating: '4.9', reviews: '1.2k', size: '4,200 sqft',
        planData: buildPlan(withTypes(LAYOUT_A, [
            { type: 'living', name: 'Living Room' }, { type: 'dining', name: 'Dining Room' },
            { type: 'bedroom', name: 'Master Bedroom' }, { type: 'kitchen', name: 'Kitchen' },
        ]), 34),
    },
    {
        id: 2, title: 'Desert Pavilion', creator: '@arid_arch', price: '₹149', priceInr: 149,
        rating: '4.8', reviews: '850', size: '2,800 sqft',
        planData: buildPlan(withTypes(LAYOUT_B, [
            { type: 'living', name: 'Living Room' }, { type: 'bedroom', name: 'Bedroom' },
            { type: 'bathroom', name: 'Bathroom' }, { type: 'kitchen', name: 'Kitchen' },
        ]), 30),
    },
    {
        id: 3, title: 'Nordic Minimalist', creator: '@scandi_design', price: '₹89', priceInr: 89,
        rating: '4.7', reviews: '2.4k', size: '1,850 sqft',
        planData: buildPlan(withTypes(LAYOUT_C, [
            { type: 'bedroom', name: 'Bedroom' }, { type: 'living', name: 'Living Room' },
            { type: 'kitchen', name: 'Kitchen' }, { type: 'bathroom', name: 'Bathroom' },
        ]), 22),
    },
    {
        id: 4, title: 'Urban Loft', creator: '@citybuilds', price: '₹129', priceInr: 129,
        rating: '4.9', reviews: '3k+', size: '2,100 sqft',
        planData: buildPlan(withTypes(LAYOUT_A, [
            { type: 'living', name: 'Living Room' }, { type: 'kitchen', name: 'Kitchen' },
            { type: 'bedroom', name: 'Bedroom' }, { type: 'bathroom', name: 'Bathroom' },
        ]), 24),
    },
    {
        id: 5, title: 'Coastal Retreat', creator: '@pacific_homes', price: '₹249', priceInr: 249,
        rating: '5.0', reviews: '450', size: '3,500 sqft',
        planData: buildPlan(withTypes(LAYOUT_B, [
            { type: 'living', name: 'Living Room' }, { type: 'balcony', name: 'Balcony' },
            { type: 'bedroom', name: 'Bedroom' }, { type: 'dining', name: 'Dining Room' },
        ]), 38),
    },
    {
        id: 6, title: 'Eco Cabin', creator: '@green_living', price: '₹59', priceInr: 59,
        rating: '4.6', reviews: '1.1k', size: '950 sqft',
        planData: buildPlan(withTypes(LAYOUT_C, [
            { type: 'bedroom', name: 'Bedroom' }, { type: 'living', name: 'Living Room' },
            { type: 'kitchen', name: 'Kitchen' }, { type: 'bathroom', name: 'Bathroom' },
        ]), 15),
    },
];