import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, BookOpen, GraduationCap, FileText, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import AdminLayout from '../../components/layout/AdminLayout';
import backend from '~backend/client';
import type { LearningPath } from '~backend/lms/learning_paths';
import type { Course } from '~backend/lms/courses';
import type { Lesson } from '~backend/lms/lessons';

export default function AdminLMSPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('paths');

  const [pathDialogOpen, setPathDialogOpen] = useState(false);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [lessonDialogOpen, setLessonDialogOpen] = useState(false);

  const [editingPath, setEditingPath] = useState<LearningPath | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);

  const { data: pathsData } = useQuery({
    queryKey: ['lms-paths'],
    queryFn: () => backend.lms.listPaths(),
  });

  const { data: coursesData } = useQuery({
    queryKey: ['lms-courses'],
    queryFn: () => backend.lms.listCourses(),
  });

  const { data: lessonsData } = useQuery({
    queryKey: ['lms-lessons'],
    queryFn: () => backend.lms.listLessons(),
  });

  const createPathMutation = useMutation({
    mutationFn: (data: any) => backend.lms.createPath(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-paths'] });
      setPathDialogOpen(false);
      toast({ title: 'Learning path created successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to create learning path:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updatePathMutation = useMutation({
    mutationFn: (data: any) => backend.lms.updatePath(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-paths'] });
      setPathDialogOpen(false);
      setEditingPath(null);
      toast({ title: 'Learning path updated successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to update learning path:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deletePathMutation = useMutation({
    mutationFn: (id: number) => backend.lms.deletePath({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-paths'] });
      toast({ title: 'Learning path deleted successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to delete learning path:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: (data: any) => backend.lms.createCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-courses'] });
      setCourseDialogOpen(false);
      toast({ title: 'Course created successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to create course:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: (data: any) => backend.lms.updateCourse(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-courses'] });
      setCourseDialogOpen(false);
      setEditingCourse(null);
      toast({ title: 'Course updated successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to update course:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => backend.lms.deleteCourse({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-courses'] });
      toast({ title: 'Course deleted successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to delete course:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const createLessonMutation = useMutation({
    mutationFn: (data: any) => backend.lms.createLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-lessons'] });
      setLessonDialogOpen(false);
      toast({ title: 'Lesson created successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to create lesson:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const updateLessonMutation = useMutation({
    mutationFn: (data: any) => backend.lms.updateLesson(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-lessons'] });
      setLessonDialogOpen(false);
      setEditingLesson(null);
      toast({ title: 'Lesson updated successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to update lesson:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const deleteLessonMutation = useMutation({
    mutationFn: (id: number) => backend.lms.deleteLesson({ id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['lms-lessons'] });
      toast({ title: 'Lesson deleted successfully' });
    },
    onError: (error: Error) => {
      console.error('Failed to delete lesson:', error);
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  const handlePathSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      coverImageUrl: formData.get('coverImageUrl') as string,
      difficultyLevel: formData.get('difficultyLevel') as any,
      estimatedHours: parseInt(formData.get('estimatedHours') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    };

    if (editingPath) {
      updatePathMutation.mutate({ ...data, id: editingPath.id });
    } else {
      createPathMutation.mutate(data);
    }
  };

  const handleCourseSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      coverImageUrl: formData.get('coverImageUrl') as string,
      difficultyLevel: formData.get('difficultyLevel') as any,
      estimatedHours: parseInt(formData.get('estimatedHours') as string) || 0,
      isPublished: formData.get('isPublished') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    };

    if (editingCourse) {
      updateCourseMutation.mutate({ ...data, id: editingCourse.id });
    } else {
      createCourseMutation.mutate(data);
    }
  };

  const handleLessonSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      content: formData.get('content') as string,
      videoUrl: formData.get('videoUrl') as string,
      durationMinutes: parseInt(formData.get('durationMinutes') as string) || 0,
      lessonType: formData.get('lessonType') as any,
      isPublished: formData.get('isPublished') === 'true',
      sortOrder: parseInt(formData.get('sortOrder') as string) || 0,
    };

    if (editingLesson) {
      updateLessonMutation.mutate({ ...data, id: editingLesson.id });
    } else {
      createLessonMutation.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Learning Management System</h1>
            <p className="text-muted-foreground">Manage learning paths, courses, and lessons</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="paths">Learning Paths</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="lessons">Lessons</TabsTrigger>
          </TabsList>

          <TabsContent value="paths" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Learning Paths ({pathsData?.paths.length || 0})</h2>
              <Button onClick={() => { setEditingPath(null); setPathDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Learning Path
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pathsData?.paths.map((path) => (
                <Card key={path.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        {path.isPublished && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingPath(path); setPathDialogOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deletePathMutation.mutate(path.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{path.title}</CardTitle>
                    <CardDescription>{path.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {path.difficultyLevel && (
                        <Badge variant="outline">{path.difficultyLevel}</Badge>
                      )}
                      {path.estimatedHours && (
                        <Badge variant="outline">{path.estimatedHours}h</Badge>
                      )}
                      <Badge variant="secondary">{path.courseCount || 0} courses</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Courses ({coursesData?.courses.length || 0})</h2>
              <Button onClick={() => { setEditingCourse(null); setCourseDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Course
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coursesData?.courses.map((course) => (
                <Card key={course.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-primary" />
                        {course.isPublished && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingCourse(course); setCourseDialogOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteCourseMutation.mutate(course.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{course.title}</CardTitle>
                    <CardDescription>{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {course.difficultyLevel && (
                        <Badge variant="outline">{course.difficultyLevel}</Badge>
                      )}
                      {course.estimatedHours && (
                        <Badge variant="outline">{course.estimatedHours}h</Badge>
                      )}
                      <Badge variant="secondary">{course.lessonCount || 0} lessons</Badge>
                      <Badge variant="secondary">{course.pathCount || 0} paths</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lessons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Lessons ({lessonsData?.lessons.length || 0})</h2>
              <Button onClick={() => { setEditingLesson(null); setLessonDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Add Lesson
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {lessonsData?.lessons.map((lesson) => (
                <Card key={lesson.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <FileText className="w-5 h-5 text-primary" />
                        {lesson.isPublished && <CheckCircle className="w-4 h-4 text-green-500" />}
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => { setEditingLesson(lesson); setLessonDialogOpen(true); }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteLessonMutation.mutate(lesson.id)}
                        >
                          <Trash2 className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                    <CardTitle>{lesson.title}</CardTitle>
                    <CardDescription>{lesson.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline">{lesson.lessonType}</Badge>
                      {lesson.durationMinutes && (
                        <Badge variant="outline">{lesson.durationMinutes} min</Badge>
                      )}
                      <Badge variant="secondary">{lesson.courseCount || 0} courses</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Learning Path Dialog */}
        <Dialog open={pathDialogOpen} onOpenChange={setPathDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPath ? 'Edit Learning Path' : 'Create Learning Path'}</DialogTitle>
              <DialogDescription>
                {editingPath ? 'Update the learning path details' : 'Add a new learning path to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handlePathSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingPath?.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingPath?.description || ''} rows={3} />
                </div>
                <div>
                  <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                  <Input id="coverImageUrl" name="coverImageUrl" defaultValue={editingPath?.coverImageUrl || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                    <Select name="difficultyLevel" defaultValue={editingPath?.difficultyLevel || 'beginner'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input id="estimatedHours" name="estimatedHours" type="number" defaultValue={editingPath?.estimatedHours || 0} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isPublished">Published</Label>
                    <Select name="isPublished" defaultValue={editingPath?.isPublished ? 'true' : 'false'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingPath?.sortOrder || 0} />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setPathDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingPath ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Course Dialog */}
        <Dialog open={courseDialogOpen} onOpenChange={setCourseDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingCourse ? 'Edit Course' : 'Create Course'}</DialogTitle>
              <DialogDescription>
                {editingCourse ? 'Update the course details' : 'Add a new course to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCourseSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingCourse?.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingCourse?.description || ''} rows={3} />
                </div>
                <div>
                  <Label htmlFor="coverImageUrl">Cover Image URL</Label>
                  <Input id="coverImageUrl" name="coverImageUrl" defaultValue={editingCourse?.coverImageUrl || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="difficultyLevel">Difficulty Level</Label>
                    <Select name="difficultyLevel" defaultValue={editingCourse?.difficultyLevel || 'beginner'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="estimatedHours">Estimated Hours</Label>
                    <Input id="estimatedHours" name="estimatedHours" type="number" defaultValue={editingCourse?.estimatedHours || 0} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isPublished">Published</Label>
                    <Select name="isPublished" defaultValue={editingCourse?.isPublished ? 'true' : 'false'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingCourse?.sortOrder || 0} />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setCourseDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingCourse ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Lesson Dialog */}
        <Dialog open={lessonDialogOpen} onOpenChange={setLessonDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLesson ? 'Edit Lesson' : 'Create Lesson'}</DialogTitle>
              <DialogDescription>
                {editingLesson ? 'Update the lesson details' : 'Add a new lesson to the system'}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleLessonSubmit}>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" defaultValue={editingLesson?.title} required />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" name="description" defaultValue={editingLesson?.description || ''} rows={2} />
                </div>
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea id="content" name="content" defaultValue={editingLesson?.content || ''} rows={6} />
                </div>
                <div>
                  <Label htmlFor="videoUrl">Video URL</Label>
                  <Input id="videoUrl" name="videoUrl" defaultValue={editingLesson?.videoUrl || ''} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="lessonType">Type</Label>
                    <Select name="lessonType" defaultValue={editingLesson?.lessonType || 'video'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="video">Video</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="quiz">Quiz</SelectItem>
                        <SelectItem value="exercise">Exercise</SelectItem>
                        <SelectItem value="project">Project</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="durationMinutes">Duration (minutes)</Label>
                    <Input id="durationMinutes" name="durationMinutes" type="number" defaultValue={editingLesson?.durationMinutes || 0} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isPublished">Published</Label>
                    <Select name="isPublished" defaultValue={editingLesson?.isPublished ? 'true' : 'false'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="true">Yes</SelectItem>
                        <SelectItem value="false">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input id="sortOrder" name="sortOrder" type="number" defaultValue={editingLesson?.sortOrder || 0} />
                  </div>
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setLessonDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">{editingLesson ? 'Update' : 'Create'}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
