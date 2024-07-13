import {
  chunkString,
  decodeTCNtoUCI,
  getGameById,
  getMoveTimes,
  getPgnFromUCI,
} from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  { params }: { params: { round: string } }
) {
  const url = new URL(req.url);
  const showTimestamp =
    url.searchParams.get('timestamp')?.toLowerCase() === 'true';

  const game = await getGameById(params.round);
  const moveList = chunkString(game.game.moveList, 2);
  const decodedMoveList = moveList.map((move) => decodeTCNtoUCI(move));
  let moveTimes: number[] = [];
  if (showTimestamp) {
    moveTimes = getMoveTimes(
      game.game.moveTimestamps,
      game.game.timeIncrement1,
      game.game.baseTime1
    );
  }

  const pgn = getPgnFromUCI(decodedMoveList, game.game.pgnHeaders, moveTimes);
  const response = new NextResponse(pgn);
  response.headers.set('Content-type', 'text/plain');
  return response;
}
