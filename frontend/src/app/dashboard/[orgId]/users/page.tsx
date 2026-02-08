'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { X, UserPlus, Edit2, Trash2 } from 'lucide-react';

export default function UsersPage() {
    const { orgId } = useParams();
    const { user } = useAuthStore();
    const [members, setMembers] = useState<any[]>([]);
    const [invitations, setInvitations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('Member');

    const [editingMember, setEditingMember] = useState<any>(null); // For Edit Modal

    useEffect(() => {
        if (orgId) {
            fetchMembers();
        }
    }, [orgId]);

    const fetchMembers = () => {
        api.get(`/organizations/${orgId}/members`)
            .then(res => {
                if (res.data.data.members) {
                    setMembers(res.data.data.members);
                    setInvitations(res.data.data.invitations || []);
                } else {
                    // Fallback if backend hasn't updated immediately or cached
                    setMembers(res.data.data);
                }
                setLoading(false);
            })
            .catch(console.error);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/organizations/${orgId}/invites`, {
                email: inviteEmail,
                roleName: inviteRole
            });
            setShowInviteModal(false);
            setInviteEmail('');
            fetchMembers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to invite user');
        }
    };

    const handleUpdateRole = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingMember) return;
        try {
            await api.patch(`/organizations/${orgId}/members/${editingMember.id}`, {
                roleName: editingMember.role.name
            });
            setEditingMember(null);
            fetchMembers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to update member');
        }
    };

    const handleRemoveMember = async () => {
        if (!editingMember) return;
        if (!confirm('Are you sure you want to remove this user?')) return;
        try {
            await api.delete(`/organizations/${orgId}/members/${editingMember.id}`);
            setEditingMember(null);
            fetchMembers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to remove member');
        }
    };

    const handleResend = async (invitationId: string) => {
        try {
            await api.post(`/organizations/${orgId}/invites/resend`, { invitationId });
            alert('Invitation resent successfully.');
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to resend invitation');
        }
    };

    return (
        <div className="flex-1 p-10 relative overflow-auto h-full">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Users</h1>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2 shadow-sm shadow-indigo-200 transition-all"
                >
                    <UserPlus size={18} />
                    <span>Invite User</span>
                </button>
            </div>

            <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm border border-gray-100 dark:border-zinc-800 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-zinc-800">
                    <thead className="bg-gray-50/50 dark:bg-zinc-800/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-zinc-900 divide-y divide-gray-200 dark:divide-zinc-800">
                        {members.map((m: any) => (
                            <tr key={m.id} className="hover:bg-gray-50/50 dark:hover:bg-zinc-800/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{m.user.fullName}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">{m.user.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                                    <span className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full border ${m.role.name === 'Owner' ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-800' : 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-100 dark:border-green-800'}`}>
                                        {m.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => setEditingMember(m)}
                                        className="text-gray-400 hover:text-indigo-600 transition-colors"
                                    >
                                        <Edit2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {invitations.map((inv: any) => (
                            <tr key={inv.id} className="bg-gray-50/30 dark:bg-zinc-800/30">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-400 italic">Pending...</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400 italic">{inv.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    <span className="px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border border-yellow-100 dark:border-yellow-800">
                                        {inv.role.name} (Pending)
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button
                                        onClick={() => handleResend(inv.id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Resend
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Invite Modal */}
            {showInviteModal && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-96 shadow-xl border border-gray-100 dark:border-zinc-800 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Invite User</h2>
                        <form onSubmit={handleInvite}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 text-gray-900 dark:text-white bg-white dark:bg-zinc-800 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={inviteEmail}
                                    onChange={e => setInviteEmail(e.target.value)}
                                    placeholder="colleague@example.com"
                                />
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 dark:text-gray-200 mb-1">Role</label>
                                <select
                                    className="w-full border border-gray-300 dark:border-zinc-700 rounded-lg p-2.5 bg-white dark:bg-zinc-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={inviteRole}
                                    onChange={e => setInviteRole(e.target.value)}
                                >
                                    <option value="Member">Member</option>
                                    <option value="Admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setShowInviteModal(false)}
                                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm shadow-indigo-200"
                                >
                                    Send Invite
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editingMember && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-xl border border-gray-100 animate-in zoom-in-95">
                        <h2 className="text-xl font-bold mb-4 text-gray-900">Edit Member</h2>
                        <form onSubmit={handleUpdateRole}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-900 mb-1">User</label>
                                <div className="text-gray-900 p-2.5 bg-gray-50 rounded-lg border border-gray-200 font-medium">
                                    {editingMember.user.fullName}
                                    <span className="block text-xs text-gray-500 font-normal mt-0.5">{editingMember.user.email}</span>
                                </div>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-900 mb-1">Role</label>
                                <select
                                    className="w-full border border-gray-300 rounded-lg p-2.5 bg-white text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                    value={editingMember.role.name}
                                    onChange={e => setEditingMember({ ...editingMember, role: { ...editingMember.role, name: e.target.value } })}
                                >
                                    <option value="Member">Member</option>
                                    <option value="Admin">Admin</option>
                                    <option value="Owner">Owner</option>
                                </select>
                            </div>
                            <div className="flex justify-between items-center">
                                <button
                                    type="button"
                                    onClick={handleRemoveMember}
                                    className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                                >
                                    <Trash2 size={14} /> Remove
                                </button>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setEditingMember(null)}
                                        className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm shadow-indigo-200"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
