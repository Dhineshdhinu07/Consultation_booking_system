"use client";

import React, { useState, useEffect } from 'react';
import { FiHome, FiUser, FiLogOut, FiEdit2, FiSearch, FiFilter, FiTrash2 } from "react-icons/fi";
import FloatingNav from "@/components/ui/floating-navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

const navItems = [
  {
    name: "Home",
    alternateText: "Home",
    link: "/",
    icon: <FiHome className="h-4 w-4" />,
  },
  {
    name: "Profile",
    alternateText: "Profile",
    link: "/profile",
    icon: <FiUser className="h-4 w-4" />,
  },
  {
    name: "Logout",
    alternateText: "Logout",
    link: "/",
    icon: <FiLogOut className="h-4 w-4" />,
  },
];

const ITEMS_PER_PAGE = 5;

interface Booking {
  id: number;
  date: string;
  time: string;
  status: "Completed" | "Upcoming" | "Cancelled";
  type: string;
}

// Sample data
const mockBookings: Booking[] = [
  {
    id: 1,
    date: "2024-02-20",
    time: "10:00 AM",
    status: "Completed",
    type: "General Consultation"
  },
  {
    id: 2,
    date: "2024-02-25",
    time: "2:30 PM",
    status: "Upcoming",
    type: "Follow-up"
  },
  {
    id: 3,
    date: "2024-03-01",
    time: "11:00 AM",
    status: "Upcoming",
    type: "General Consultation"
  },
  {
    id: 4,
    date: "2024-01-15",
    time: "3:00 PM",
    status: "Cancelled",
    type: "Emergency"
  },
  // Add more mock data as needed
];

const ProfilePage = () => {
  // State management
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "type">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);

  // Fetch bookings (simulated)
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings(mockBookings);
      setLoading(false);
    };
    fetchBookings();
  }, []);

  // Filter and sort bookings
  const filteredAndSortedBookings = React.useMemo(() => {
    return bookings
      .filter(booking => 
        (statusFilter === "all" || booking.status === statusFilter) &&
        (booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.date.includes(searchTerm))
      )
      .sort((a, b) => {
        if (sortField === "date") {
          return isAscending 
            ? new Date(a.date).getTime() - new Date(b.date).getTime()
            : new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return isAscending
          ? a.type.localeCompare(b.type)
          : b.type.localeCompare(a.type);
      });
  }, [bookings, statusFilter, searchTerm, sortField, isAscending]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredAndSortedBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleDelete = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      setBookings(prev => prev.filter(booking => booking.id !== id));
    }
  };

  const handleStatusChange = async (id: number, newStatus: "Cancelled") => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-24 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay" />
      
      <div 
        className="absolute inset-0 opacity-20"
        // style={{
        //   backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        // }}
      />

      <FloatingNav navItems={navItems} />

      <div className="relative z-10 container mx-auto max-w-6xl space-y-6 overflow-y-auto max-h-[calc(100vh-8rem)] pb-6">
        {/* User Profile Card */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="https://github.com/shadcn.png" alt="User" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">Dhinesh M</CardTitle>
                <CardDescription className="text-gray-400">dhinesh@gmail.com</CardDescription>
              </div>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="bg-transparent border-gray-800 text-white hover:bg-gray-800">
                  <FiEdit2 className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-950 border-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-white">Edit Profile</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-gray-200">Full Name</Label>
                    <Input 
                      defaultValue="Dhinesh M"
                      className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-gray-200">Email</Label>
                    <Input 
                      type="email" 
                      defaultValue="dhinesh@gmail.com"
                      className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
                    />
                  </div>
                  <Button className="w-full bg-white text-gray-900 hover:bg-black hover:text-white border-gray-800">
                    Save Changes
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
        </Card>

        {/* Change Password Card */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription className="text-gray-400">Update your password to keep your account secure</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-200">Current Password</Label>
              <Input 
                type="password" 
                placeholder="Enter current password" 
                className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-gray-200">New Password</Label>
              <Input 
                type="password" 
                placeholder="Enter new password" 
                className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12"
              />
            </div>
            <Button className="bg-white text-gray-900 hover:bg-black hover:text-white border-gray-800">
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Booking History Card */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Booking History</CardTitle>
                <CardDescription className="text-gray-400">View all your consultation bookings</CardDescription>
              </div>
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Input
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-gray-800 text-white bg-transparent"
                  />
                  <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>

                {/* Filter */}
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-gray-800 bg-transparent text-white">
                    <SelectValue placeholder="Filter Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-950 border-gray-800">
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Upcoming">Upcoming</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-800 bg-transparent text-white">
                      <FiFilter className="mr-2" /> Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-950 border-gray-800">
                    <DropdownMenuItem onClick={() => {
                      setSortField("date");
                      setIsAscending(true);
                    }}>
                      Date (Newest)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSortField("date");
                      setIsAscending(false);
                    }}>
                      Date (Oldest)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSortField("type");
                      setIsAscending(true);
                    }}>
                      Type (A-Z)
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => {
                      setSortField("type");
                      setIsAscending(false);
                    }}>
                      Type (Z-A)
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800">
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Time</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-gray-800">
                        <TableCell className="text-gray-200">{booking.date}</TableCell>
                        <TableCell className="text-gray-200">{booking.time}</TableCell>
                        <TableCell className="text-gray-200">{booking.type}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              booking.status === "Completed" ? "secondary" :
                              booking.status === "Upcoming" ? "default" :
                              "destructive"
                            }
                            className={
                              booking.status === "Completed" ? "bg-green-500/20 text-green-400" :
                              booking.status === "Upcoming" ? "bg-blue-500/20 text-blue-400" :
                              "bg-red-500/20 text-red-400"
                            }
                          >
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {booking.status === "Upcoming" && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-gray-800 hover:bg-red-500/20 hover:text-red-400"
                                  onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-red-400 hover:bg-red-500/20 hover:text-red-400"
                                  onClick={() => handleDelete(booking.id)}
                                >
                                  <FiTrash2 />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-400">
                    Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedBookings.length)} of {filteredAndSortedBookings.length} entries
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-800"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-800"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default ProfilePage;