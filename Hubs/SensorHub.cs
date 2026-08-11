using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace SmartEnviro.Hubs
{
    public class CityRegistration
    {
        public string City { get; set; } = string.Empty;
        public string? Token { get; set; }
        public string? DisplayName { get; set; }
        public string? Endpoint { get; set; }
        public string? Type { get; set; }
    }

    public class SensorHub : Hub
    {
        // Thread-safe registry mapping connection IDs to their active cities
        public static readonly ConcurrentDictionary<string, List<CityRegistration>> ClientCities = new();

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            ClientCities.TryRemove(Context.ConnectionId, out _);
            return base.OnDisconnectedAsync(exception);
        }

        public void RegisterCities(List<CityRegistration> cities)
        {
            if (cities != null)
            {
                ClientCities[Context.ConnectionId] = cities;
            }
        }
    }
}
