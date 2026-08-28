import { useEffect, useState } from 'react';
import { useRoute, useLocation } from 'wouter';
import { usePlannerStore } from '../store';
import { FloorPlan3D } from '../components/FloorPlan3D';
import { FloorPlan2D } from '../components/FloorPlan2D';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Eye, Box } from 'lucide-react';
import { PLANS } from './marketplace-data';

declare global {
    interface Window {
        Razorpay: any;
    }
}

const API_BASE = import.meta.env.VITE_BETTER_AUTH_URL || 'http://localhost:5000';

export default function MarketplacePreview() {
    const [, params] = useRoute('/marketplace/:id');
    const [, setLocation] = useLocation();
    const [mode, setMode] = useState<'2d' | '3d'>('3d');
    const [purchasing, setPurchasing] = useState(false);
    const store = usePlannerStore();

    const plan = PLANS.find(p => String(p.id) === params?.id);

    // Load this listing's real plan data into the shared planner store so the
    // existing FloorPlan2D/FloorPlan3D components can render it unmodified.
    // NOTE: this is not yet a true read-only mode — see the note at the bottom
    // of this file for what's needed to lock editing down for a public preview.
    useEffect(() => {
        if (!plan) return;
        const s = store;
        [...s.furniture].forEach(f => s.deleteFurniture(f.id));
        [...s.doors].forEach(d => s.deleteDoor(d.id));
        [...s.windows].forEach(w => s.deleteWindow(w.id));
        [...s.rooms].forEach(r => s.deleteRoom(r.id));
        [...s.walls].forEach(w => s.deleteWall(w.id));

        plan.planData.walls.forEach(w => s.addWall(w));
        plan.planData.rooms.forEach(r => s.addRoom(r));
        plan.planData.doors.forEach(d => s.addDoor(d));
        plan.planData.windows.forEach(w => s.addWindow(w));
        plan.planData.furniture.forEach(f => s.addFurniture(f));
        s.setSelectedId(null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [plan?.id]);

    const handleBuy = async () => {
        if (!plan) return;
        setPurchasing(true);
        try {
            const res = await fetch(`${API_BASE}/api/payments/create-order`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ designId: plan.id, amount: plan.priceInr }),
            });
            const order = await res.json();
            if (!res.ok) throw new Error(order.error || 'Could not start checkout');

            if (!window.Razorpay) {
                throw new Error('Razorpay checkout script not loaded — add the <script> tag to index.html (see notes)');
            }

            const rzp = new window.Razorpay({
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                order_id: order.id,
                name: 'Dream2Build',
                description: plan.title,
                handler: () => {
                    alert('Purchase complete! This design is now yours to edit.');
                    // TODO: call a backend endpoint (e.g. POST /api/projects/from-plan) that
                    // clones plan.planData into a new row owned by the logged-in user, then
                    // redirect to /planner?project=<newId> so they land in their own editable copy.
                },
            });
            rzp.open();
        } catch (err) {
            console.error(err);
            alert(err instanceof Error ? err.message : 'Checkout failed to start. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    if (!plan) {
        return (
            <div className="flex h-screen w-screen flex-col items-center justify-center gap-4 bg-[#FAF8F3] text-[#1E2A22]">
                <p>Design not found.</p>
                <Button onClick={() => setLocation('/marketplace')}>Back to Marketplace</Button>
            </div>
        );
    }

    return (
        <div className="flex h-screen w-screen flex-col bg-background text-foreground">
            <div className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4">
                <div className="flex items-center gap-3">
                    <Button size="icon" variant="ghost" onClick={() => setLocation('/marketplace')}>
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                    <div>
                        <p className="text-sm font-semibold leading-none">{plan.title}</p>
                        <p className="text-xs text-muted-foreground">{plan.creator} · {plan.size}</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="flex rounded-full border border-border p-0.5">
                        <Button size="sm" variant={mode === '2d' ? 'default' : 'ghost'} className="h-7 rounded-full px-3" onClick={() => setMode('2d')}>
                            <Eye className="mr-1 h-3.5 w-3.5" /> 2D
                        </Button>
                        <Button size="sm" variant={mode === '3d' ? 'default' : 'ghost'} className="h-7 rounded-full px-3" onClick={() => setMode('3d')}>
                            <Box className="mr-1 h-3.5 w-3.5" /> 3D
                        </Button>
                    </div>
                    <span className="font-mono text-sm font-bold">{plan.price}</span>
                    <Button onClick={handleBuy} disabled={purchasing} className="rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30]">
                        {purchasing ? 'Starting checkout…' : 'Buy this design'}
                    </Button>
                </div>
            </div>

            <div className="relative flex-1">
                {mode === '3d' ? <FloorPlan3D /> : <FloorPlan2D />}
            </div>
        </div>
    );
}

/**
 * Known follow-ups (not yet done):
 * 1. This loads plan data into the SAME store the real /planner page uses —
 *    navigating straight from a preview to /planner without saving/reloading
 *    will show this plan's data, not the user's own project. Fine for now
 *    since there's no "save project to account" feature yet (see earlier
 *    conversation) — revisit once that exists.
 * 2. FloorPlan2D still allows full editing here (no readOnly prop exists yet)
 *    — a visitor could drag walls around on someone else's paid listing.
 *    Add a `readOnly` prop to FloorPlan2D/FloorPlan3D that disables the
 *    interaction layer's mousedown handlers and hides the toolbars.
 * 3. Razorpay's checkout.js must be loaded globally, e.g. in index.html:
 *      <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
 * 4. VITE_RAZORPAY_KEY_ID must be set as a frontend env var (the public key,
 *    safe to expose — NOT the secret key, which stays backend-only).
 */