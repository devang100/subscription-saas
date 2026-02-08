'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReportsPage() {
    const { orgId } = useParams();

    // Default to current month
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const [dateRange, setDateRange] = useState({
        startDate: firstDay.toISOString().split('T')[0],
        endDate: today.toISOString().split('T')[0]
    });

    const [reportData, setReportData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const fetchReports = () => {
        setLoading(true);
        api.get(`/organizations/${orgId}/reports/time`, { params: dateRange })
            .then(res => {
                setReportData(res.data.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (orgId) {
            fetchReports();
        }
    }, [orgId, dateRange]);

    const totalMinutes = reportData?.aggregatedUsers.reduce((acc: number, u: any) => acc + u.totalMinutes, 0) || 0;
    const totalHours = (totalMinutes / 60).toFixed(1);

    const chartData = reportData?.aggregatedUsers.map((u: any) => ({
        name: u.user.fullName,
        hours: parseFloat((u.totalMinutes / 60).toFixed(1))
    }));

    const downloadCSV = () => {
        if (!reportData?.logs) return;

        const headers = ['Date', 'User', 'Project', 'Client', 'Task', 'Minutes', 'Description'];
        const rows = reportData.logs.map((log: any) => [
            new Date(log.createdAt).toLocaleDateString(),
            log.user.fullName,
            log.task.project.name,
            log.task.project.client.name,
            log.task.title,
            log.minutes,
            `"${log.description || ''}"`
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map((e: any[]) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `time-report-${dateRange.startDate}-${dateRange.endDate}.csv`);
        document.body.appendChild(link);
        link.click();
    };

    return (
        <div className="flex-1 p-10 overflow-auto h-full">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Reports</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Time tracking and billing aggregation</p>
                </div>
                <div className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-2 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-800">
                    <input
                        type="date"
                        value={dateRange.startDate}
                        onChange={e => setDateRange({ ...dateRange, startDate: e.target.value })}
                        className="border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                    />
                    <span className="text-gray-400">to</span>
                    <input
                        type="date"
                        value={dateRange.endDate}
                        onChange={e => setDateRange({ ...dateRange, endDate: e.target.value })}
                        className="border border-gray-300 dark:border-zinc-700 rounded px-2 py-1 text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                    />
                    <button
                        onClick={downloadCSV}
                        className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm hover:bg-indigo-700 ml-2"
                    >
                        Export CSV
                    </button>
                </div>
            </div>

            {loading ? <div className="text-center py-20 text-gray-500">Loading data...</div> : (
                <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Hours</h3>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{totalHours} <span className="text-lg text-gray-400 font-normal">hrs</span></div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Active Users</h3>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{reportData?.aggregatedUsers.length}</div>
                        </div>
                        <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800">
                            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">Total Entries</h3>
                            <div className="text-3xl font-bold text-gray-900 dark:text-white">{reportData?.logs.length}</div>
                        </div>
                    </div>

                    {/* Chart */}
                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 h-96">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Hours per User</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} opacity={0.1} />
                                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '8px', color: '#fff' }}
                                    cursor={{ fill: '#f4f4f5', opacity: 0.1 }}
                                />
                                <Bar dataKey="hours" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Table */}
                    <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 dark:border-zinc-800">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Detailed Entries</h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-gray-50 dark:bg-zinc-950 text-gray-500 dark:text-gray-400 font-medium">
                                    <tr>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4">Client / Project</th>
                                        <th className="px-6 py-4">Task</th>
                                        <th className="px-6 py-4 text-right">Duration</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                                    {reportData?.logs.map((log: any) => (
                                        <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{new Date(log.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-200">{log.user.fullName}</td>
                                            <td className="px-6 py-4">
                                                <div className="text-gray-900 dark:text-gray-200">{log.task.project.client.name}</div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400">{log.task.project.name}</div>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{log.task.title}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900 dark:text-gray-200">{log.minutes} min</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
