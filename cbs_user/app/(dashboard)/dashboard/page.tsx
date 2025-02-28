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
import AuthService from '@/lib/services/auth.service';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

// Zod schema for Booking
const BookingSchema = z.object({
  id: z.string(),
  userId: z.string().optional(),
  serviceType: z.string(),
  date: z.string(),
  time: z.string(),
  status: z.string(),
  paymentStatus: z.string(),
  meetlink: z.string().nullable(),
  amount: z.number(),
  currency: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  user: z.object({
    name: z.string(),
    email: z.string()
  }).optional()
});

// Type inference from the schema
type Booking = z.infer<typeof BookingSchema>;

interface EditBookingData {
  serviceType: string;
  date: string;
  time: string;
}

interface DialogState {
  isOpen: boolean;
  type: 'edit' | 'delete' | null;
  bookingId: string | null;
  currentData?: EditBookingData;
}

// Add these interfaces after the Booking type
interface PaymentRequest {
  order_id: string;
  order_amount: number;
  order_currency: string;
  customer_details: {
    customer_id: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
  };
}

interface PaymentResponse {
  success: boolean;
  message?: string;
  redirect_url?: string;
}

interface ApiResponse {
  success: boolean;
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// Add this interface after ApiResponse
interface EditResponse {
  success: boolean;
  message?: string;
  booking?: Booking;
}

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
  const [dialogState, setDialogState] = useState<DialogState>({
    isOpen: false,
    type: null,
    bookingId: null,
    currentData: undefined
  });
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (user) {
    fetchBookings();
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(fetchBookings, 30000);
    return () => clearInterval(interval);
    }
  }, [user]);

  const fetchBookings = async () => {
    try {
      setError(null);
      setIsLoading(true);
      
      if (!user) {
        setError('Please log in to view your bookings');
        return;
      }

      const endpoint = user.role === 'admin' ? '/api/admin/bookings' : '/api/bookings/my';
      console.log('Fetching bookings from:', endpoint);
      
      const response = await api.get<ApiResponse>(endpoint);
      console.log('API Response:', response);
      
      if (response && response.success) {
        setBookings(response.bookings || []);
        if (response.pagination) {
          setCurrentPage(response.pagination.page);
        }
      } else {
        throw new Error('Failed to fetch bookings');
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
      const message = error instanceof Error ? error.message : 'Failed to fetch bookings';
      setError(message);
      toast.error(message);
      
      // Clear bookings on error
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = async (bookingId: string, data: EditBookingData) => {
    try {
      setIsProcessing(true);
      
      // Validate date is not in the past
      const selectedDate = new Date(data.date);
      if (selectedDate < new Date()) {
        toast.error('Cannot select a past date');
        return;
      }

      const response = await api.patch<EditResponse>(`/api/bookings/${bookingId}`, data);
      
      if (response.success) {
        toast.success('Booking updated successfully');
        await fetchBookings();
        setDialogState(prev => ({ ...prev, isOpen: false }));
      } else {
        throw new Error(response.message || 'Failed to update booking');
      }
    } catch (error) {
      console.error('Edit error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to update booking');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (bookingId: string) => {
    try {
      setIsProcessing(true);
      
      // Find the booking
      const booking = bookings.find(b => b.id === bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Check if deletion is allowed
      if (booking.paymentStatus.toLowerCase() === 'success') {
        toast.error('Cannot delete a booking with successful payment');
        return;
      }

      const response = await api.delete<EditResponse>(`/api/bookings/${bookingId}`);
      
      if (response.success) {
        toast.success('Booking deleted successfully');
        await fetchBookings();
        setDialogState(prev => ({ ...prev, isOpen: false }));
      } else {
        throw new Error(response.message || 'Failed to delete booking');
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to delete booking');
    } finally {
      setIsProcessing(false);
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
      return (statusFilter === "all" || booking.status === statusFilter) &&
        (booking.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
         booking.serviceType.toLowerCase().includes(searchTerm.toLowerCase()));
    })
    .sort((a: Booking, b: Booking) => {
      if (sortField === "bookedAt") {
        return isAscending 
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      return 0;
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

  const handlePaymentCompletion = async (booking: Booking) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      // First verify the payment status
      const verifyResponse = await api.get<{ success: boolean; verified: boolean; message?: string }>(`/api/payments/verify/${booking.id}`);
      
      if (!verifyResponse) {
        throw new Error('No response received from server');
      }

      if (verifyResponse.verified) {
        toast.success('Payment verified successfully');
        await fetchBookings(); // Refresh the bookings list after successful verification
        return;
      }

      // If payment is not verified, initiate new payment
      const paymentRequest: PaymentRequest = {
        order_id: booking.id,
        order_amount: booking.amount,
        order_currency: booking.currency,
        customer_details: {
          customer_id: user.id,
          customer_name: user.name || '',
          customer_email: user.email || '',
          customer_phone: user.phone || '',
        }
      };

      const response = await api.post<PaymentResponse>('/api/payments/create', paymentRequest);
      
      if (!response) {
        throw new Error('No response received from server');
      }

      if (response.success && response.redirect_url) {
        toast.success('Payment initiated successfully');
        window.location.href = response.redirect_url;
      } else {
        throw new Error(response.message || 'Payment initiation failed');
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to process payment');
    } finally {
      setIsLoading(false);
    }
  };

  const renderDialog = () => {
    if (!dialogState.isOpen) return null;

    if (dialogState.type === 'edit') {
      return (
        <Dialog open={dialogState.isOpen} onOpenChange={(open) => setDialogState(prev => ({ ...prev, isOpen: open }))}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit Booking</DialogTitle>
              <DialogDescription>
                Update your booking details. Please note that you can only select future dates.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <label htmlFor="service">Service Type</label>
                <Select
                  value={dialogState.currentData?.serviceType}
                  onValueChange={(value) => 
                    setDialogState(prev => ({
                      ...prev,
                      currentData: { ...prev.currentData!, serviceType: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Capital Gains (Real Estate)">Capital Gains (Real Estate)</SelectItem>
                    <SelectItem value="Capital Gains (Securities)">Capital Gains (Securities)</SelectItem>
                    <SelectItem value="Salary / House Rent / Pension">Salary / House Rent / Pension</SelectItem>
                    <SelectItem value="Cryptocurrency">Cryptocurrency</SelectItem>
                    <SelectItem value="Business Owners / Professionals">Business Owners / Professionals</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <label>Date & Time</label>
                <Calendar
                  mode="single"
                  selected={dialogState.currentData?.date ? new Date(dialogState.currentData.date) : undefined}
                  onSelect={(date) => 
                    setDialogState(prev => ({
                      ...prev,
                      currentData: { ...prev.currentData!, date: date ? format(date, 'yyyy-MM-dd') : '' }
                    }))
                  }
                  disabled={(date) => date < new Date()}
                />
                <Select
                  value={dialogState.currentData?.time}
                  onValueChange={(value) => 
                    setDialogState(prev => ({
                      ...prev,
                      currentData: { ...prev.currentData!, time: value }
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                    <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                    <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                    <SelectItem value="02:00 PM">02:00 PM</SelectItem>
                    <SelectItem value="03:00 PM">03:00 PM</SelectItem>
                    <SelectItem value="04:00 PM">04:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                onClick={() => dialogState.bookingId && dialogState.currentData && 
                  handleEdit(dialogState.bookingId, dialogState.currentData)}
                disabled={isProcessing}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    if (dialogState.type === 'delete') {
      return (
        <Dialog open={dialogState.isOpen} onOpenChange={(open) => setDialogState(prev => ({ ...prev, isOpen: open }))}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Delete Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this booking? This action cannot be undone.
                {bookings.find(b => b.id === dialogState.bookingId)?.paymentStatus.toLowerCase() === 'success' && (
                  <p className="text-red-500 mt-2">
                    Warning: You cannot delete a booking with successful payment.
                  </p>
                )}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDialogState(prev => ({ ...prev, isOpen: false }))}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => dialogState.bookingId && handleDelete(dialogState.bookingId)}
                disabled={isProcessing || 
                  bookings.find(b => b.id === dialogState.bookingId)?.paymentStatus.toLowerCase() === 'success'}
              >
                {isProcessing ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Delete Booking
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      );
    }

    return null;
  };

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
                    <TableHead className="text-gray-600 dark:text-gray-400">Service</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Meeting Time</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Payment Status</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-600 dark:text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={user?.role === 'admin' ? 7 : 6} className="text-center">
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
                        <TableCell className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{booking.serviceType}</p>
                            <p className="text-sm text-gray-500">{booking.currency} {booking.amount}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">
                              {new Date(booking.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-500">{booking.time}</p>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.paymentStatus)}`}>
                            {booking.paymentStatus}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 px-4">
                          <div className="flex items-center gap-2 justify-end">
                            {booking.meetlink && booking.paymentStatus.toLowerCase() === 'success' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                onClick={() => window.open(booking.meetlink!, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-1" />
                                Join Meeting
                              </Button>
                            )}
                            {booking.paymentStatus.toLowerCase() === 'pending' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-yellow-600 dark:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20"
                                onClick={() => handlePaymentCompletion(booking)}
                                disabled={isLoading}
                              >
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                                Complete Payment
                              </Button>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setDialogState({
                                isOpen: true,
                                type: 'edit',
                                bookingId: booking.id,
                                currentData: {
                                  serviceType: booking.serviceType,
                                  date: booking.date,
                                  time: booking.time
                                }
                              })}
                              className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setDialogState({
                                isOpen: true,
                                type: 'delete',
                                bookingId: booking.id
                              })}
                              className="bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
                              disabled={booking.paymentStatus.toLowerCase() === 'success'}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
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
      {renderDialog()}
    </>
  );
} 