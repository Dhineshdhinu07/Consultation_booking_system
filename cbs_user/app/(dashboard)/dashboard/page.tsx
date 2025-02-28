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
import { api } from '@/lib/utils/api';
import { toast } from 'sonner';
import { Loader2, ExternalLink, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Zod schema for Booking
const BookingSchema = z.object({
  id: z.string(),
  userId: z.string(),
  date: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  paymentId: z.string(),
  meetlink: z.string().nullable(),
  createdAt: z.string().nullable(),
  updatedAt: z.string().nullable(),
  user: z.object({
    name: z.string(),
    email: z.string()
  }).optional()
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

export default function Dashboard() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<"bookedAt" | "amount">("bookedAt");
  const [isAscending, setIsAscending] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBookings();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!user) {
        setError('Please log in to view your bookings');
        return;
      }

      const endpoint = user.role === 'admin' ? '/admin/bookings' : '/bookings/my';
      console.log('User role:', user.role);
      console.log('Fetching bookings from:', endpoint);
      
      const response = await api.get(endpoint);
      console.log('Raw API response:', response);
      
      // Handle the response based on its structure
      let bookingsData: Booking[] = [];
      
      if (response) {
        if (Array.isArray(response)) {
          bookingsData = response;
        } else if (typeof response === 'object') {
          if (Array.isArray((response as any).bookings)) {
            bookingsData = (response as any).bookings;
          } else if (Array.isArray((response as any).data)) {
            bookingsData = (response as any).data;
          } else if (Array.isArray((response as any).data?.bookings)) {
            bookingsData = (response as any).data.bookings;
          }
        }
      }

      console.log('Processed bookings data:', bookingsData);
      setBookings(bookingsData);
      console.log('Bookings state after update:', bookingsData);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const endpoint = user?.role === 'admin' ? `/admin/bookings/${id}` : `/bookings/${id}`;
      await api.delete(endpoint);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const handleStatusChange = async (id: string, newStatus: "Cancelled") => {
    try {
      const endpoint = user?.role === 'admin' ? `/admin/bookings/${id}` : `/bookings/${id}`;
      await api.patch(endpoint, { status: newStatus });
      toast.success('Booking status updated');
      fetchBookings();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return 'text-green-500 bg-green-50 dark:bg-green-900/20';
      case 'cancelled':
        return 'text-red-500 bg-red-50 dark:bg-red-900/20';
      case 'pending':
        return 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
      default:
        return 'text-gray-500 bg-gray-50 dark:bg-gray-900/20';
    }
  };

  const filteredBookings = bookings
    .filter((booking: Booking) => {
      console.log('Filtering booking:', booking);
      return (statusFilter === "all" || booking.status === statusFilter) &&
        ((booking.paymentId && booking.paymentId.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.date && booking.date.includes(searchTerm)));
    })
    .sort((a: Booking, b: Booking) => {
      if (sortField === "bookedAt") {
        return isAscending 
          ? new Date(a.date).getTime() - new Date(b.date).getTime()
          : new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return isAscending
        ? 0  // Remove amount sorting since it's not in our data structure
        : 0;
    });

  console.log('Filtered bookings:', filteredBookings);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  console.log('Total pages:', totalPages);
  console.log('Current page:', currentPage);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Error Loading Bookings</h3>
          <p className="text-gray-600 dark:text-gray-400">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

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
                    {user?.role === 'admin' && (
                      <TableHead className="text-gray-600 dark:text-gray-400">User</TableHead>
                    )}
                    <TableHead className="text-gray-600 dark:text-gray-400">Booking ID</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Payment Status</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Booked At</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Meeting</TableHead>
                    <TableHead className="text-right text-gray-600 dark:text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center">
                        <p className="text-gray-600 dark:text-gray-400">No bookings found.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedBookings.map((booking) => (
                      <motion.tr
                        key={booking.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                      >
                        {user?.role === 'admin' && (
                          <TableCell className="py-3 px-4">
                            <div>
                              <p className="font-medium text-gray-900 dark:text-white">{booking.user?.name}</p>
                              <p className="text-sm text-gray-500 dark:text-gray-400">{booking.user?.email}</p>
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                          {booking.paymentId}
                        </TableCell>
                        <TableCell className="py-3 px-4 text-gray-900 dark:text-white">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4 text-gray-900 dark:text-white">
                          {new Date(booking.date).toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          {booking.meetlink && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-blue-600 dark:text-blue-400"
                              onClick={() => {
                                const url = booking.meetlink;
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              <ExternalLink className="h-4 w-4 mr-1" />
                              Join
                            </Button>
                          )}
                          {!booking.meetlink && (
                            <span className="text-gray-500 dark:text-gray-400">N/A</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {booking.status !== 'Cancelled' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleStatusChange(booking.id, 'Cancelled')}
                              >
                                Cancel
                              </Button>
                            )}
                            {user?.role === 'admin' && (
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDelete(booking.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Pagination */}
              <div className="flex justify-between items-center mt-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing {currentPage * ITEMS_PER_PAGE - ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredBookings.length)} of {filteredBookings.length} results
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