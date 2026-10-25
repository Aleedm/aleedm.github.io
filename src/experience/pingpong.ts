// PingPong is the original Java 8 / Swing game running on CheerpJ, inside
// public/pingpong/play.html. Each opening gets a fresh frame, and with it a fresh JVM.

export const PINGPONG_FRAME = '/pingpong/play.html';

// Touch controls exist (PingPongConsole, play.html), but the JVM lags badly on iPhone,
// so touch devices get a note instead of the game. Return true here to bring them back.
export const canPlayPingPong = () => !window.matchMedia('(pointer: coarse)').matches;

export const openPingPong = () => window.dispatchEvent(new Event('pingpong:open'));
