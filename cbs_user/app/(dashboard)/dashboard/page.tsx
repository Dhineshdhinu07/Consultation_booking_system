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
import { useAuth } from "@/components/auth-provider";
import FloatingNav from "@/components/ui/floating-navbar";
import { z } from "zod";
import Navbar from "@/components/Navbar";
import Link from "next/link";

// Zod schema for Booking
const BookingSchema = z.object({
  id: z.number(),
  date: z.string(),
  time: z.string(),
  type: z.string(),
  status: z.enum(["Completed", "Upcoming", "Cancelled"]),
  link: z.string().optional()
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
    status: "Upcoming",
    link: "https://meet.zoho.com/ABC123xyz"
  },
  {
    id: 2,
    date: "2024-03-19",
    time: "2:30 PM",
    type: "Follow-up",
    status: "Completed",
    link: "https://meet.zoho.com/DEF456uvw"
  },
  {
    id: 3,
    date: "2024-03-18",
    time: "11:00 AM",
    type: "Emergency",
    status: "Cancelled",
    link: "https://meet.zoho.com/GHI789rst"
  },
  {
    id: 4,
    date: "2024-03-17",
    time: "9:00 AM",
    type: "Follow-up",
    status: "Upcoming",
    link: "https://meet.zoho.com/JKL012mno"
  },
  {
    id: 5,
    date: "2024-03-16",
    time: "10:00 AM",
    type: "General Consultation",
    status: "Upcoming",
    link: "https://meet.zoho.com/MNO345pqr"
  },
  {
    id: 6,
    date: "2024-03-15",
    time: "11:00 AM",
    type: "Emergency",
    status: "Cancelled",
    link: "https://meet.zoho.com/PQR678stu"
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Upcoming":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-white dark:from-gray-950 dark:to-gray-900 pt-20 px-10">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-grid-[#007BFF]/5 dark:bg-grid-[#007BFF]/10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] pointer-events-none" />
        
        <div className="container mx-auto px-4 relative">
          <div className="mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your consultations and appointments
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search consultations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-[#007BFF] focus:border-transparent dark:text-gray-100"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Upcoming">Upcoming</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Table */}
          <Card className="bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-gray-100 dark:border-gray-800">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Recent Consultations</CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">View and manage your consultation history</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-200 dark:border-gray-800">
                    <TableHead className="text-gray-600 dark:text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Time</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Link</TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    // Loading skeletons
                    Array.from({ length: 5 }).map((_, index) => (
                      <TableRow key={index} className="border-gray-200 dark:border-gray-800">
                        {Array.from({ length: 6 }).map((_, cellIndex) => (
                          <TableCell key={cellIndex}>
                            <Skeleton className="h-6 w-full dark:bg-gray-800" />
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    paginatedBookings.map((booking) => (
                      <TableRow key={booking.id} className="border-gray-200 dark:border-gray-800">
                        <TableCell className="text-gray-900 dark:text-gray-100">{booking.date}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{booking.time}</TableCell>
                        <TableCell className="text-gray-900 dark:text-gray-100">{booking.type}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(booking.status)}>
                            {booking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {booking.status === "Upcoming" ? (
                            <Button
                              asChild
                              variant="link"
                              className="text-[#007BFF] dark:text-[#60A5FA] hover:text-[#0056b3] dark:hover:text-[#3B82F6] p-0 h-auto font-normal"
                            >
                              <Link 
                                href={booking.link || "#"}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1"
                              >
                                Join Meeting
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                  />
                                </svg>
                              </Link>
                            </Button>
                          ) : (
                            <span className="text-gray-500 dark:text-gray-400">
                              {booking.status === "Completed" ? "Meeting Ended" : "Not Available"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
                                Actions
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
                              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">View Details</DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">Reschedule</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800">
                                Cancel
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredAndSortedBookings.length)} of {filteredAndSortedBookings.length} results
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="border-gray-200 dark:border-gray-700 hover:bg-[#007BFF] hover:text-white dark:text-gray-300 dark:hover:text-white"
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="border-gray-200 dark:border-gray-700 hover:bg-[#007BFF] hover:text-white dark:text-gray-300 dark:hover:text-white"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
} 