using SmartEnviro.Services;
using SmartEnviro.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddHttpClient<SensorService>();
builder.Services.AddSignalR();
builder.Services.AddHostedService<SensorDataWorker>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapStaticAssets();
app.MapRazorPages()
   .WithStaticAssets();

app.MapHub<SensorHub>("/sensorHub");

// Minimal API Sensor Proxy Routes
app.MapGet("/api/sensors/feed", async (string city, string token, SensorService sensorService) =>
{
    var result = await sensorService.GetFeedAsync(city, token);
    return Results.Content(result, "application/json");
});

app.MapGet("/api/sensors/bounds", async (string latlng, string token, SensorService sensorService) =>
{
    var result = await sensorService.GetBoundsAsync(latlng, token);
    return Results.Content(result, "application/json");
});

app.MapGet("/api/sensors/local", async (string endpoint, SensorService sensorService) =>
{
    var result = await sensorService.GetLocalDataAsync(endpoint);
    return Results.Content(result, "application/json");
});



app.Run();

