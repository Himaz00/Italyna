// Made by Ayham Zedan
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Search, ArrowLeft, UtensilsCrossed } from "lucide-react";

// NotFound page: Displays a 404 error and navigation options for invalid routes.
const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // useEffect: Logs 404 errors to the console for debugging.
  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  // List of popular pages to help users navigate back to main sections.
  const popularPages = [
    { name: "Home", path: "/", icon: Home },
    { name: "Menu", path: "/#menu", icon: UtensilsCrossed },
    { name: "Reservations", path: "/#reservations", icon: Search },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>

      <div className="max-w-2xl w-full relative z-10">
        <Card className="border-0 shadow-2xl bg-card/80 backdrop-blur-lg">
          <CardContent className="p-12 text-center">
            {/* 404 Animation */}
            <div className="mb-8">
              <div className="text-8xl md:text-9xl font-bold text-primary/20 mb-4 animate-pulse">
                404
              </div>
              <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center animate-bounce">
                <UtensilsCrossed className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Error Message */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Oops! Page Not Found
              </h1>
              <p className="text-lg text-muted-foreground mb-2">
                The page you're looking for seems to have wandered off the menu.
              </p>
              <p className="text-sm text-muted-foreground">
                Requested path: <code className="bg-muted px-2 py-1 rounded text-foreground">{location.pathname}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Button 
                onClick={() => navigate(-1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Go Back
              </Button>
              <Button 
                onClick={() => navigate('/')}
                className="flex items-center gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              >
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </div>

            {/* Popular Pages */}
            <div className="border-t border-border pt-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                Popular Pages
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {popularPages.map((page) => {
                  const Icon = page.icon;
                  return (
                    <Button
                      key={page.name}
                      variant="ghost"
                      onClick={() => {
                        if (page.path.startsWith('/#')) {
                          navigate('/');
                          setTimeout(() => {
                            const element = document.getElementById(page.path.slice(2));
                            element?.scrollIntoView({ behavior: 'smooth' });
                          }, 100);
                        } else {
                          navigate(page.path);
                        }
                      }}
                      className="flex items-center gap-2 hover:bg-primary/10 hover:text-primary transition-all duration-200"
                    >
                      <Icon className="h-4 w-4" />
                      {page.name}
                    </Button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NotFound;
