declare namespace Application.Storage {
    export interface IQueueStorage extends angular.storage.ILocalStorageService {
        sessionId: string;
        email: string;

    }
}



