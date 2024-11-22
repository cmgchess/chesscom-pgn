export interface Game {
    areFriends?: boolean;
    canSendTrophy: boolean;
    changesPlayersRating: number;
    colorOfWinner: string;
    daysPerTurn?: number;
    drawOffered?: boolean;
    hasAlert?: boolean;
    id: number;
    uuid?: string;
    initialSetup: string;
    isLiveGame?: boolean;
    isAbortable: boolean;
    isAnalyzable: boolean;
    isChatEnabled?: boolean;
    chatStatus?: string;
    isCheckmate: boolean;
    isStalemate: boolean;
    isFinished: boolean;
    isRated: boolean;
    isResignable: boolean;
    lastMove: string;
    moveList: string;
    plyCount: number;
    ratingChangeWhite?: number;
    ratingChangeBlack?: number;
    gameEndReason: string;
    resultMessage: string;
    startTime?: number;
    endTime: number;
    turnColor: string;
    type: string;
    typeName: string;
    allowVacation?: boolean;
    pgnHeaders: PgnHeaders;
    moveTimestamps?: string;
    baseTime1?: number;
    timeIncrement1?: number;
}

export interface Player {
    uuid: string;
    isContentHidden: boolean;
    id: number;
    isComputer: boolean;
    avatarUrl: string;
    countryId: number;
    isEnabled: boolean;
    canWinOnTime: boolean;
    chessTitle?: string;
    color: string;
    countryName: string;
    defaultTab: number;
    hasMovedAtLeastOnce: boolean;
    isDrawable: boolean;
    isOnline: boolean;
    isInLivechess?: boolean;
    isTouchMove: boolean;
    isVacation?: boolean;
    isWhiteOnBottom: boolean;
    lastLoginDate: number;
    location: string;
    membershipLevel: number;
    membershipCode: string;
    memberSince: number;
    offeredDraw?: boolean;
    postMoveAction: string;
    rating: number;
    turnTimeRemaining?: string;
    flairCode?: string;
    flair?: Flair;
    username: string;
    vacationRemaining?: string;
    gamesInProgress: number;
    friendRequestSent: boolean;
    friendRequestReceived: boolean;
    isBlocked: boolean;
    isFriend: boolean;
}

export interface PgnHeaders {
    Event: string;
    Site: string;
    Date: string;
    White: string;
    Black: string;
    Result: string;
    ECO: string;
    WhiteElo: number;
    BlackElo: number;
    TimeControl: string;
    EndDate?: string;
    EndTime?: string;
    Termination: string;
    SetUp: string;
    FEN: string;
}

export interface Flair {
    id: string;
    images: {
        png: string;
        svg: string;
        lottie: string;
    };
}

export interface ChessComGame {
    game: Game;
    players: {
        top: Player;
        bottom: Player;
    };
}
