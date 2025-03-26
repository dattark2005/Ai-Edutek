import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { PlusCircle, Calendar, FileText, Edit, Trash2, ClipboardCheck } from 'lucide-react';

export default function AssignmentManagement() {
  // Sample assignment data
  const assignments = [
    { id: 1, title: 'Algebra Homework', course: 'Math 101', dueDate: '2023-12-15', submissions: 24, status: 'active' },
    { id: 2, title: 'Programming Project', course: 'CS 101', dueDate: '2023-12-20', submissions: 18, status: 'active' },
    { id: 3, title: 'Physics Lab Report', course: 'Physics 101', dueDate: '2023-11-30', submissions: 30, status: 'graded' },
    { id: 4, title: 'History Essay', course: 'History 101', dueDate: '2024-01-10', submissions: 5, status: 'draft' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Assignment Management</h1>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Assignment
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Submissions</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.map((assignment) => (
              <TableRow key={assignment.id}>
                <TableCell className="font-medium">{assignment.title}</TableCell>
                <TableCell>{assignment.course}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    {assignment.dueDate}
                  </div>
                </TableCell>
                <TableCell>{assignment.submissions}</TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    assignment.status === 'active' ? 'bg-green-100 text-green-800' :
                    assignment.status === 'graded' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {assignment.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    {assignment.status === 'active' && (
                      <Button variant="outline" size="sm">
                        <ClipboardCheck className="h-4 w-4 mr-2" />
                        Grade
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing 1 to {assignments.length} of {assignments.length} assignments
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline">Previous</Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  );
}