/// <reference path="../../scripts/typings/signalr/signalr.d.ts" />

module Application.Common.Implementations {
    export class QueueHubProxy implements IQueueHubProxy {
        url: string;
        client: IQueueClient;
        server: IQueueServer;
        constructor(_url: string
            , private $rootScope: ng.IRootScopeService
            , private $sessionStorage: Application.Storage.IQueueStorage) {
            this.url = _url;

            this.client = new QueueClient();
            this.server = new QueueServer(_url, this.client, $rootScope, $sessionStorage);
        }
    }

    class QueueClient implements IQueueClient {
        constructor() {
            
        }
        onRegisterComplete(sessionId: string,numberAhead: Number) {
            console.info('Register. Number ahead: ' + numberAhead)
            
        }

        allowEntrance() {
            console.info('Allow entrance')
        }

        denyEntrance() {
            console.info('Deny entrance')
        }

        notifyClient(numberAhead: Number) {
            console.info('Notify')
        }
    }

    class QueueServer implements IQueueServer {
        url: string;
        connection: SignalR.Hub.Connection;
        hubProxy: SignalR.Hub.Proxy;
        static $inject = ['$rootScope'];
        constructor(_url: string
            , private client: IQueueClient
            , public $rootScope: ng.IRootScopeService
            , private $sessionStorage: Application.Storage.IQueueStorage) {
            this.url = _url;

            this.connect();

            // Register callbacks
            this.hubProxy.on('onRegisterComplete',
                (sessionId,n) => this.client.onRegisterComplete(sessionId,n));

            this.hubProxy.on('allowEntrance', () => this.client.allowEntrance());



            this.hubProxy.on('notifyClient', (n) => this.client.notifyClient(n));


            $rootScope.$on('connected', () => {
                // Test enter
                this.knock(this.$sessionStorage.sessionId);

            });



        }
        registerSession(name: string) {
            this.hubProxy.invoke('RegisterSession', name).done(function (result) {
                console.info('Register Session message sent to QueueHub.')
            }
            ).fail(function (error) {
                console.info('Error registering session.')
            });
        };
        heartBeat() {
            this.hubProxy.invoke('HeartBeat').done(function (result) {
                console.info('HeartBeat sent.')
            }
            ).fail(function (error) {
                console.info('Error sending heartbeat.')
            });
        };

        knock(sessionId: string) {
            if (this.connection.state == 1) {
                var rootScope = this.$rootScope;
                this.hubProxy.invoke('KnockAt', sessionId).done(function (result) {
                    if (result) {
                        rootScope.$broadcast('knock-allow');
                    }
                    else {
                        rootScope.$broadcast('knock-deny');
                    }
                    console.info('Knock result: ' + result)
                }
                ).fail(function (error) {
                    console.info('Error knocking.')
                });
            }
        }


        connect() {
            this.connection = $.hubConnection(url, { useDefaultPath: false });
            this.hubProxy = this.connection.createHubProxy('QueueHub');

            var rootScope = this.$rootScope;

            this.connection.start()
                .done(function () {
                    console.info("Successfully joined to QueueHub");
                    rootScope.$broadcast('connected');
                    //registerSession('Bela');
                })
                .fail(function (error) {
                        console.error('Error connecting to QueueHub.' + error);
                });

        };

       
    }

}
