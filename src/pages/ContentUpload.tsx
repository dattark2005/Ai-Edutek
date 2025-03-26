import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Upload, FileText, Video, Image, BookOpen } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export default function ContentUpload() {
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg'],
      'video/*': ['.mp4', '.mov'],
      'application/pdf': ['.pdf'],
    },
    maxFiles: 5,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Upload Content</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* File Upload Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Upload Files</h2>
          <div
            {...getRootProps()}
            className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-secondary/50 transition-colors"
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="mt-2 font-medium">Drag & drop files here</p>
            <p className="text-sm text-muted-foreground">
              Supports: PDF, Images, Videos (max 5 files)
            </p>
            <Button className="mt-4" variant="outline">
              Select Files
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <FileText className="h-5 w-5 text-blue-500" />
              <span>Lecture_1.pdf</span>
              <span className="ml-auto text-sm text-muted-foreground">2.4 MB</span>
            </div>
            <div className="flex items-center gap-2 p-3 border rounded-lg">
              <Video className="h-5 w-5 text-red-500" />
              <span>Introduction.mp4</span>
              <span className="ml-auto text-sm text-muted-foreground">45.2 MB</span>
            </div>
          </div>
        </div>

        {/* Content Details Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Content Details</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" placeholder="Enter content title" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" placeholder="Enter content description" rows={4} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="course">Course</Label>
              <select
                id="course"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select a course</option>
                <option value="math101">Mathematics 101</option>
                <option value="cs101">Computer Science 101</option>
                <option value="physics101">Physics 101</option>
              </select>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Button>
                <BookOpen className="mr-2 h-4 w-4" />
                Publish Content
              </Button>
              <Button variant="outline">Save Draft</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
