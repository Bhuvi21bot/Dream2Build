import { useState } from 'react';
import {
    ArrowLeft,
    Armchair,
    BedDouble,
    Blocks,
    Box,
    ChevronRight,
    Download,
    DoorOpen,
    Grid2X2,
    Hammer,
    Home,
    LampFloor,
    Layers,
    MousePointer2,
    Paintbrush,
    Pentagon,
    Redo2,
    Search,
    Sofa,
    Square,
    Trees,
    Undo2,
    X,
} from 'lucide-react';

import { usePlannerStore } from '../store';
import type { FurnitureType, Point } from '../types';

import {
    FloorPlan2D,
    FURNITURE_CFG,
    type RoomShape,
} from './FloorPlan2D';
import { FloorPlan3D } from './FloorPlan3D';

import './PlannerEditor.css';

type CatalogTab = 'build' | 'furnish' | 'materials';
type EditorView = '2d' | '3d';

const SHAPES: {
    value: RoomShape;
    label: string;
    points: string;
}[] = [
        {
            value: 'rect',
            label: 'Rectangle',
            points: '18,18 82,18 82,82 18,82',
        },
        {
            value: 'l-shape',
            label: 'L-shaped',
            points: '18,18 82,18 82,50 50,50 50,82 18,82',
        },
        {
            value: 'u-shape',
            label: 'U-shaped',
            points: '15,18 36,18 36,53 64,53 64,18 85,18 85,82 15,82',
        },
        {
            value: 't-shape',
            label: 'T-shaped',
            points: '36,18 64,18 64,45 85,45 85,82 15,82 15,45 36,45',
        },
        {
            value: 'octagonal',
            label: 'Octagonal',
            points: '35,15 65,15 85,35 85,65 65,85 35,85 15,65 15,35',
        },
    ];

const MATERIALS = [
    { id: 'hardwood', label: 'Natural wood', color: '#c69d73' },
    { id: 'tiles', label: 'Porcelain tile', color: '#d8d0c4' },
    { id: 'marble', label: 'Light marble', color: '#f0eeea' },
    { id: 'carpet', label: 'Soft carpet', color: '#87938e' },
    { id: 'concrete', label: 'Concrete', color: '#aaa9a5' },
];

function polygonArea(points: Point[]) {
    if (points.length < 3) return 0;

    let area = 0;

    for (let i = 0; i < points.length; i++) {
        const a = points[i];
        const b = points[(i + 1) % points.length];
        area += a.x * b.y - b.x * a.y;
    }

    // Your model uses centimeters.
    return Math.abs(area) / 2 / 10000;
}

function FurnitureIcon({ type }: { type: FurnitureType }) {
    if (type === 'bed') return <BedDouble />;
    if (['sofa', 'loveseat'].includes(type)) return <Sofa />;
    if (['chair', 'armchair', 'ottoman'].includes(type)) {
        return <Armchair />;
    }
    if (['plant', 'outdoor-tree'].includes(type)) return <Trees />;
    if (type === 'lamp') return <LampFloor />;

    return <Box />;
}

function SelectionInspector() {
    const store = usePlannerStore();

    const furniture = store.furniture.find(
        item => item.id === store.selectedId,
    );
    const room = store.rooms.find(item => item.id === store.selectedId);
    const wall = store.walls.find(item => item.id === store.selectedId);

    if (!furniture && !room && !wall) return null;

    const title = furniture
        ? FURNITURE_CFG[furniture.type].label
        : room
            ? room.name
            : 'Wall';

    const positiveNumber = (
        raw: string,
        update: (value: number) => void,
    ) => {
        const value = Number(raw);
        if (Number.isFinite(value) && value > 0) update(value);
    };

    return (
        <aside className="planner-inspector" aria-label="Selection properties">
            <div className="planner-inspector-heading">
                <div>
                    <span className="planner-eyebrow">SELECTED OBJECT</span>
                    <h3>{title}</h3>
                </div>

                <button
                    className="planner-icon-button"
                    aria-label="Deselect object"
                    onClick={() => store.setSelectedId(null)}
                >
                    <X size={17} />
                </button>
            </div>

            {furniture && (
                <>
                    <div className="planner-field-row">
                        <label className="planner-field">
                            Width, cm
                            <input
                                type="number"
                                min="1"
                                value={furniture.width}
                                onChange={event =>
                                    positiveNumber(event.target.value, width =>
                                        store.updateFurniture(furniture.id, { width }),
                                    )
                                }
                            />
                        </label>

                        <label className="planner-field">
                            Depth, cm
                            <input
                                type="number"
                                min="1"
                                value={furniture.depth}
                                onChange={event =>
                                    positiveNumber(event.target.value, depth =>
                                        store.updateFurniture(furniture.id, { depth }),
                                    )
                                }
                            />
                        </label>
                    </div>

                    <label className="planner-field">
                        Rotation
                        <input
                            type="range"
                            min="0"
                            max="360"
                            step="5"
                            value={furniture.rotation}
                            onChange={event =>
                                store.updateFurniture(furniture.id, {
                                    rotation: Number(event.target.value),
                                })
                            }
                        />
                        <span>{furniture.rotation}°</span>
                    </label>

                    <label className="planner-field">
                        Color
                        <input
                            type="color"
                            value={furniture.color}
                            onChange={event =>
                                store.updateFurniture(furniture.id, {
                                    color: event.target.value,
                                })
                            }
                        />
                    </label>
                </>
            )}

            {room && (
                <>
                    <label className="planner-field">
                        Room name
                        <input
                            value={room.name}
                            onChange={event =>
                                store.updateRoom(room.id, { name: event.target.value })
                            }
                        />
                    </label>

                    <div className="planner-property-summary">
                        <span>Floor area</span>
                        <strong>{polygonArea(room.points).toFixed(2)} m²</strong>
                    </div>

                    <p className="planner-muted">
                        Drag a corner in 2D to reshape this room. Open Materials to
                        change its floor finish.
                    </p>
                </>
            )}

            {wall && (
                <div className="planner-field-row">
                    <label className="planner-field">
                        Height, cm
                        <input
                            type="number"
                            min="1"
                            value={wall.height}
                            onChange={event =>
                                positiveNumber(event.target.value, height =>
                                    store.updateWall(wall.id, { height }),
                                )
                            }
                        />
                    </label>

                    <label className="planner-field">
                        Thickness, cm
                        <input
                            type="number"
                            min="1"
                            value={wall.thickness}
                            onChange={event =>
                                positiveNumber(event.target.value, thickness =>
                                    store.updateWall(wall.id, { thickness }),
                                )
                            }
                        />
                    </label>
                </div>
            )}

            <button
                className="planner-delete-button"
                onClick={() => {
                    if (furniture) store.deleteFurniture(furniture.id);
                    if (room) store.deleteRoom(room.id);
                    if (wall) store.deleteWall(wall.id);
                    store.setSelectedId(null);
                }}
            >
                Delete object
            </button>
        </aside>
    );
}

export function PlannerEditor() {
    const store = usePlannerStore();

    const [view, setView] = useState<EditorView>('2d');
    const [tab, setTab] = useState<CatalogTab>('build');
    const [roomShape, setRoomShape] = useState<RoomShape>('rect');
    const [search, setSearch] = useState('');
    const [projectName, setProjectName] = useState('My home design');

    const selectedRoom = store.rooms.find(
        room => room.id === store.selectedId,
    );

    const furnitureTypes = (
        Object.keys(FURNITURE_CFG) as FurnitureType[]
    ).filter(type =>
        FURNITURE_CFG[type].label
            .toLowerCase()
            .includes(search.toLowerCase()),
    );

    const tools = [
        { id: 'select', label: 'Select', icon: MousePointer2 },
        { id: 'wall', label: 'Draw wall', icon: Hammer },
        { id: 'polygon-room', label: 'Custom room', icon: Pentagon },
        { id: 'door', label: 'Doors', icon: DoorOpen },
        { id: 'window', label: 'Windows', icon: Grid2X2 },
    ] as const;

    const chooseTool = (
        tool: Parameters<typeof store.setActiveTool>[0],
    ) => {
        store.cancelPolygon();
        store.setActiveTool(tool);
        setView('2d');
    };

    const addFurniture = (type: FurnitureType) => {
        const cfg = FURNITURE_CFG[type];

        const points = selectedRoom?.points.length
            ? selectedRoom.points
            : [
                ...store.rooms.flatMap(room => room.points),
                ...store.walls.flatMap(wall => [wall.start, wall.end]),
            ];

        const position = points.length
            ? {
                x:
                    (Math.min(...points.map(point => point.x)) +
                        Math.max(...points.map(point => point.x))) /
                    2,
                y:
                    (Math.min(...points.map(point => point.y)) +
                        Math.max(...points.map(point => point.y))) /
                    2,
            }
            : { x: 300, y: 300 };

        const id = `f_${crypto.randomUUID()}`;

        store.addFurniture({
            id,
            type,
            position,
            rotation: 0,
            width: cfg.w,
            depth: cfg.d,
            color: cfg.fill,
            style: store.selectedFurnitureStyle,
        });

        chooseTool('select');
        store.setSelectedId(id);
    };

    const exportProject = () => {
        const data = {
            version: 1,
            name: projectName,
            exportedAt: new Date().toISOString(),
            walls: store.walls,
            rooms: store.rooms,
            doors: store.doors,
            windows: store.windows,
            furniture: store.furniture,
        };

        const url = URL.createObjectURL(
            new Blob([JSON.stringify(data, null, 2)], {
                type: 'application/json',
            }),
        );

        const link = document.createElement('a');
        link.href = url;
        link.download = `floorplan-${Date.now()}.json`;
        link.click();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <div className="planner-app">
            <header className="planner-header">
                <a className="planner-brand" href="/" aria-label="Home">
                    <span className="planner-brand-icon">
                        <Home size={21} />
                    </span>
                    <span>Plan Studio</span>
                </a>

                <span className="planner-header-divider" />

                <div className="planner-project">
                    <input
                        aria-label="Project name"
                        value={projectName}
                        onChange={event => setProjectName(event.target.value)}
                    />
                    <span>Local editing · Export to keep a copy</span>
                </div>

                <div className="planner-history">
                    <button
                        className="planner-icon-button"
                        aria-label="Undo"
                        title="Undo"
                        onClick={() => store.undo()}
                    >
                        <Undo2 size={19} />
                    </button>
                    <button
                        className="planner-icon-button"
                        aria-label="Redo"
                        title="Redo"
                        onClick={() => store.redo()}
                    >
                        <Redo2 size={19} />
                    </button>
                </div>

                <div className="planner-view-switch" aria-label="Editor view">
                    <button
                        className={view === '2d' ? 'is-active' : ''}
                        aria-pressed={view === '2d'}
                        onClick={() => setView('2d')}
                    >
                        <Square size={16} />
                        2D
                    </button>
                    <button
                        className={view === '3d' ? 'is-active' : ''}
                        aria-pressed={view === '3d'}
                        onClick={() => setView('3d')}
                    >
                        <Box size={17} />
                        3D
                    </button>
                </div>

                <button
                    className="planner-primary-button"
                    onClick={exportProject}
                >
                    <Download size={17} />
                    Export project
                </button>
            </header>

            <div className="planner-body">
                <nav className="planner-rail" aria-label="Catalog sections">
                    {[
                        { id: 'build', label: 'Build', icon: Blocks },
                        { id: 'furnish', label: 'Furnish', icon: Sofa },
                        { id: 'materials', label: 'Materials', icon: Paintbrush },
                    ].map(item => (
                        <button
                            key={item.id}
                            className={tab === item.id ? 'is-active' : ''}
                            aria-pressed={tab === item.id}
                            onClick={() => {
                                setTab(item.id as CatalogTab);
                                setSearch('');
                            }}
                        >
                            <item.icon size={23} strokeWidth={1.7} />
                            <span>{item.label}</span>
                        </button>
                    ))}

                    <span className="planner-rail-spacer" />
                    <span className="planner-rail-caption">DESIGN</span>
                </nav>

                <aside className="planner-catalog">
                    <div className="planner-catalog-heading">
                        <span className="planner-eyebrow">MAKE IT YOURS</span>
                        <h2>
                            {tab === 'build'
                                ? 'Build your space'
                                : tab === 'furnish'
                                    ? 'Furnish your home'
                                    : 'Colors & materials'}
                        </h2>
                        <p>
                            {tab === 'build'
                                ? 'Start with a room, then add the details.'
                                : tab === 'furnish'
                                    ? 'Choose an item, then move it into place.'
                                    : 'Select a room to update its floor finish.'}
                        </p>
                    </div>

                    {tab === 'furnish' && (
                        <label className="planner-search">
                            <Search size={17} />
                            <input
                                placeholder="Search furniture"
                                value={search}
                                onChange={event => setSearch(event.target.value)}
                            />
                        </label>
                    )}

                    <div className="planner-catalog-scroll">
                        {tab === 'build' && (
                            <>
                                <div className="planner-section-heading">
                                    <h3>Room shapes</h3>
                                    <span>{SHAPES.length} shapes</span>
                                </div>

                                <div className="planner-card-grid">
                                    {SHAPES.map(shape => (
                                        <button
                                            key={shape.value}
                                            className={`planner-catalog-card ${store.activeTool === 'room' &&
                                                    roomShape === shape.value
                                                    ? 'is-active'
                                                    : ''
                                                }`}
                                            onClick={() => {
                                                setRoomShape(shape.value);
                                                chooseTool('room');
                                            }}
                                        >
                                            <span className="planner-card-preview">
                                                <svg viewBox="0 0 100 100" aria-hidden="true">
                                                    <polygon points={shape.points} />
                                                </svg>
                                            </span>
                                            <span>{shape.label}</span>
                                        </button>
                                    ))}
                                </div>

                                <div className="planner-section-heading">
                                    <h3>Construction</h3>
                                </div>

                                <div className="planner-tool-list">
                                    {tools.map(tool => (
                                        <button
                                            key={tool.id}
                                            className={
                                                store.activeTool === tool.id ? 'is-active' : ''
                                            }
                                            onClick={() => chooseTool(tool.id)}
                                        >
                                            <tool.icon size={19} />
                                            <span>{tool.label}</span>
                                            <ChevronRight size={15} />
                                        </button>
                                    ))}
                                </div>

                                <div className="planner-tip">
                                    <Layers size={19} />
                                    <p>
                                        Draw in 2D, then switch to 3D to explore the same
                                        design.
                                    </p>
                                </div>
                            </>
                        )}

                        {tab === 'furnish' && (
                            <>
                                <div className="planner-section-heading">
                                    <h3>Furniture collection</h3>
                                    <span>{furnitureTypes.length} items</span>
                                </div>

                                <div className="planner-card-grid">
                                    {furnitureTypes.map(type => {
                                        const cfg = FURNITURE_CFG[type];

                                        return (
                                            <button
                                                key={type}
                                                className="planner-catalog-card"
                                                onClick={() => addFurniture(type)}
                                            >
                                                <span className="planner-card-preview furniture">
                                                    <FurnitureIcon type={type} />
                                                </span>
                                                <span>{cfg.label}</span>
                                                <small>
                                                    {cfg.w} × {cfg.d} cm
                                                </small>
                                            </button>
                                        );
                                    })}
                                </div>

                                {furnitureTypes.length === 0 && (
                                    <p className="planner-muted">
                                        No items match your search.
                                    </p>
                                )}
                            </>
                        )}

                        {tab === 'materials' && (
                            <>
                                <div className="planner-selection-note">
                                    {selectedRoom
                                        ? `Applying to: ${selectedRoom.name}`
                                        : 'Select a room in 2D to apply a material.'}
                                </div>

                                <div className="planner-card-grid">
                                    {MATERIALS.map(material => (
                                        <button
                                            key={material.id}
                                            disabled={!selectedRoom}
                                            className={`planner-catalog-card ${selectedRoom?.floorMaterial === material.id
                                                    ? 'is-active'
                                                    : ''
                                                }`}
                                            onClick={() => {
                                                if (!selectedRoom) return;

                                                store.updateRoom(selectedRoom.id, {
                                                    floorMaterial: material.id,
                                                });
                                            }}
                                        >
                                            <span
                                                className={`planner-material-swatch ${material.id}`}
                                                style={{ backgroundColor: material.color }}
                                            />
                                            <span>{material.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>

                    <div className="planner-catalog-footer">
                        <span className="planner-status-dot" />
                        Your design, one detail at a time
                    </div>
                </aside>

                <main className="planner-workspace">
                    {view === '2d' ? (
                        <FloorPlan2D roomShape={roomShape} />
                    ) : (
                        <FloorPlan3D />
                    )}

                    {view === '3d' && (
                        <button
                            className="planner-back-to-plan"
                            onClick={() => setView('2d')}
                        >
                            <ArrowLeft size={16} />
                            Back to floor plan
                        </button>
                    )}

                    <SelectionInspector />

                    <div className="planner-workspace-status">
                        <span>
                            <Layers size={14} />
                            {store.rooms.length} rooms
                        </span>
                        <span>{store.walls.length} walls</span>
                        <span>{store.furniture.length} furniture items</span>
                        <span>Units: cm</span>
                    </div>
                </main>
            </div>
        </div>
    );
}