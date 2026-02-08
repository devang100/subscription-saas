'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { useSocket } from '@/hooks/useSocket';
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    defaultDropAnimationSideEffects,
    DropAnimation,
} from '@dnd-kit/core';
import { Search, Plus } from 'lucide-react';
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
    useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';

// Helper for DndKit
function SortableTaskItem({ task, onClick, onDelete, columnId }: any) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
            sortable: { containerId: columnId } // Important for separating lists
        }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        touchAction: 'none', // Prevent scrolling on touch devices/trackpads while dragging
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            onClick={onClick}
            className="group relative bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700 hover:shadow-md hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-grab active:cursor-grabbing"
        >
            {/* Delete Button */}
            <button
                onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    onDelete(task.id);
                }}
                className="absolute top-2 right-2 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                onPointerDown={(e) => e.stopPropagation()} // prevent drag start
            >
                ✕
            </button>

            <div className="flex justify-between items-start mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                    task.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400' :
                        'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                    }`}>
                    {task.priority || 'LOW'}
                </span>
            </div>

            <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-1 leading-snug">{task.title}</h4>
            {task.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{task.description}</p>}

            <div className="flex items-center justify-between pt-2 border-t border-gray-50 dark:border-zinc-800 mt-2">
                <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                        {task.assignee?.fullName?.charAt(0) || '?'}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[80px]">{task.assignee?.fullName || 'Unassigned'}</span>
                </div>
                <div className="text-[10px] text-gray-400">
                    {task.dueDate && new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                </div>
            </div>
        </div>
    );
}

export default function KanbanBoardPage() {
    const { orgId, projectId } = useParams();
    const { user } = useAuthStore();

    // Core Data State
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // UI State
    const [showModal, setShowModal] = useState(false);
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
    const [team, setTeam] = useState<any[]>([]);

    // Form State
    const [formData, setFormData] = useState({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });

    // Modal Tabs State
    const [activeTab, setActiveTab] = useState<'details' | 'comments' | 'time' | 'files'>('details');
    const [comments, setComments] = useState<any[]>([]);
    const [timeLogs, setTimeLogs] = useState<any[]>([]);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [logData, setLogData] = useState({ minutes: '', description: '' });

    // Track original status to verify changes in DragEnd
    const dragStartStatus = useRef<string | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        setActiveDragId(active.id as string);
        const task = tasks.find(t => t.id === active.id);
        if (task) {
            dragStartStatus.current = task.status;
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        // Verify active and over match
        if (activeId === overId) return;

        const activeTask = tasks.find(t => t.id === activeId);
        const overTask = tasks.find(t => t.id === overId);

        if (!activeTask) return;

        const isOverColumn = columns.some(c => c.id === overId);

        if (isOverColumn) {
            const overColumnId = overId as string;
            // Moving to an empty column or explicitly over column container
            if (activeTask.status !== overColumnId) {
                setTasks(prev => {
                    const activeIndex = prev.findIndex(t => t.id === activeId);
                    const newTasks = [...prev];
                    // Update status
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: overColumnId };
                    // Move to end of array to simulate append
                    return arrayMove(newTasks, activeIndex, newTasks.length - 1);
                });
            }
        } else if (overTask) {
            // Dragging over another task
            const overColumnId = overTask.status;

            // If dragging between different columns
            if (activeTask.status !== overTask.status) {
                setTasks(prev => {
                    const activeIndex = prev.findIndex(t => t.id === activeId);
                    const overIndex = prev.findIndex(t => t.id === overId);
                    const newTasks = [...prev];

                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: overColumnId };
                    return arrayMove(newTasks, activeIndex, overIndex);
                });
            } else {
                // Dragging within SAME column (Reordering) - Valid for UI only since no backend order
                setTasks(prev => {
                    const activeIndex = prev.findIndex(t => t.id === activeId);
                    const overIndex = prev.findIndex(t => t.id === overId);
                    return arrayMove(prev, activeIndex, overIndex);
                });
            }
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveDragId(null);

        if (!over) return;

        const isOverColumn = columns.some(c => c.id === over.id);
        const overTask = tasks.find(t => t.id === over.id);

        // Calculate what the New Status SHOULD be based on where we dropped
        let newStatus = dragStartStatus.current; // Default to old status if unknown

        if (isOverColumn) {
            newStatus = over.id as string;
        } else if (overTask) {
            newStatus = overTask.status;
        }

        const originalStatus = dragStartStatus.current;
        const taskId = active.id as string;

        // Only persist if status actually changed from the ORIGINAL status (at start of drag)
        if (newStatus && originalStatus !== newStatus) {
            try {
                // Optimistic update already happened in DragOver, so we just save
                await api.patch(`/tasks/${taskId}`, { status: newStatus });

                // Ensure local state is consistent (in case DragOver missed something)
                setTasks(prev => {
                    return prev.map(t =>
                        t.id === taskId ? { ...t, status: newStatus as string } : t
                    );
                });
            } catch (error) {
                console.error("Failed to update status", error);
                // Revert on error
                const original = tasks.find(t => t.id === taskId);
                if (original) {
                    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: originalStatus as string } : t));
                }
                fetchTasks();
            }
        }

        dragStartStatus.current = null;
    };

    const dropAnimation: DropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.4',
                },
            },
        }),
    };

    const renderActiveDragOverlay = () => {
        if (!activeDragId) return null;
        const task = tasks.find(t => t.id === activeDragId);
        if (!task) return null;
        // Render a simplified version for overlay
        return (
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-xl border-2 border-indigo-500 cursor-grabbing opacity-90 rotate-3 scale-105">
                <h4 className="font-medium text-gray-900 dark:text-gray-100">{task.title}</h4>
                <div className="flex justify-between items-center mt-2">
                    <span className="text-xs bg-gray-100 dark:bg-zinc-700 px-1 rounded">{task.priority}</span>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col h-full overflow-hidden bg-gray-50/50 dark:bg-zinc-950">
            {/* Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-800 px-8 py-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Link href={`/dashboard/${orgId}/clients`} className="text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 text-sm">
                        Clients /
                    </Link>
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">Kanban Board</h1>
                    <div className="flex bg-gray-100 dark:bg-zinc-800 p-1 rounded-lg ml-4">
                        <button
                            onClick={() => setViewMode('BOARD')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'BOARD' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Board
                        </button>
                        <button
                            onClick={() => setViewMode('CALENDAR')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${viewMode === 'CALENDAR' ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'}`}
                        >
                            Calendar
                        </button>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setEditingTaskId(null);
                        setFormData({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
                        setActiveTab('details');
                        setShowModal(true);
                    }}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm shadow-indigo-200 dark:shadow-none"
                >
                    + Add Task
                </button>
            </div>

            {/* Board Area */}
            {viewMode === 'BOARD' ? (
                <DndContext
                    sensors={sensors}
                    collisionDetection={closestCorners}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                >
                    <div className="flex-1 overflow-x-auto overflow-y-hidden p-6">
                        {/* Filters Toolbar */}
                        <div className="mb-6 flex gap-4 items-center">
                            <div className="relative w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
                                />
                            </div>
                            <div className="flex gap-2">
                                <select
                                    className="px-3 py-2 rounded-lg border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
                                    value={filterPriority}
                                    onChange={(e) => setFilterPriority(e.target.value)}
                                >
                                    <option value="ALL">All Priorities</option>
                                    <option value="HIGH">High</option>
                                    <option value="MEDIUM">Medium</option>
                                    <option value="LOW">Low</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex h-full gap-6 min-w-[1000px]">
                            {columns.map(col => {
                                const colTasks = filteredTasks.filter(t => t.status === col.id);
                                return (
                                    <div key={col.id} className={`flex-1 rounded-xl border ${col.color} flex flex-col max-h-full transition-colors`}>
                                        {/* Column Header */}
                                        <div className="p-4 border-b border-gray-200/50 dark:border-zinc-700/50 flex justify-between items-center bg-white/40 dark:bg-black/20 backdrop-blur-sm rounded-t-xl">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-gray-800 dark:text-gray-100">{col.label}</h3>
                                                <span className="bg-white dark:bg-zinc-800 px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm border border-gray-100 dark:border-zinc-700">
                                                    {colTasks.length}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setEditingTaskId(null);
                                                    setFormData({ title: '', description: '', priority: 'MEDIUM', assigneeId: '', dueDate: '' });
                                                    setActiveTab('details');
                                                    // Pre-select column status if possible (not in form data yet but logic could be added)
                                                    // For now just standard add
                                                    setShowModal(true);
                                                }}
                                                className="p-1 hover:bg-white dark:hover:bg-zinc-700 rounded text-gray-500 hover:text-indigo-600 transition-colors"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>

                                        {/* Sortable Area */}
                                        <div className="flex-1 p-3 overflow-y-auto space-y-3 scrollbar-thin">
                                            <SortableContext
                                                id={col.id}
                                                items={colTasks.map(t => t.id)}
                                                strategy={verticalListSortingStrategy}
                                            >
                                                {colTasks.map(task => (
                                                    <SortableTaskItem
                                                        key={task.id}
                                                        task={task}
                                                        onClick={() => openEditModal(task)}
                                                        onDelete={handleDelete}
                                                        columnId={col.id}
                                                    />
                                                ))}
                                                {colTasks.length === 0 && (
                                                    <div className="h-full min-h-[100px] flex items-center justify-center text-gray-400 text-sm border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-lg">
                                                        Drop here
                                                    </div>
                                                )}
                                            </SortableContext>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                </DndContext>
            ) : (
                renderCalendar()
            )}

            {mounted && createPortal(
                <DragOverlay dropAnimation={dropAnimation}>
                    {renderActiveDragOverlay()}
                </DragOverlay>,
                document.body
            )}

            {/* Modal */}
            {showModal && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl w-[600px] h-[600px] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-gray-200 dark:border-zinc-700">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{editingTaskId ? 'Task Details' : 'New Task'}</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors">✕</button>
                        </div>

                        {/* Tabs */}
                        {editingTaskId && (
                            <div className="flex border-b border-gray-200 dark:border-zinc-800 px-6 bg-white dark:bg-zinc-900 shrink-0">
                                <button className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'details' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`} onClick={() => setActiveTab('details')}>Details</button>
                                <button className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'comments' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`} onClick={() => setActiveTab('comments')}>Discussion ({comments.length})</button>
                                <button className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'time' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`} onClick={() => setActiveTab('time')}>Time Logs</button>
                                <button className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'files' ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'}`} onClick={() => setActiveTab('files')}>Files ({attachments.length})</button>
                            </div>
                        )}

                        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900 custom-scrollbar">
                            {activeTab === 'details' && (
                                <form id="taskForm" onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
                                        <input
                                            type="text"
                                            required
                                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm placeholder:text-gray-400"
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                                        <textarea
                                            className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white h-24 text-sm placeholder:text-gray-400"
                                            value={formData.description}
                                            onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
                                            <select
                                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2.5 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                                                value={formData.priority}
                                                onChange={e => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <option value="LOW">Low</option>
                                                <option value="MEDIUM">Medium</option>
                                                <option value="HIGH">High</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
                                            <input
                                                type="date"
                                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2.5 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                                                value={formData.dueDate}
                                                onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
                                            <select
                                                className="w-full border border-gray-300 dark:border-zinc-600 rounded-lg p-2.5 outline-none bg-white dark:bg-zinc-800 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500"
                                                value={formData.assigneeId}
                                                onChange={e => setFormData({ ...formData, assigneeId: e.target.value })}
                                            >
                                                <option value="">Unassigned</option>
                                                {team.map(m => (
                                                    <option key={m.user.id} value={m.user.id}>
                                                        {m.user.fullName}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </form>
                            )}

                            {/* Comments Tab content... simplified for brevity, assume similar styling update */}
                            {activeTab === 'comments' && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        {comments.map((c: any) => (
                                            <div key={c.id} className="flex gap-3">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 flex items-center justify-center font-bold text-xs shrink-0">
                                                    {c.user.fullName[0]}
                                                </div>
                                                <div className="bg-gray-50 dark:bg-zinc-800 p-3 rounded-lg flex-1">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="font-semibold text-sm text-gray-900 dark:text-gray-200">{c.user.fullName}</span>
                                                        <span className="text-xs text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-700 dark:text-gray-300">{c.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                                        <form onSubmit={handleAddComment}>
                                            <textarea
                                                className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white h-20"
                                                placeholder="Write a comment..."
                                                value={newComment}
                                                onChange={e => setNewComment(e.target.value)}
                                            />
                                            <div className="flex justify-end mt-2">
                                                <button type="submit" className="bg-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-indigo-700">Post Comment</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'time' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        {timeLogs.map((log: any) => (
                                            <div key={log.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-900 dark:text-gray-100">{log.minutes} mins</span>
                                                        <span className="text-gray-500 dark:text-gray-400 text-sm">by {log.user.fullName}</span>
                                                    </div>
                                                    {log.description && <p className="text-sm text-gray-600 dark:text-gray-400">{log.description}</p>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="pt-4 border-t border-gray-200 dark:border-zinc-800">
                                        <form onSubmit={handleLogTime} className="flex gap-3 items-end">
                                            <div className="w-24">
                                                <input
                                                    type="number"
                                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded p-1.5 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                                    placeholder="60"
                                                    value={logData.minutes}
                                                    onChange={e => setLogData({ ...logData, minutes: e.target.value })}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <input
                                                    type="text"
                                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded p-1.5 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-white"
                                                    placeholder="Description..."
                                                    value={logData.description}
                                                    onChange={e => setLogData({ ...logData, description: e.target.value })}
                                                />
                                            </div>
                                            <button type="submit" className="bg-green-600 text-white px-4 py-1.5 rounded text-sm hover:bg-green-700">Log</button>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'files' && (
                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-zinc-800 p-6 rounded-lg border-2 border-dashed border-gray-200 dark:border-zinc-700 text-center hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors">
                                        <input
                                            type="file"
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            id="file-upload"
                                        />
                                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                            <div className="bg-white dark:bg-zinc-700 p-3 rounded-full shadow-sm text-indigo-600 dark:text-indigo-400">
                                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Click to upload file</span>
                                            <span className="text-xs text-gray-400">Any file up to 10MB</span>
                                        </label>
                                    </div>
                                    <div className="space-y-3">
                                        {attachments.map((file: any) => (
                                            <div key={file.id} className="flex justify-between items-center p-3 bg-white dark:bg-zinc-800 rounded-lg border border-gray-100 dark:border-zinc-700 shadow-sm">
                                                <div className="flex items-center gap-3 overflow-hidden">
                                                    <div className="w-10 h-10 rounded bg-gray-100 dark:bg-zinc-700 flex items-center justify-center shrink-0 text-xs font-bold text-gray-500 uppercase">
                                                        {file.fileType.split('/')[1] || 'file'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <a href={`http://localhost:4000${file.fileUrl}`} target="_blank" rel="noopener noreferrer" className="font-medium text-gray-900 dark:text-gray-200 truncate hover:text-indigo-600 dark:hover:text-indigo-400 block">
                                                            {file.fileName}
                                                        </a>
                                                        <span className="text-xs text-gray-400">{(file.fileSize / 1024).toFixed(1)} KB • {new Date(file.createdAt).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <button onClick={() => handleDeleteFile(file.id)} className="text-gray-400 hover:text-red-500 p-2">
                                                    ✕
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Footer (Actions) */}
                        {activeTab === 'details' && (
                            <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end gap-3 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => document.getElementById('taskForm')?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))}
                                    type="button"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium"
                                >
                                    {editingTaskId ? 'Save Changes' : 'Create Task'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
