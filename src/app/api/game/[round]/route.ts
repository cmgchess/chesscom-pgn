import {
  chunkString,
  decodeTCNtoUCI,
  getGameById,
  getPgnFromUCI,
} from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function GET(
  _: Request,
  { params }: { params: { round: string } }
) {
  const game = await getGameById(params.round);
  const moveList = chunkString(game.game.moveList, 2);
  const decodedMoveList = moveList.map((move) => decodeTCNtoUCI(move));
  const pgn = getPgnFromUCI(decodedMoveList, game.game.pgnHeaders);
  const response = new NextResponse(pgn);
  response.headers.set('Content-type', 'text/plain');
  return response;
}
