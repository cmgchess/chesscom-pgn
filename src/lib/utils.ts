import { ChessComGame, PgnHeaders } from '@/types/chesscom';
import { UCI } from '@/types/utility';
import { Chess } from 'chess.js';

export async function getGameById(gameId: string): Promise<ChessComGame> {
  const game = await fetch(
    `https://www.chess.com/callback/live/game/${gameId}`
  );
  return await game.json();
}

export function chunkString(str: string, length: number) {
  return str.match(new RegExp('.{1,' + length + '}', 'g')) || [];
}

const T =
  'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!?{~}(^)[_]@#$,./&-*++=';

export function decodeTCNtoUCI(e: string): UCI {
  let c,
    a,
    g = e.length,
    f = [];
  for (c = 0; c < g; c += 2) {
    const d: UCI = { from: '', to: '' },
      b = T.indexOf(e[c]);
    63 < (a = T.indexOf(e[c + 1])) &&
      ((d.promotion = 'qnrbkp'[Math.floor((a - 64) / 3)]),
      (a = b + (16 > b ? -8 : 8) + ((a - 1) % 3) - 1));
    75 < b
      ? (d.drop = 'qnrbkp'[b - 79])
      : (d.from = T[b % 8] + (Math.floor(b / 8) + 1));
    d.to = T[a % 8] + (Math.floor(a / 8) + 1);
    f.push(d);
  }
  return f[0];
}

export function getPgnFromUCI(
  uci: UCI[],
  pgnHeaders: PgnHeaders,
  moveTimes?: number[]
): string {
  const headers = Object.entries(pgnHeaders).flatMap(([k, v]) => [
    k,
    v.toString(),
  ]);
  const chess = new Chess();
  chess.header(...headers);
  uci.forEach((move, i) => {
    chess.move(move);
    if (moveTimes?.[i]) chess.setComment(`[%emt ${moveTimes[i]}]`);
  });
  return chess.pgn();
}

export function getMoveTimes(
  moveTimestamps: string,
  timeIncrement: number,
  baseTime: number
): number[] {
  const timeList = moveTimestamps.split(',').map(Number);
  const moveTimes = timeList.map((time: number, i: number) => {
    if (i === 0 || i === 1) {
      return (baseTime - time + timeIncrement) / 10 || 0.1;
    } else {
      return (timeList[i - 2] - time + timeIncrement) / 10 || 0.1;
    }
  });
  return moveTimes;
}
