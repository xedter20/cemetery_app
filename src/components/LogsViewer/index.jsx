import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button
} from '@mui/material';
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "../../lib/utils"
import { Button as ShadButton } from "../../components/ui/button"
import { Calendar } from "../../components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Input } from "../../components/ui/input"

export default function LogsViewer() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    startDate: null,
    endDate: null,
    userEmail: '',
    action: ''
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/logs');
        setLogs(response.data.data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  const filteredLogs = React.useMemo(() => {
    return logs.filter(log => {
      const matchesEmail = log.USER_EMAIL?.toLowerCase().includes(filters.userEmail.toLowerCase());
      const matchesAction = log.ACTION?.toLowerCase().includes(filters.action.toLowerCase());
      const logDate = new Date(log.CREATED_AT);

      const matchesStartDate = !filters.startDate || logDate >= filters.startDate;
      const matchesEndDate = !filters.endDate || logDate <= filters.endDate;

      return matchesEmail && matchesAction && matchesStartDate && matchesEndDate;
    });
  }, [logs, filters]);

  const sortedLogs = React.useMemo(() => {
    if (!sortConfig.key) return filteredLogs;

    return [...filteredLogs].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'asc' ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredLogs, sortConfig]);

  const paginatedLogs = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedLogs.slice(start, start + pageSize);
  }, [sortedLogs, currentPage, pageSize]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Start Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <ShadButton
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.startDate ? format(filters.startDate, "PPP") : <span>Pick a date</span>}
              </ShadButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.startDate}
                onSelect={(date) => handleFilterChange('startDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">End Date</label>
          <Popover>
            <PopoverTrigger asChild>
              <ShadButton
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !filters.endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.endDate ? format(filters.endDate, "PPP") : <span>Pick a date</span>}
              </ShadButton>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={filters.endDate}
                onSelect={(date) => handleFilterChange('endDate', date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">User Email</label>
          <Input
            placeholder="Filter by email..."
            value={filters.userEmail}
            onChange={(e) => handleFilterChange('userEmail', e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex flex-col space-y-2">
          <label className="text-sm font-medium">Action</label>
          <Input
            placeholder="Filter by action..."
            value={filters.action}
            onChange={(e) => handleFilterChange('action', e.target.value)}
            className="w-full"
          />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Select
          value={pageSize.toString()}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2">
          <ShadButton
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </ShadButton>
          <span className="text-sm">
            Page {currentPage}
          </span>
          <ShadButton
            variant="outline"
            onClick={() => setCurrentPage(prev => prev + 1)}
            disabled={paginatedLogs.length < pageSize}
          >
            Next
          </ShadButton>
        </div>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell onClick={() => handleSort('CREATED_AT')}>Date/Time</TableCell>
              <TableCell onClick={() => handleSort('USER_EMAIL')}>User</TableCell>
              <TableCell onClick={() => handleSort('USER_ROLE')}>Role</TableCell>
              <TableCell onClick={() => handleSort('ACTION')}>Action</TableCell>
              <TableCell onClick={() => handleSort('DETAILS')}>Details</TableCell>
              <TableCell onClick={() => handleSort('IP_ADDRESS')}>IP Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedLogs.map((log) => (
              <TableRow key={log.LOG_ID}>
                <TableCell>{new Date(log.CREATED_AT).toLocaleString()}</TableCell>
                <TableCell>{log.USER_EMAIL}</TableCell>
                <TableCell>{log.USER_ROLE || 'N/A'}</TableCell>
                <TableCell>{log.ACTION}</TableCell>
                <TableCell>{log.DETAILS}</TableCell>
                <TableCell>{log.IP_ADDRESS}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}; 