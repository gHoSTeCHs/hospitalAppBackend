import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockTasks } from '@/constants/data';
import { TaskType } from '@/types';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Filter, MoreHorizontal, SortDesc } from 'lucide-react';
import { useState } from 'react';

const TaskManagementInterface = () => {
    const [filterText, setFilterText] = useState<string>('');
    const [selectedTasks, setSelectedTasks] = useState<TaskType[]>([]);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const toggleTaskSelection = (task: TaskType) => {
        if (selectedTasks.some((selectedTask) => selectedTask.id === task.id)) {
            // If the task is already selected, remove it from the list
            setSelectedTasks(selectedTasks.filter((selectedTask) => selectedTask.id !== task.id));
        } else {
            // If the task is not selected, add it to the list
            setSelectedTasks([...selectedTasks, task]);
        }
    };

    const PriorityIndicator = ({ priority }: { priority: string }) => {
        switch (priority) {
            case 'High':
                return <ArrowUp className="h-4 w-4 text-red-500" />;
            case 'Medium':
                return <ArrowDown className="h-4 w-4 text-blue-500" />;
            case 'Low':
                return <ArrowDown className="h-4 w-4 text-gray-500" />;
            default:
                return null;
        }
    };

    return (
        <div className="bg-background mx-auto max-w-screen-2xl p-6">
            {/*Filter*/}
            <div className="mb-4 flex items-center gap-4">
                <Input placeholder="Filter tasks..." className="max-w-xs" value={filterText} onChange={(e) => setFilterText(e.target.value)} />

                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2">
                        <Filter className="h-4 w-4" />
                        Status
                    </Button>

                    <Button variant="outline" size="sm" className="gap-2">
                        <SortDesc className="h-4 w-4" />
                        Priority
                    </Button>

                    <div className="ml-auto">
                        <Button variant="outline" size="sm">
                            View
                        </Button>
                    </div>
                </div>
            </div>

            {/*Hospital list table*/}
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-12">
                                <Checkbox />
                            </TableHead>
                            <TableHead className="w-32">Task</TableHead>
                            <TableHead className="w-32">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                                    Title
                                </Button>
                            </TableHead>
                            <TableHead>
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                                    Description
                                </Button>
                            </TableHead>
                            <TableHead className="w-36">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                                    Status
                                </Button>
                            </TableHead>
                            <TableHead className="w-36">
                                <Button variant="ghost" size="sm" className="flex items-center gap-1 font-medium">
                                    Priority
                                </Button>
                            </TableHead>
                            <TableHead className="w-10"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockTasks.map((task) => (
                            <TableRow key={task.id}>
                                <TableCell>
                                    <Checkbox
                                        checked={selectedTasks.some((selectedTask) => selectedTask.id === task.id)}
                                        onCheckedChange={() => toggleTaskSelection(task)}
                                    />
                                </TableCell>
                                <TableCell className="font-medium">{task.id}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className="font-medium">
                                        {task.type}
                                    </Badge>
                                </TableCell>
                                <TableCell>{task.title}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div
                                            className={`h-2 w-2 rounded-full ${
                                                task.status === 'In Progress'
                                                    ? 'bg-blue-500'
                                                    : task.status === 'Todo'
                                                      ? 'bg-gray-500'
                                                      : task.status === 'Backlog'
                                                        ? 'bg-orange-500'
                                                        : task.status === 'Done'
                                                          ? 'bg-green-500'
                                                          : 'bg-red-500'
                                            }`}
                                        ></div>
                                        <span>{task.status}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <PriorityIndicator priority={task.priority} />
                                        <span>{task.priority}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>Edit</DropdownMenuItem>
                                            <DropdownMenuItem>Assign</DropdownMenuItem>
                                            <DropdownMenuItem>Change Status</DropdownMenuItem>
                                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/*Pagination*/}
            <div className="mt-4 flex items-center justify-between">
                <div className="text-muted-foreground text-sm">
                    {selectedTasks.length} of {mockTasks.length} row(s) selected.
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-sm">Rows per page</span>
                        <Select value={rowsPerPage.toString()} onValueChange={(value) => setRowsPerPage(Number(value))}>
                            <SelectTrigger className="w-16">
                                <SelectValue>{rowsPerPage}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                                <SelectItem value="50">50</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex items-center gap-1">
                        <span className="text-sm">
                            Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex">
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
                                <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                disabled={currentPage === 1}
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={currentPage === totalPages}
                            >
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
                                <ChevronsRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default TaskManagementInterface;
