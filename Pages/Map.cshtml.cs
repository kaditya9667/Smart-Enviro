using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SmartEnviro.Pages
{
    public class MapModel : PageModel
    {
        public void OnGet()
        {
            ViewData["Title"] = "Sensor Map";
            ViewData["ActivePage"] = "Map";
        }
    }
}
