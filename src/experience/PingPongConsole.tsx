import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { PINGPONG_FRAME } from './pingpong';
import { track } from './analytics';

type Status = 'loading' | 'ready' | 'error';
type GameKey = 'w' | 's' | 'o' | 'l' | 'Enter';

const WIDTH = 770, HEIGHT = 530;

export function PingPongConsole() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const gameRef = useRef<HTMLDivElement>(null);
  // A new session mounts a new frame; closing unmounts it and the JVM goes with it.
  const [session, setSession] = useState(0);
  const [status, setStatus] = useState<Status>('loading');
  const [scale, setScale] = useState(1);
  const started = useRef(0);

  useEffect(() => {
    const dialog = dialogRef.current!;
    const open = () => {
      if (dialog.open) return;
      setStatus('loading');
      setSession((n) => n + 1);
      started.current = performance.now();
      dialog.showModal();
      track('pingpong_open');
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== location.origin || event.source !== frameRef.current?.contentWindow || event.data?.source !== 'pingpong') return;
      if (event.data.type === 'ready') {
        setStatus('ready');
        frameRef.current?.focus();
        track('pingpong_ready', { seconds: Math.round((performance.now() - started.current) / 100) / 10 });
      } else if (event.data.type === 'error') {
        console.warn('PingPong could not start:', event.data.detail);
        setStatus('error');
      } else if (event.data.type === 'close') dialog.close();
    };
    // The Swing window is a fixed 770×530; scale it to the room the layout leaves.
    const resize = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width && height) setScale(Math.min(1, width / WIDTH, height / HEIGHT));
    });
    resize.observe(gameRef.current!);
    window.addEventListener('pingpong:open', open);
    window.addEventListener('message', onMessage);
    return () => {
      resize.disconnect();
      window.removeEventListener('pingpong:open', open);
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const send = (key: GameKey, down: boolean) =>
    frameRef.current?.contentWindow?.postMessage({ source: 'pingpong-controls', key, down }, location.origin);

  // Held like a real key: press on touch, release on lift, cancel, or sliding off.
  const pad = (key: GameKey) => ({
    onPointerDown: (event: ReactPointerEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.dataset.pressed = 'true';
      send(key, true);
    },
    onLostPointerCapture: (event: ReactPointerEvent<HTMLButtonElement>) => {
      delete event.currentTarget.dataset.pressed;
      send(key, false);
    },
    onContextMenu: (event: ReactMouseEvent) => event.preventDefault(),
  });

  return (
    <dialog ref={dialogRef} className="pp" aria-labelledby="pp-title" onClose={() => setSession(0)}
      onClick={(event) => { if (event.target === dialogRef.current) dialogRef.current.close(); }}>
      <div className="pp-head">
        <p id="pp-title"><strong>PingPong</strong><span> · built at 15 · the original Java, running in your browser</span></p>
        <button type="button" className="pp-close" aria-label="Close" onClick={() => dialogRef.current!.close()}>×</button>
      </div>
      <div ref={gameRef} className="pp-game">
        <div className="pp-screen" style={{ width: WIDTH * scale, height: HEIGHT * scale }}>
          {session > 0 && <iframe key={session} ref={frameRef} className="pp-frame" src={PINGPONG_FRAME} title="PingPong game"
            style={{ transform: `scale(${scale})` }} />}
          {status !== 'ready' && (
            <div className="pp-status" role="status">
              {status === 'error'
                ? <>Java didn’t start this time. <a href="https://github.com/Aleedm/PingPong">See it on GitHub ↗</a></>
                : <>Booting a Java virtual machine…</>}
            </div>
          )}
        </div>
      </div>
      <div className="pp-pad pp-pad-left" aria-label="Left player">
        <button type="button" aria-label="Left paddle up (W)" {...pad('w')}>▲</button>
        <button type="button" aria-label="Left paddle down (S)" {...pad('s')}>▼</button>
      </div>
      <div className="pp-pad pp-pad-right" aria-label="Right player">
        <button type="button" aria-label="Right paddle up (O)" {...pad('o')}>▲</button>
        <button type="button" aria-label="Right paddle down (L)" {...pad('l')}>▼</button>
      </div>
      <button type="button" className="pp-serve" {...pad('Enter')}>Serve</button>
      <div className="pp-foot">
        <p className="pp-keys"><kbd>W</kbd><kbd>S</kbd> left paddle <span>·</span> <kbd>O</kbd><kbd>L</kbd> right paddle <span>·</span> <kbd>Enter</kbd> serve</p>
        <p className="pp-touch-hint">Tap the menus · hold the arrows · turn your phone for a bigger table</p>
        <p className="pp-credit">Runs on <a href="https://cheerpj.com/">CheerpJ</a> · <a href="https://github.com/Aleedm/PingPong">Source ↗</a></p>
      </div>
    </dialog>
  );
}
