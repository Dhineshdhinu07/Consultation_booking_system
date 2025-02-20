'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { FileUpload } from "@/components/ui/file-upload"
import { BackgroundBeams } from "@/components/ui/background-beams"

const formSchema = z.object({
  name: z.string().min(4, {
    message: "Name must be at least 4 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  date: z.date({
    required_error: "A date is required for the consultation.",
  }),
  files: z.array(z.custom<File>()).optional().default([]),
})

export default function BookingForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      date: undefined,
      files: [],
    },
  })
 
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <section className="relative bg-gray-950 w-full min-h-screen flex justify-center items-center text-white p-4">
      {/* Background layer */}
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>

      {/* Content layer */}
      <div className="relative z-10 w-full max-w-5xl space-y-8 rounded-xl border bg-gray-950/50 border-gray-800 p-6 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold">Book Consultation</h1>
          <p className="text-gray-400">Fill in the details to schedule your consultation.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Name" 
                          {...field} 
                          className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700  h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your Email" 
                          {...field} 
                          className="border-gray-800 text-white bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700 h-12 [-webkit-autofill]:shadow-[inset_0_0_0px_1000px_rgb(0,0,0,0)] [-webkit-autofill]:text-white" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="mb-2">Consultation Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full h-12 pl-3 text-left font-normal border-gray-800 bg-transparent hover:bg-transparent hover:text-white hover:border-gray-700",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span className="text-gray-400">Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription className="text-gray-400">
                        Select your preferred consultation date.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="files"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Documents</FormLabel>
                      <FormControl>
                        <FileUpload
                          onChange={(files) => field.onChange(files)}
                        />
                      </FormControl>
                      <FormDescription className="text-gray-400">
                        Upload any relevant documents (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex flex-col gap-4 pt-4">
                  <Button type="submit" className="w-full bg-white text-black hover:text-white">
                    Book Consultation
                  </Button>
                  <Link href="/" className="w-full">
                    <Button type="button" className="w-full bg-white text-black hover:text-white">
                      Back to Home
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </section>
  )
}