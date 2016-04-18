using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;
using QueueControl.SignalR.Model;
using QueueControl.SignalR.BusinessLogic;

namespace QueueControl.SignalR.SignalR
{
    public class QueueHub : Hub
    {


        public QueueHub()
        {
            Queue.Instance.setHub(this);
        }

        public void RegisterSession(string name)
        {
            Console.WriteLine("RegisterSession, "+name);
            // Generate a GUID for the client
            //Guid g = Guid.NewGuid();
            
            if (Queue.Instance.AllowedClients.FirstOrDefault(c => c.Id == Context.ConnectionId) != null)
            {
                // Client is already allowed to join
            }
            else if (Queue.Instance.WaitingClients.FirstOrDefault(c => c.Id == Context.ConnectionId) != null)
            {
                // Client is already waiting to in the queue
            }
            else
            {
                var client = new Client()
                {
                    Id = Context.ConnectionId,
                    Name = name,
                    StartDate = DateTime.Now,
                    LastHeartbeat = DateTime.Now,
                    SessionId = Guid.NewGuid().ToString()
                };
                // Add to queue
                int number = Queue.Instance.RegisterClient(client);

                // Notify the client of the success
                Console.WriteLine("Notifying client, numberAhead: " + number);
                Clients.Caller.onRegisterComplete(client.SessionId,number);
            }
            

            //Clients.All.broadcastMessage(name, message);
        }

        public void HeartBeat()
        {
            Queue.Instance.UpdateHeartbeat(Context.ConnectionId);
        }

        public void LetClientIn(Client c)
        {
            Clients.Client(c.Id).allowEntrance();
        }

        public bool KnockAt(string sessionId)
        {
            return Queue.Instance.IsAllowedToJoin(sessionId);
            
        }

        /// <summary>
        /// Notify the waiting clients about their number in the line
        /// </summary>
        /// <param name="waitingClients"></param>
        public void NotifyClients(List<Client> waitingClients)
        {
            foreach (var waitingClient in waitingClients)
            {
                Clients.Client(waitingClient.Id).notifyClient(waitingClient.Number);
            }
        }

    }
}
