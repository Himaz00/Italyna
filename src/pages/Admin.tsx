// Made by Ayham Zedan
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Calendar, 
  UtensilsCrossed, 
  Settings, 
  Bell,
  ArrowLeft,
  Plus,
  Eye,
  Edit,
  Trash2,
  LogOut,
  TrendingUp,
  Clock,
  CheckCircle
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import MenuManagement from '@/components/admin/MenuManagement';
import ReservationManagement from '@/components/admin/ReservationManagement';
import NotificationCenter from '@/components/admin/NotificationCenter';

// Admin page: Main admin dashboard for managing menu, reservations, and notifications.
const Admin = () => {
  const navigate = useNavigate(); // Navigation hook
  const [activeTab, setActiveTab] = useState('overview'); // Tracks active tab
  const { user, isAdmin, loading, signOut } = useAuth(); // Auth context
  const { toast } = useToast(); // Toast notifications

  // useEffect: Redirects non-admin users away from the admin page
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      toast({
        title: "Access Denied",
        description: "You need admin privileges to access this page.",
        variant: "destructive"
      });
      navigate('/admin/login');
    }
  }, [user, isAdmin, loading, navigate, toast]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed Out",
      description: "You have been signed out successfully."
    });
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Modern Header with Glass Effect */}
      <div className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center gap-2 hover:bg-slate-100 transition-all duration-200"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Website
              </Button>
              <div className="h-6 w-px bg-slate-200" />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <UtensilsCrossed className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
                  Italyna Admin
                </h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full">
                Welcome, {user.email?.split('@')[0]}
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-all duration-200"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-sm border-0 p-1 rounded-xl">
            <TabsTrigger 
              value="overview" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200"
            >
              <Settings className="h-4 w-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger 
              value="menu" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200"
            >
              <UtensilsCrossed className="h-4 w-4" />
              Menu
            </TabsTrigger>
            <TabsTrigger 
              value="reservations" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200"
            >
              <Calendar className="h-4 w-4" />
              Reservations
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-orange-500 data-[state=active]:text-white transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
              Notifications
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8 animate-fade-in">
            {/* Stats Cards */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-blue-900">
                    Total Reservations
                  </CardTitle>
                  <div className="p-2 bg-blue-200 rounded-lg">
                    <Calendar className="h-4 w-4 text-blue-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-900">24</div>
                  <div className="flex items-center text-xs text-blue-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +12% from last month
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-emerald-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-emerald-900">
                    Menu Items
                  </CardTitle>
                  <div className="p-2 bg-emerald-200 rounded-lg">
                    <UtensilsCrossed className="h-4 w-4 text-emerald-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-900">13</div>
                  <p className="text-xs text-emerald-600 mt-1">
                    Across 5 categories
                  </p>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-purple-900">
                    Today's Bookings
                  </CardTitle>
                  <div className="p-2 bg-purple-200 rounded-lg">
                    <Users className="h-4 w-4 text-purple-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-purple-900">8</div>
                  <div className="flex items-center text-xs text-purple-600 mt-1">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +2 from yesterday
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-amber-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-amber-900">
                    Pending Reviews
                  </CardTitle>
                  <div className="p-2 bg-amber-200 rounded-lg">
                    <Bell className="h-4 w-4 text-amber-700" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-900">3</div>
                  <p className="text-xs text-amber-600 mt-1">
                    Require attention
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
              {/* Recent Reservations */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-slate-600" />
                    Recent Reservations
                  </CardTitle>
                  <CardDescription>
                    Latest booking requests and confirmations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: 'John Smith', date: '2024-01-15', time: '19:00', guests: 4, status: 'confirmed' },
                      { name: 'Sarah Johnson', date: '2024-01-15', time: '20:30', guests: 2, status: 'pending' },
                      { name: 'Mike Brown', date: '2024-01-16', time: '18:00', guests: 6, status: 'confirmed' },
                    ].map((reservation, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors duration-200">
                        <div>
                          <p className="font-medium text-slate-900">{reservation.name}</p>
                          <p className="text-sm text-slate-600">
                            {reservation.date} at {reservation.time} • {reservation.guests} guests
                          </p>
                        </div>
                        <Badge 
                          variant={reservation.status === 'confirmed' ? 'default' : 'secondary'}
                          className={reservation.status === 'confirmed' ? 'bg-green-100 text-green-800 border-green-200' : ''}
                        >
                          {reservation.status === 'confirmed' && <CheckCircle className="h-3 w-3 mr-1" />}
                          {reservation.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5 text-slate-600" />
                    Quick Actions
                  </CardTitle>
                  <CardDescription>
                    Common administrative tasks
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-amber-50 hover:border-amber-200 hover:text-amber-700 transition-all duration-200"
                      onClick={() => setActiveTab('menu')}
                    >
                      <Plus className="h-4 w-4 mr-3" />
                      Add New Menu Item
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 transition-all duration-200"
                      onClick={() => setActiveTab('reservations')}
                    >
                      <Eye className="h-4 w-4 mr-3" />
                      View All Reservations
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 hover:bg-purple-50 hover:border-purple-200 hover:text-purple-700 transition-all duration-200"
                      onClick={() => setActiveTab('notifications')}
                    >
                      <Bell className="h-4 w-4 mr-3" />
                      Send Notification
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="menu" className="animate-fade-in">
            <MenuManagement />
          </TabsContent>

          <TabsContent value="reservations" className="animate-fade-in">
            <ReservationManagement />
          </TabsContent>

          <TabsContent value="notifications" className="animate-fade-in">
            <NotificationCenter />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
