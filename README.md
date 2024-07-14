
# <span>Chess.com</span> PGN

<span>chess.com</span> uses a format called TCN to encode chess moves. This can be seen from the `moveList` field of the API call:

```
https://www.chess.com/callback/live/game/{gameId}
```
Here is an example of a TCN string:

```
gv2UmC92lBZRbs!Tpx8!cu5QfH6ZegWOHA0KBKRKuI98vMZSMS1SnvQBsmTZIBKBmBZPAS!?SJPJCJ7Jks47BrJAdc8mfnOGcf78rGAIGrIPad2VrBVufmunmn
```

This string is twice the length of the total number of moves (PlyCount), meaning each move is encoded into 2 bytes. In the simplest case, the first byte represents the From Square, and the second byte represents the To Square. This can be converted to UCI format, which provides the standard data fields for each move: {**from, to, drop, promotion**}.

## Resources

- https://www.chess.com/clubs/forum/view/official-chess-com-movelist-pgn-help
- https://github.com/savi2w/chess-tcn/blob/main/tcn.js
