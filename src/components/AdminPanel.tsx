import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Users,
  CreditCard,
  Image as ImageIcon,
  BarChart2,
  Settings,
  Download,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface User {
  id: string;
  name: string;
  email: string;
  plan: string;
  credits: number;
  imagesGenerated: number;
  joinDate: string;
  lastActive: string;
}

interface Transaction {
  id: string;
  userId: string;
  userName: string;
  plan: string;
  amount: number;
  status: "completed" | "pending" | "failed";
  date: string;
  paymentMethod: string;
}

interface AdminPanelProps {
  theme?: "light" | "dark" | "evening" | "luxury" | "neon";
}

const AdminPanel = ({ theme = "dark" }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // Mock data for dashboard
  const dashboardStats = {
    totalUsers: 1248,
    activeUsers: 876,
    totalRevenue: 45890,
    totalImages: 28750,
    conversionRate: 8.2,
    averageSessionTime: 12.5,
  };

  const revenueData = [
    { name: "Jan", revenue: 4000 },
    { name: "Feb", revenue: 5000 },
    { name: "Mar", revenue: 3800 },
    { name: "Apr", revenue: 6000 },
    { name: "May", revenue: 5500 },
    { name: "Jun", revenue: 7000 },
    { name: "Jul", revenue: 8500 },
    { name: "Aug", revenue: 7800 },
    { name: "Sep", revenue: 9000 },
    { name: "Oct", revenue: 10500 },
    { name: "Nov", revenue: 11000 },
    { name: "Dec", revenue: 12500 },
  ];

  const planDistribution = [
    { name: "Free", value: 650, color: "#8884d8" },
    { name: "Basic", value: 320, color: "#82ca9d" },
    { name: "Standard", value: 180, color: "#ffc658" },
    { name: "Premium", value: 98, color: "#ff8042" },
  ];

  const imageGenerationData = [
    { name: "Mon", images: 1200 },
    { name: "Tue", images: 1500 },
    { name: "Wed", images: 1800 },
    { name: "Thu", images: 1600 },
    { name: "Fri", images: 2000 },
    { name: "Sat", images: 2400 },
    { name: "Sun", images: 1900 },
  ];

  // Generate mock users
  useEffect(() => {
    const mockUsers: User[] = [];
    const plans = ["Free", "Basic", "Standard", "Premium"];

    for (let i = 1; i <= 50; i++) {
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const credits =
        plan === "Free"
          ? Math.floor(Math.random() * 30)
          : plan === "Basic"
            ? Math.floor(Math.random() * 100)
            : plan === "Standard"
              ? Math.floor(Math.random() * 175)
              : Math.floor(Math.random() * 250);

      mockUsers.push({
        id: `user-${i}`,
        name: `User ${i}`,
        email: `user${i}@example.com`,
        plan,
        credits,
        imagesGenerated: Math.floor(Math.random() * 500),
        joinDate: new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        lastActive: new Date(
          Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
      });
    }

    setUsers(mockUsers);

    // Generate mock transactions
    const mockTransactions: Transaction[] = [];
    const statuses: ("completed" | "pending" | "failed")[] = [
      "completed",
      "pending",
      "failed",
    ];
    const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking"];

    for (let i = 1; i <= 50; i++) {
      const user = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const plan = plans[Math.floor(Math.random() * plans.length)];
      const amount =
        plan === "Free"
          ? 0
          : plan === "Basic"
            ? 59
            : plan === "Standard"
              ? 199
              : 299;

      mockTransactions.push({
        id: `txn-${i}`,
        userId: user.id,
        userName: user.name,
        plan,
        amount,
        status: statuses[Math.floor(Math.random() * statuses.length)],
        date: new Date(
          Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000,
        )
          .toISOString()
          .split("T")[0],
        paymentMethod:
          paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      });
    }

    setTransactions(mockTransactions);
    setIsLoading(false);
  }, []);

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Filter transactions based on search query
  const filteredTransactions = transactions.filter(
    (transaction) =>
      transaction.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getBackgroundColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-900";
      case "evening":
        return "bg-indigo-900/90";
      case "luxury":
        return "bg-gradient-to-br from-gray-900 to-gray-800";
      case "neon":
        return "bg-black";
      default:
        return "bg-white";
    }
  };

  const getTextColor = () => {
    switch (theme) {
      case "dark":
      case "evening":
      case "luxury":
      case "neon":
        return "text-white";
      default:
        return "text-gray-900";
    }
  };

  const getCardBgColor = () => {
    switch (theme) {
      case "dark":
        return "bg-gray-800 border-gray-700";
      case "evening":
        return "bg-indigo-800/80 border-indigo-700";
      case "luxury":
        return "bg-gray-800 border-amber-600/50";
      case "neon":
        return "bg-gray-900 border-pink-500/50";
      default:
        return "bg-white border-gray-200";
    }
  };

  const getMutedTextColor = () => {
    switch (theme) {
      case "dark":
        return "text-gray-400";
      case "evening":
        return "text-indigo-200";
      case "luxury":
        return "text-amber-200";
      case "neon":
        return "text-pink-300";
      default:
        return "text-gray-500";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-500";
      case "pending":
        return "text-yellow-500";
      case "failed":
        return "text-red-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className={`min-h-screen ${getBackgroundColor()} ${getTextColor()}`}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search..."
                className="pl-10 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Data
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-8 w-full justify-start">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart2 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Users
            </TabsTrigger>
            <TabsTrigger
              value="transactions"
              className="flex items-center gap-2"
            >
              <CreditCard className="h-4 w-4" />
              Transactions
            </TabsTrigger>
            <TabsTrigger value="images" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Images
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className={getCardBgColor()}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        {dashboardStats.totalUsers}
                      </p>
                      <p className={`${getMutedTextColor()} text-sm`}>
                        +12% from last month
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-blue-500/20">
                      <Users className="h-6 w-6 text-blue-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={getCardBgColor()}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        ₹{dashboardStats.totalRevenue}
                      </p>
                      <p className={`${getMutedTextColor()} text-sm`}>
                        +8.5% from last month
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-green-500/20">
                      <CreditCard className="h-6 w-6 text-green-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className={getCardBgColor()}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Images Generated</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-3xl font-bold">
                        {dashboardStats.totalImages}
                      </p>
                      <p className={`${getMutedTextColor()} text-sm`}>
                        +15% from last month
                      </p>
                    </div>
                    <div className="p-3 rounded-full bg-purple-500/20">
                      <ImageIcon className="h-6 w-6 text-purple-500" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Card className={getCardBgColor()}>
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription className={getMutedTextColor()}>
                    Monthly revenue for the current year
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={revenueData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis dataKey="name" stroke="#888" />
                        <YAxis stroke="#888" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#333",
                            border: "none",
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [`₹${value}`, "Revenue"]}
                        />
                        <Legend />
                        <Bar dataKey="revenue" fill="#3b82f6" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              <Card className={getCardBgColor()}>
                <CardHeader>
                  <CardTitle>Plan Distribution</CardTitle>
                  <CardDescription className={getMutedTextColor()}>
                    User distribution across plans
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={planDistribution}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) =>
                            `${name}: ${(percent * 100).toFixed(0)}%`
                          }
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {planDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "#333",
                            border: "none",
                          }}
                          itemStyle={{ color: "#fff" }}
                          formatter={(value) => [value, "Users"]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className={getCardBgColor()}>
              <CardHeader>
                <CardTitle>Image Generation Trends</CardTitle>
                <CardDescription className={getMutedTextColor()}>
                  Daily image generation for the current week
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={imageGenerationData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                      <XAxis dataKey="name" stroke="#888" />
                      <YAxis stroke="#888" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#333",
                          border: "none",
                        }}
                        itemStyle={{ color: "#fff" }}
                      />
                      <Legend />
                      <Bar
                        dataKey="images"
                        fill="#8b5cf6"
                        name="Images Generated"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className={getCardBgColor()}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>User Management</CardTitle>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Filter className="h-4 w-4" />
                          Filter
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Filter by Plan</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>All Plans</DropdownMenuItem>
                        <DropdownMenuItem>Free</DropdownMenuItem>
                        <DropdownMenuItem>Basic</DropdownMenuItem>
                        <DropdownMenuItem>Standard</DropdownMenuItem>
                        <DropdownMenuItem>Premium</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Add User
                    </Button>
                  </div>
                </div>
                <CardDescription className={getMutedTextColor()}>
                  Manage and monitor user accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Credits</TableHead>
                        <TableHead>Images Generated</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Last Active</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">
                              {user.name}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${user.plan === "Premium" ? "bg-purple-500/20 text-purple-500" : user.plan === "Standard" ? "bg-blue-500/20 text-blue-500" : user.plan === "Basic" ? "bg-green-500/20 text-green-500" : "bg-gray-500/20 text-gray-500"}`}
                              >
                                {user.plan}
                              </span>
                            </TableCell>
                            <TableCell>{user.credits}</TableCell>
                            <TableCell>{user.imagesGenerated}</TableCell>
                            <TableCell>{user.joinDate}</TableCell>
                            <TableCell>{user.lastActive}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Edit User</DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Add Credits
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-500">
                                    Delete User
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No users found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className={getMutedTextColor()}>
                  Showing {filteredUsers.length} of {users.length} users
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600 text-white"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="transactions">
            <Card className={getCardBgColor()}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Transaction History</CardTitle>
                  <div className="flex items-center space-x-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          className="flex items-center gap-2"
                        >
                          <Calendar className="h-4 w-4" />
                          Date Range
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Select Range</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Today</DropdownMenuItem>
                        <DropdownMenuItem>Last 7 Days</DropdownMenuItem>
                        <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                        <DropdownMenuItem>Last 90 Days</DropdownMenuItem>
                        <DropdownMenuItem>Custom Range</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <Button className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </div>
                </div>
                <CardDescription className={getMutedTextColor()}>
                  View and manage payment transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>User</TableHead>
                        <TableHead>Plan</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Payment Method</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.length > 0 ? (
                        filteredTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">
                              {transaction.id}
                            </TableCell>
                            <TableCell>{transaction.userName}</TableCell>
                            <TableCell>{transaction.plan}</TableCell>
                            <TableCell>₹{transaction.amount}</TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${getStatusColor(transaction.status)} ${transaction.status === "completed" ? "bg-green-500/20" : transaction.status === "pending" ? "bg-yellow-500/20" : "bg-red-500/20"}`}
                              >
                                {transaction.status.charAt(0).toUpperCase() +
                                  transaction.status.slice(1)}
                              </span>
                            </TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>{transaction.paymentMethod}</TableCell>
                            <TableCell>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    Actions
                                    <ChevronDown className="h-4 w-4 ml-1" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    Send Receipt
                                  </DropdownMenuItem>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem>Refund</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            No transactions found matching your search criteria
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
              <CardFooter className="flex justify-between">
                <div className={getMutedTextColor()}>
                  Showing {filteredTransactions.length} of {transactions.length}{" "}
                  transactions
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" disabled>
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-600 text-white"
                  >
                    1
                  </Button>
                  <Button variant="outline" size="sm">
                    2
                  </Button>
                  <Button variant="outline" size="sm">
                    3
                  </Button>
                  <Button variant="outline" size="sm">
                    Next
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="images">
            <Card className={getCardBgColor()}>
              <CardHeader>
                <CardTitle>Generated Images</CardTitle>
                <CardDescription className={getMutedTextColor()}>
                  Browse and manage all generated images
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 12 }).map((_, index) => (
                    <div
                      key={index}
                      className="relative group overflow-hidden rounded-lg"
                    >
                      <img
                        src={`https://picsum.photos/seed/${index + 1}/300/300`}
                        alt={`Generated image ${index + 1}`}
                        className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/20 backdrop-blur-sm text-white"
                          >
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            className="bg-white/20 backdrop-blur-sm text-white"
                          >
                            Download
                          </Button>
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs">
                        <p className="truncate">
                          User {Math.floor(Math.random() * 50) + 1}
                        </p>
                        <p className="text-gray-300 text-xs">
                          {new Date(
                            Date.now() -
                              Math.floor(Math.random() * 30) *
                                24 *
                                60 *
                                60 *
                                1000,
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button>Load More</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className={getCardBgColor()}>
              <CardHeader>
                <CardTitle>Admin Settings</CardTitle>
                <CardDescription className={getMutedTextColor()}>
                  Configure system settings and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      API Configuration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="razorpay_key">Razorpay API Key</Label>
                        <Input
                          id="razorpay_key"
                          value="rzp_test_YourRazorpayKeyHere"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="razorpay_secret">
                          Razorpay Secret Key
                        </Label>
                        <Input
                          id="razorpay_secret"
                          type="password"
                          value="••••••••••••••••"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">
                      Image Generation Settings
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max_resolution">
                          Maximum Resolution
                        </Label>
                        <Input id="max_resolution" value="2048x2048" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="default_model">Default AI Model</Label>
                        <Input id="default_model" value="stable-diffusion-xl" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Plan Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="free_credits">Free Plan Credits</Label>
                        <Input id="free_credits" type="number" value="30" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="basic_price">
                          Basic Plan Price (₹)
                        </Label>
                        <Input id="basic_price" type="number" value="59" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Email Settings</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtp_server">SMTP Server</Label>
                        <Input id="smtp_server" value="smtp.example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email_from">From Email</Label>
                        <Input id="email_from" value="noreply@aiimages.com" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end space-x-4">
                <Button variant="outline">Cancel</Button>
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;
