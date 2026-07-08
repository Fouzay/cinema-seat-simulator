import { useMemo, useState, useEffect } from 'react';
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
  WALL_YAW_DEG,
} from '@/constants/preview';
import { buildArenaLayout } from '@/utils/arenaLayout';
import { buildQuickPickVenue } from '@/utils/quickPickSeats';
import { useSelectionContext } from '@/context/SelectionContext';

const DESIGN_VIEWPORT_WIDTH = 1400;

export interface PreviewViewportProps {
  venue: Venue;
}

export function PreviewViewport({ venue }: PreviewViewportProps) {
  const { activeSeatId } = useSelectionContext();

  const [viewportScale, setViewportScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      setViewportScale(Math.min(1, window.innerWidth / DESIGN_VIEWPORT_WIDTH));
    };
    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  const arenaLayout = useMemo(() => buildArenaLayout(venue), [venue]);
  const quickPickLayout = useMemo(() => buildArenaLayout(buildQuickPickVenue()), []);

  const activePosition = activeSeatId
    ? (arenaLayout.get(activeSeatId) ?? quickPickLayout.get(activeSeatId) ?? null)
    : null;

  const defaultPosition = useMemo(() => {
    const iter = arenaLayout.values();
    return iter.next().value ?? null;
  }, [arenaLayout]);

  const pos = activePosition ?? defaultPosition;
  const isQuickPick = activeSeatId?.startsWith('QP-');

  const cameraZ = pos?.worldZ ?? 0;
  const cameraX = (pos?.worldX ?? 0) * (isQuickPick ? 0.8 : 0.3);
  const cameraY = (pos?.worldY ?? 0) - (isQuickPick ? 100 : 200);

  const yawDeg = pos
    ? -(pos.worldX / (CLUSTER_WIDTH_PX / 2)) * (isQuickPick ? MAX_CAMERA_YAW_DEG * 2 : MAX_CAMERA_YAW_DEG)
    : 0;

  const pitchDeg = pos ? -(pos.worldY + 50) / (isQuickPick ? 120 : 200) : 0;

  return (
    <div
      className="relative h-full w-full overflow-hidden bg-black"
      style={{ perspective: `${PREVIEW_PERSPECTIVE_PX}px`, perspectiveOrigin: '50% 50%' }}
    >
      {pos && (
        <div
          className="absolute inset-0 z-0 transition-transform duration-500 ease-out will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `scale(${viewportScale}) rotateX(${pitchDeg}deg) rotateY(${yawDeg}deg)`,
          }}
        >
          <div
            className="absolute inset-0 transition-transform duration-500 ease-out will-change-transform"
            style={{
              transformStyle: 'preserve-3d',
              transform: `translateZ(${-cameraZ}px) translateY(${-cameraY}px) translateX(${-cameraX}px)`,
            }}
          >
            <div
              className="absolute shadow-2xl transition-transform duration-500 ease-out will-change-transform"
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

              <div
                className="absolute right-full top-0 h-full w-[100vw]"
                style={{
                  transformOrigin: 'right center',
                  transform: `rotateY(${WALL_YAW_DEG}deg)`,
                  background: `
                    linear-gradient(to right,
                      rgba(255,180,50,0.18) 0%,
                      rgba(180,60,40,0.22) 3%,
                      transparent 10%,
                      transparent 90%,
                      rgba(180,60,40,0.22) 97%,
                      rgba(255,180,50,0.18) 100%
                    ),
                    #000000
                  `.replace(/\s+/g, ' ').trim(),
                  opacity: 0.9,
                }}
              />
              <div
                className="absolute left-full top-0 h-full w-[100vw]"
                style={{
                  transformOrigin: 'left center',
                  transform: `rotateY(${-WALL_YAW_DEG}deg)`,
                  background: `
                    linear-gradient(to right,
                      rgba(255,180,50,0.18) 0%,
                      rgba(180,60,40,0.22) 3%,
                      transparent 10%,
                      transparent 90%,
                      rgba(180,60,40,0.22) 97%,
                      rgba(255,180,50,0.18) 100%
                    ),
                    #000000
                  `.replace(/\s+/g, ' ').trim(),
                  opacity: 0.9,
                }}
              />
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
    </div>
  );
}
