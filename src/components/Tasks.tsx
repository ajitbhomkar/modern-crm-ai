'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCRMStore, type Task } from '@/lib/store';
import { aiService, TaskPriority } from '@/lib/ai-service';
import { formatDate } from '@/lib/utils';
import { 
  Plus, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  Sparkles,
  TrendingUp,
  Zap,
  Target,
  Brain,
  Calendar
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function Tasks() {
  const { tasks, updateTask } = useCRMStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');
  const [taskPriorities, setTaskPriorities] = useState<Map<string, TaskPriority>>(new Map());
  const [analyzing, setAnalyzing] = useState(false);
  const { toast } = useToast();

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  // Auto-analyze tasks on load
  useEffect(() => {
    const analyzeTasks = async () => {
      if (tasks.length > 0 && taskPriorities.size === 0) {
        setAnalyzing(true);
        try {
          const priorities = await aiService.prioritizeTasks(tasks);
          const priorityMap = new Map(priorities.map(p => [p.taskId, p]));
          setTaskPriorities(priorityMap);
        } catch (error) {
          console.error('Failed to analyze tasks:', error);
        } finally {
          setAnalyzing(false);
        }
      }
    };

    analyzeTasks();
  }, [tasks.length]);

  const handleAnalyzePriorities = async () => {
    setAnalyzing(true);
    try {
      const priorities = await aiService.prioritizeTasks(tasks);
      const priorityMap = new Map(priorities.map(p => [p.taskId, p]));
      setTaskPriorities(priorityMap);

      toast({
        title: 'AI Analysis Complete',
        description: `Analyzed ${tasks.length} tasks and optimized priorities`,
      });
    } catch (error) {
      toast({
        title: 'Analysis Failed',
        description: 'Could not analyze tasks. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getAIPriorityColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-red-600';
      case 'medium':
        return 'text-yellow-600';
      case 'low':
        return 'text-green-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in-progress':
        return <Clock className="h-5 w-5 text-blue-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
      default:
        return null;
    }
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  };

  // Sort tasks by AI priority score
  const sortedByAI = [...filteredTasks].sort((a, b) => {
    const priorityA = taskPriorities.get(a.id);
    const priorityB = taskPriorities.get(b.id);
    if (!priorityA || !priorityB) return 0;
    return priorityB.priorityScore - priorityA.priorityScore;
  });

  const highPriorityTasks = tasks.filter(t => {
    const priority = taskPriorities.get(t.id);
    return priority && priority.priorityScore >= 80;
  });

  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Brain className="h-8 w-8 text-purple-600" />
            AI Task Manager
          </h1>
          <p className="text-muted-foreground">Intelligent task prioritization and scheduling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleAnalyzePriorities} disabled={analyzing}>
            {analyzing ? (
              <>
                <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                AI Prioritize
              </>
            )}
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Tasks</CardDescription>
            <CardTitle className="text-2xl">{tasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Across all statuses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>High Priority</CardDescription>
            <CardTitle className="text-2xl text-red-600">{highPriorityTasks.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3" />
              Urgent attention needed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>In Progress</CardDescription>
            <CardTitle className="text-2xl text-blue-600">{inProgressCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Currently active
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl text-green-600">{completedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              {tasks.length > 0 ? `${Math.round((completedCount / tasks.length) * 100)}%` : '0%'} done
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ai-sorted" className="space-y-4">
        <TabsList>
          <TabsTrigger value="ai-sorted">AI Prioritized</TabsTrigger>
          <TabsTrigger value="all">All Tasks</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>

        <TabsContent value="ai-sorted" className="space-y-4">
          {taskPriorities.size === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Sparkles className="h-12 w-12 animate-pulse mx-auto mb-4 text-purple-600" />
                <p className="text-muted-foreground">
                  {analyzing ? 'AI is analyzing your tasks...' : 'Click "AI Prioritize" to optimize task order'}
                </p>
              </CardContent>
            </Card>
          ) : (
            sortedByAI.map((task) => {
              const priority = taskPriorities.get(task.id);
              if (!priority) return null;

              return (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-2">{task.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        <div className={`flex items-center gap-1 ${getAIPriorityColor(priority.priorityScore)}`}>
                          <Sparkles className="h-4 w-4" />
                          <span className="text-sm font-bold">{priority.priorityScore}</span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">AI Urgency Reason</p>
                        <p className="font-medium">{priority.urgencyReason}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Suggested Time</p>
                        <p className="font-medium flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {priority.suggestedTime}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Estimated Impact</p>
                        <p className={`font-medium capitalize ${getImpactColor(priority.estimatedImpact)}`}>
                          {priority.estimatedImpact}
                        </p>
                      </div>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-muted-foreground mb-1">Due Date</p>
                      <p className="text-sm font-medium">{formatDate(task.dueDate)}</p>
                    </div>

                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'pending')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {['all', 'pending', 'in-progress', 'completed'].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {(tabValue === 'all' ? tasks : tasks.filter(t => t.status === tabValue)).map((task) => {
              const priority = taskPriorities.get(task.id);

              return (
                <Card key={task.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(task.status)}
                          <CardTitle className="text-lg">{task.title}</CardTitle>
                        </div>
                        <CardDescription className="mt-2">{task.description}</CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                          {task.priority}
                        </span>
                        {priority && (
                          <div className={`flex items-center gap-1 ${getAIPriorityColor(priority.priorityScore)}`}>
                            <Sparkles className="h-4 w-4" />
                            <span className="text-sm font-bold">{priority.priorityScore}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <p className="text-muted-foreground">Due Date</p>
                      <p className="font-medium">{formatDate(task.dueDate)}</p>
                    </div>

                    <div className="flex gap-2">
                      {task.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                        >
                          <Clock className="h-3 w-3 mr-1" />
                          Start Task
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'completed')}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Complete
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(task.id, 'pending')}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
            {(tabValue === 'all' ? tasks : tasks.filter(t => t.status === tabValue)).length === 0 && (
              <Card>
                <CardContent className="py-12 text-center">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No {tabValue} tasks found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
