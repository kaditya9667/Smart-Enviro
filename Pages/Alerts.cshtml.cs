using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SmartEnviro.Pages
{
    public class AlertsModel : PageModel
    {
        public void OnGet()
        {
            ViewData["Title"] = "Alerts & Notifications";
            ViewData["ActivePage"] = "Alerts";
        }
    }
}
