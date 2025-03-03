"use client"

import { format } from "date-fns"
import { CalendarIcon, Filter } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TransactionFilters({ filters, setFilters }: { filters: any, setFilters: (filters: any) => void }) {
  const [localFilters, setLocalFilters] = useState(filters)

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <div className="grid flex-1 gap-2">
        <Label htmlFor="search">Search</Label>
        <Input
          id="search"
          placeholder="Search transactions..."
          className="h-9"
          value={localFilters.search}
          onChange={(e) => setLocalFilters({ ...localFilters, search: e.target.value })}
        />
      </div>

      <div className="grid gap-2">
        <Label>Category</Label>
        <Select value={localFilters.category} onValueChange={(val: string) => setLocalFilters({ ...localFilters, category: val })}>

          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="housing">Housing</SelectItem>
            <SelectItem value="transportation">Transportation</SelectItem>
            <SelectItem value="utilities">Utilities</SelectItem>
            <SelectItem value="entertainment">Entertainment</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="income">Income</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-2">
        <Label>Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="h-9 w-full justify-start text-left font-normal sm:w-[180px]">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {localFilters.date ? format(localFilters.date, "PPP") : "Pick a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={localFilters.date} onSelect={(date) => setLocalFilters({ ...localFilters, date })} />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid gap-2">
        <Label>Amount</Label>
        <Select value={localFilters.amount} onValueChange={(val: string) => setLocalFilters({ ...localFilters, amount: val })}>

          <SelectTrigger className="h-9 w-full sm:w-[180px]">
            <SelectValue placeholder="Any Amount" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any Amount</SelectItem>
            <SelectItem value="less-50">Less than $50</SelectItem>
            <SelectItem value="50-100">$50 - $100</SelectItem>
            <SelectItem value="100-500">$100 - $500</SelectItem>
            <SelectItem value="500-plus">$500+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-end">
        <Button variant="outline" size="sm" className="h-9" onClick={() => setFilters(localFilters)}>
          <Filter className="mr-2 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

