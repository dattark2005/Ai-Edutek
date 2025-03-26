import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Search, PlusCircle, Mail, Shield } from 'lucide-react';

export default function StudentManagement() {
  // Sample student data
  const students = [
    { id: 1, name: 'Alice Johnson', email: 'alice@example.com', progress: 85, lastActive: '2 days ago' },
    { id: 2, name: 'Bob Smith', email: 'bob@example.com', progress: 72, lastActive: '1 day ago' },
    { id: 3, name: 'Charlie Brown', email: 'charlie@example.com', progress: 68, lastActive: '5 hours ago' },
    { id: 4, name: 'Diana Prince', email: 'diana@example.com', progress: 91, lastActive: '1 week ago' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Student Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search students..." className="pl-10" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-32 rounded-full bg-secondary">
                      <div 
                        className={`h-2 rounded-full ${
                          student.progress > 80 ? 'bg-green-500' : 
                          student.progress > 60 ? 'bg-blue-500' : 'bg-yellow-500'
                        }`}
                        style={{ width: `${student.progress}%` }}
                      />
                    </div>
                    <span>{student.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>{student.lastActive}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm">
                      <Mail className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" size="sm">
                      <Shield className="h-4 w-4 mr-2" />
                      Manage
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button variant="outline">Previous</Button>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  );
}