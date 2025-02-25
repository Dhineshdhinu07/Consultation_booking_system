"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { FiSearch, FiFilter, FiTrash2, FiUser, FiHome, FiLogOut, FiGrid } from "react-icons/fi";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { useAuth } from "@/hooks/useAuth";
import FloatingNav from "@/components/ui/floating-navbar";
import { z } from "zod";

// Zod schema for Booking
const BookingSchema = z.object({
  id: z.number(),
  date: z.string(),
  time: z.string(),
  type: z.string(),
  status: z.enum(["Completed", "Upcoming", "Cancelled"])
});

// Type inference from the schema
type Booking = z.infer<typeof BookingSchema>;

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
    name: "Book Now",
    alternateText: "Book Now",
    link: "/booking",
    icon: <FiUser className="h-4 w-4" />,
  },    
  {
    name: "Dashboard",
    alternateText: "Dashboard",
    link: "/dashboard",
    icon: <FiGrid className="h-4 w-4" />,
  },
  {
    name: "Logout",
    alternateText: "Logout",
    link: "/",
    icon: <FiLogOut className="h-4 w-4" />,
  },
];

const ITEMS_PER_PAGE = 10;

// Mock data for development - validate with Zod schema
const mockBookings = [
  {
    id: 1,
    date: "2024-03-20",
    time: "10:00 AM",
    type: "General Consultation",
    status: "Upcoming"
  },
  {
    id: 2,
    date: "2024-03-19",
    time: "2:30 PM",
    type: "Follow-up",
    status: "Completed"
  },
  {
    id: 3,
    date: "2024-03-18",
    time: "11:00 AM",
    type: "Emergency",
    status: "Cancelled"
  },
  {
    id: 4,
    date: "2024-03-17",
    time: "9:00 AM",
    type: "Follow-up",
    status: "Upcoming"
  },
  {
    id: 5,
    date: "2024-03-16",
    time: "10:00 AM",
    type: "General Consultation",
    status: "Upcoming"
  },
  {
    id: 6,
    date: "2024-03-15",
    time: "11:00 AM",
    type: "Emergency",
    status: "Cancelled"
  }
] as const;

// Validate mock data
const validatedMockBookings = mockBookings.map(booking => BookingSchema.parse(booking));

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<"date" | "type">("date");
  const [currentPage, setCurrentPage] = useState(1);
  const [isAscending, setIsAscending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Validate data before setting state
        const validatedBookings = validatedMockBookings;
        setBookings(validatedBookings);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load bookings");
        console.error("Error loading bookings:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  // Filter and sort bookings
  const filteredAndSortedBookings = React.useMemo(() => {
    return bookings
      .filter((booking: Booking) => 
        (statusFilter === "all" || booking.status === statusFilter) &&
        (booking.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.date.includes(searchTerm))
      )
      .sort((a: Booking, b: Booking) => {
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
      setBookings((prev: Booking[]) => prev.filter(booking => booking.id !== id));
    }
  };

  const handleStatusChange = async (id: number, newStatus: "Cancelled") => {
    setBookings((prev: Booking[]) => 
      prev.map(booking => 
        booking.id === id ? { ...booking, status: newStatus } : booking
      )
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900 to-black px-4 py-8 text-gray-200">
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent mix-blend-overlay backdrop-blur-[1px]" />
      
      <div 
        className="absolute inset-0 opacity-20 backdrop-blur-sm"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%239C92AC' fill-opacity='0.4' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0">
        <BackgroundBeams />
      </div>

      <div className="relative z-10 container mx-auto space-y-6 px-4 py-14">
      <FloatingNav navItems={navItems} />
        
        {/* Profile Section */}
        <Card className="bg-gray-950/50 border-gray-800 text-white backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gray-800 flex items-center justify-center">
                <FiUser className="h-8 w-8 text-gray-400" />
              </div>
              <div>
                <CardTitle className="text-2xl">{user?.name || 'User'}</CardTitle>
                <CardDescription className="text-gray-400">{user?.email || 'user@example.com'}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-black/20 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Total Bookings</h3>
                <p className="text-2xl font-bold">{bookings.length}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Upcoming</h3>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === "Upcoming").length}</p>
              </div>
              <div className="bg-black/20 rounded-lg p-4 border border-gray-800">
                <h3 className="text-sm font-medium text-gray-400">Completed</h3>
                <p className="text-2xl font-bold">{bookings.filter(b => b.status === "Completed").length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Table Card */}
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
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
                    <SelectItem value="all" className="text-gray-400">All Status</SelectItem>
                    <SelectItem value="Completed" className="text-gray-400">Completed</SelectItem>
                    <SelectItem value="Upcoming" className="text-gray-400">Upcoming</SelectItem>
                    <SelectItem value="Cancelled" className="text-gray-400">Cancelled</SelectItem>
                  </SelectContent>
                </Select>

                {/* Sort */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-800 bg-transparent text-white">
                      <FiFilter className="mr-2" /> Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-950 border-gray-800 text-gray-400">
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
            {error ? (
              <div className="text-center py-8">
                <p className="text-red-400">{error}</p>
                <Button 
                  variant="outline" 
                  className="mt-4 border-gray-800 bg-transparent text-white"
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </Button>
              </div>
            ) : loading ? (
              // Skeleton loading
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center space-x-4 py-4">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[80px]" />
                  <Skeleton className="h-4 w-[150px]" />
                  <Skeleton className="h-6 w-[100px]" />
                </div>
              ))
            ) : bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-400">No bookings found</p>
              </div>
            ) : (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-800 hover:bg-transparent">
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Time</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Status</TableHead>
                      <TableHead className="text-gray-400">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.map((booking: Booking) => (
                      <TableRow key={booking.id} className="border-gray-800 hover:bg-transparent">
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
                                  className="bg-transparent border-gray-800 hover:bg-red-500/20 hover:text-red-400"
                                  onClick={() => handleStatusChange(booking.id, "Cancelled")}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="bg-transparent text-red-400 hover:bg-red-500/20 hover:text-red-400"
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
                      onClick={() => setCurrentPage((prev: number) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-800 bg-transparent text-white"
                    >
                      Previous
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage((prev: number) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-800 bg-transparent text-white"
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
} 