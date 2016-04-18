using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace QueueControl.SignalR.Model
{
    public class Client
    {
        public string Id { get; set; }
        public string Name { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime LastHeartbeat { get; set; }

        public int Number { get; set; }

        public string SessionId { get; set; }

    }
}
