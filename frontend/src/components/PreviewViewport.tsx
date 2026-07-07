import { useMemo } from 'react';
import type { Venue } from '@/types';
import screenImage from '@/assets/screen.jpg';
import {
  PREVIEW_PERSPECTIVE_PX,
  MAX_CAMERA_YAW_DEG,
  CLUSTER_WIDTH_PX,
  SCREEN_WORLD_X,
  SCREEN_WORLD_Z,
  SCREEN_WIDTH_PX,
  SCREEN_HEIGHT_PX,
} from '@/constants/preview';
import { buildArenaLayout } from '@/utils/arenaLayout';
import { useSelectionContext } from '@/context/SelectionContext';

export interface PreviewViewportProps {
  venue: Venue;
}

export function PreviewViewport({ venue }: PreviewViewportProps) {
  const { selectedSeatIds, activeSeatId } = useSelectionContext();
  const selectedSet = useMemo(() => new Set(selectedSeatIds), [selectedSeatIds]);

  const arenaLayout = useMemo(() => buildArenaLayout(venue), [venue]);

  const activePosition = activeSeatId
    ? (arenaLayout.get(activeSeatId) ?? null)
    : null;

  const cameraZ = activePosition?.worldZ ?? 0;
  const cameraX = activePosition?.worldX ?? 0;
  const cameraY = (activePosition?.worldY ?? 0) - 200;

  const visibleSeats = useMemo(() => {
    if (!activePosition) return [];
    const section = venue.sections[activePosition.sectionIndex];
    if (!section) return [];

    const seatIds: string[] = [];
    section.rows.forEach((row) => {
      row.seats.forEach((seat) => seatIds.push(seat.id));
    });

    return seatIds
      .map((seatId) => arenaLayout.get(seatId))
      .filter((pos): pos is NonNullable<typeof pos> => pos !== undefined)
      .filter((pos) => pos.seatId !== activeSeatId)
      .filter((pos) => pos.worldZ < cameraZ);
  }, [activePosition, arenaLayout, venue, activeSeatId, cameraZ]);

  const yawDeg = activePosition
    ? -(activePosition.worldX / (CLUSTER_WIDTH_PX / 2)) * MAX_CAMERA_YAW_DEG
    : 0;

  const pitchDeg = activePosition ? (1 - activePosition.rowFrac) * 6 : 0;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{ perspective: `${PREVIEW_PERSPECTIVE_PX}px`, perspectiveOrigin: '50% 50%' }}
    >
      {activePosition && (
        <div
          className="absolute inset-0 z-0 transition-transform duration-700 ease-out"
          style={{
            transformStyle: 'preserve-3d',
            // Head rotation applied LAST (outermost wrapper) so it rotates
            // the scene around the camera position, not the world origin.
            transform: `rotateX(${pitchDeg}deg) rotateY(${yawDeg}deg)`,
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              transformStyle: 'preserve-3d',
              // Camera translate applied FIRST (innermost) — puts camera at
              // origin so rotation pivots around it, not the world center.
              transform: `translateZ(${-cameraZ}px) translateY(${-cameraY}px) translateX(${-cameraX}px)`,
            }}
          >
            <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
              {visibleSeats.map((pos) => {
                const isSelected = selectedSet.has(pos.seatId);
                return (
                  <div
                    key={pos.seatId}
                    style={{
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '80px',
                      height: '140px',
                      transform: `translateX(calc(-50% + ${pos.worldX}px)) translateY(calc(-50% + ${pos.worldY}px)) translateZ(${pos.worldZ}px)`,
                      background: isSelected ? '#fbbf24' : '#334155',
                      borderRadius: '40px 40px 6px 6px',
                      opacity: isSelected ? 1 : 0.5,
                      border: isSelected ? '3px solid #fcd34d' : '1px solid rgba(255,255,255,0.15)',
                      boxShadow: isSelected
                        ? '0 0 8px rgba(251,191,36,0.5)'
                        : '0 1px 2px rgba(0,0,0,0.3)',
                    }}
                  />
                );
              })}
            </div>

            {/*
              Screen with hybrid positioning:
              - Y is camera-compensated (stays fixed in viewport regardless
                of seat elevation), canceling the outer translateY(-cameraY)
              - Z is world-fixed (distance varies with cameraZ), so the
                screen appears farther from back rows and closer from front
            */}
            <div
              className="absolute shadow-2xl"
              style={{
                left: '50%',
                top: '50%',
                width: `${SCREEN_WIDTH_PX}px`,
                height: `${SCREEN_HEIGHT_PX}px`,
                transform: `translateX(calc(-50% + ${SCREEN_WORLD_X}px)) translateY(calc(-50% + ${cameraY}px)) translateZ(${SCREEN_WORLD_Z}px)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="h-full w-full overflow-hidden rounded-md">
                <img src={screenImage} alt="Screen" className="h-full w-full object-cover" />
              </div>
            </div>
          </div>
        </div>
      )}

      <div
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />

      {!activeSeatId && (
        <p className="absolute inset-x-0 bottom-6 z-10 text-center text-sm text-slate-200">
          Select a seat to preview the view
        </p>
      )}
    </div>
  );
}
