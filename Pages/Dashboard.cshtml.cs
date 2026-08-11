using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;

namespace SmartEnviro.Pages
{
    public class DashboardModel : PageModel
    {
        public void OnGet()
        {
            ViewData["Title"] = "Environmental Overview";
            ViewData["ActivePage"] = "Dashboard";
        }
    }
}
