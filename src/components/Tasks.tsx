'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCRMStore, type Task } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import { Plus, CheckCircle, Clock, AlertCircle } from 'lucide-react';

export default function Tasks() {
  const { tasks, updateTask } = useCRMStore();
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  const filteredTasks = tasks.filter((task) =>
    filter === 'all' ? true : task.status === filter
  );

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b">
        {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? 'border-b-2 border-blue-500 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {status === 'all' ? 'All Tasks' : status.replace('-', ' ')}
            <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
              {status === 'all'
                ? tasks.length
                : tasks.filter((t) => t.status === status).length}
            </span>
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  {getStatusIcon(task.status)}
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Due:</span>
                    <span className="font-medium">{formatDate(task.dueDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Assigned to:</span>
                    <span className="font-medium">{task.assignedTo}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  {task.status !== 'completed' && (
                    <>
                      {task.status === 'pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleStatusChange(task.id, 'in-progress')}
                        >
                          Start
                        </Button>
                      )}
                      <Button
                        size="sm"
                        onClick={() => handleStatusChange(task.id, 'completed')}
                      >
                        Complete
                      </Button>
                    </>
                  )}
                  {task.status === 'completed' && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(task.id, 'pending')}
                    >
                      Reopen
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No tasks found</p>
        </div>
      )}
    </div>
  );
}
