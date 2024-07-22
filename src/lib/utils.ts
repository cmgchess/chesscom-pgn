import { ChessComGame, PgnHeaders } from '@/types/chesscom';
import { Chess } from 'chessops/chess';
import { defaultSetup } from 'chessops/setup';
import { parseFen } from 'chessops/fen';
import { DropMove, NormalMove, Move, ROLES } from 'chessops/types';
import { parseSquare } from 'chessops/util';
import { defaultGame, extend, Game, makePgn, PgnNodeData } from 'chessops/pgn';
import { makeSanAndPlay } from 'chessops/san';

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

export function decodeTCNtoUCI(e: string): Move {
  const pieceChars: number[] = [4, 1, 3, 2, 5, 0];
  const f: Move[] = [];
  let a: number;
  let b: number;
  let c: number;
  for (c = 0; c < e.length; c += 2) {
    const normalMove: NormalMove = {
      from: 0,
      to: 0,
    };
    const dropMove: DropMove = {
      role: ROLES[0],
      to: 0,
    };
    b = T.indexOf(e[c]);
    a = T.indexOf(e[c + 1]);
    if (a > 63) {
      normalMove.promotion = ROLES[pieceChars[Math.floor((a - 64) / 3)]];
      a = b + (16 > b ? -8 : 8) + ((a - 1) % 3) - 1;
    }
    if (b > 75) {
      dropMove.role = ROLES[pieceChars[b - 79]];
      dropMove.to = parseSquare(T[a % 8] + (Math.floor(a / 8) + 1)) ?? 0;
      f.push(dropMove);
    } else {
      normalMove.from = parseSquare(T[b % 8] + (Math.floor(b / 8) + 1)) ?? 0;
      normalMove.to = parseSquare(T[a % 8] + (Math.floor(a / 8) + 1)) ?? 0;
      f.push(normalMove);
    }
  }
  return f[0];
}

export function getPgnFromUCI(
  uci: Move[],
  pgnHeaders: PgnHeaders,
  moveTimes: number[],
  initialSetup: string
): string {
  const headers = Object.entries(pgnHeaders).reduce<Map<string, string>>(
    (acc, [k, v]) => {
      if (!moveTimes.length || k !== 'Termination') acc.set(k, v.toString());
      return acc;
    },
    new Map<string, string>()
  );
  let game: Game<PgnNodeData> = defaultGame(() => headers);
  const setup = initialSetup.trim()
    ? parseFen(initialSetup.trim()).unwrap()
    : defaultSetup();
  const pos = Chess.fromSetup(setup).unwrap();
  const san = uci.map((move, i) => {
    const node: PgnNodeData = { san: makeSanAndPlay(pos, move) };
    if (!moveTimes[i]) return node;
    const termination =
      i === moveTimes.length - 2 ? ` ${pgnHeaders.Termination}` : '';
    node.comments = [`[%emt ${moveTimes[i]}]${termination}`];
    return node;
  });
  extend(game.moves.end(), san);
  return makePgn(game);
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
