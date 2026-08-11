using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;

namespace SmartEnviro.Services
{
    public class SensorService
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<SensorService> _logger;

        public SensorService(HttpClient httpClient, ILogger<SensorService> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
            // Configure default request headers if needed, e.g. User-Agent
            _httpClient.DefaultRequestHeaders.Add("User-Agent", "SmartEnviroAgent/1.0");
        }

        public async Task<string> GetFeedAsync(string city, string token)
        {
            try
            {
                // URL encode the city/station ID since it might contain coordinates like "geo:lat;lng" or "@id"
                var encodedCity = Uri.EscapeDataString(city);
                var url = $"https://api.waqi.info/feed/{encodedCity}/?token={token}";
                
                _logger.LogInformation("Fetching WAQI feed for {City}", city);
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching WAQI feed for {City}", city);
                return JsonSerializer.Serialize(new { status = "error", data = ex.Message });
            }
        }

        public async Task<string> GetBoundsAsync(string latlng, string token)
        {
            try
            {
                var url = $"https://api.waqi.info/map/bounds/?latlng={latlng}&token={token}";
                
                _logger.LogInformation("Fetching WAQI bounds for {LatLng}", latlng);
                var response = await _httpClient.GetAsync(url);
                response.EnsureSuccessStatusCode();
                
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching WAQI bounds for {LatLng}", latlng);
                return JsonSerializer.Serialize(new { status = "error", data = ex.Message });
            }
        }

        public async Task<string> GetLocalDataAsync(string endpoint)
        {
            try
            {
                _logger.LogInformation("Fetching local sensor data from {Endpoint}", endpoint);
                var response = await _httpClient.GetAsync(endpoint);
                response.EnsureSuccessStatusCode();
                
                return await response.Content.ReadAsStringAsync();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error fetching local sensor data from {Endpoint}", endpoint);
                return JsonSerializer.Serialize(new { status = "error", data = ex.Message });
            }
        }
    }
}
