using QueueControl.SignalR.Model;
using QueueControl.SignalR.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Threading;
using System.ComponentModel;

namespace QueueControl.SignalR.BusinessLogic
{
    public class Queue
    {
        private const int CHECK_INTERVAL = 1000;
        private const int DISCONNECT_AFTER = 6000;
        private const int ALLOWED_CONNECTED_CLIENTS = 1;

        public List<Client> WaitingClients = new List<Client>();
        public List<Client> AllowedClients = new List<Client>();

        private static Queue instance;

        private Queue()
        {
            new Thread(() =>
            {
                //Thread.CurrentThread.IsBackground = true;
                /* run your code here */
                while (true)
                {
                    Thread.Sleep(CHECK_INTERVAL);
                    Console.WriteLine("Checking, wait count: " + WaitingClients.Count);
                    var timeoutClients = new List<Client>();

                    foreach (var client in WaitingClients.Union(AllowedClients))
                    {
                        if ((DateTime.Now - client.LastHeartbeat).TotalMilliseconds > DISCONNECT_AFTER)
                        {
                            Console.WriteLine("Remove client from queue: " + client.Id);
                            timeoutClients.Add(
                                WaitingClients.Union(AllowedClients).FirstOrDefault(c => c.Id == client.Id)
                                );
                        }
                    }



                    if (timeoutClients.Count > 0)
                    {
                        Console.WriteLine("Removing " + timeoutClients.Count + " clients.");
                        WaitingClients = WaitingClients.Except(timeoutClients).ToList();
                        AllowedClients = AllowedClients.Except(timeoutClients).ToList();
                    }

                    if (AllowedClients.Count < ALLOWED_CONNECTED_CLIENTS && WaitingClients.Count > 0)
                    {
                        // New client can be let in
                        var client = WaitingClients.First();

                        Console.WriteLine("Letting client "+client.Id+"in.");

                        _Hub.LetClientIn(client);
                        WaitingClients.Remove(client);
                        AllowedClients.Add(client);
                    }


                    // Refresh numbers
                    CalculateWaitingNumbers();
                    _Hub.NotifyClients(WaitingClients);

                }

            }).Start();
        }

        public static Queue Instance
        {
            get
            {
                if (instance == null)
                {
                    instance = new Queue();
                }
                return instance;
            }
        }


        private void CalculateWaitingNumbers()
        {
            int i = 0;
            foreach (var client in WaitingClients)
            {
                if (client.Number != i)
                {
                    Console.WriteLine("Refresh numbers, from "+client.Number+"to "+i+" for "+client.Id);
                }
                client.Number = i;
                ++i;
            }
        }



        public int RegisterClient(Client c)
        {
            WaitingClients.Add(c);
            return WaitingClients.Count - 1;
        }

        public void UpdateHeartbeat(string connectionId)
        {
            var client = AllowedClients.FirstOrDefault(c => c.Id == connectionId) != null ?
                AllowedClients.FirstOrDefault(c => c.Id == connectionId)
                : (WaitingClients.FirstOrDefault(c => c.Id == connectionId) != null ?
                    WaitingClients.FirstOrDefault(c => c.Id == connectionId) : null);

            if (client != null)
            {
                client.LastHeartbeat = DateTime.Now;
                Console.WriteLine("HeartBeat updated for " + connectionId);
            }
        }

        public bool IsAllowedToJoin(string sessionId)
        {
            return (AllowedClients.FirstOrDefault(c => c.SessionId == sessionId) != null);
        }

        #region Reference

        QueueHub _Hub;

        public void setHub(QueueHub hub)
        {
            _Hub = hub;
        }

        #endregion
    }
}
