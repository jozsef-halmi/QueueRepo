
interface IQueueHubProxy {
    client: IQueueClient;
    server: IQueueServer;
}

interface IQueueClient {
    //userChanged(user: Consensus.PokerUser);
    onRegisterComplete(sessionId: string, numberAhead: Number);
    allowEntrance();
    notifyClient(numberAhead: Number);
   
}

interface IQueueServer {
    registerSession(name: string): void;
    heartBeat(): void;
    knock(sessionId: string): void;

   
    //joinRoom(room: Consensus.PokerRoom): JQueryPromise;
    //leaveRoom(room: Consensus.PokerRoom, user: Consensus.PokerUser): JQueryPromise;

    //resetRoom(room: Consensus.PokerRoom): JQueryPromise;
    //showAllCards(room: Consensus.PokerRoom, show: boolean): JQueryPromise;
    //changeRoomTopic(room: Consensus.PokerRoom, topic: string): JQueryPromise;
    //changedCard(room: Consensus.PokerRoom, value: string): JQueryPromise;
}