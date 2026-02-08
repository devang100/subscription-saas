'use client';

import { api } from '@/lib/api';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Users, Folder, Mail, Phone, Plus, Link as LinkIcon, ExternalLink } from 'lucide-react';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { EmptyState } from '@/components/EmptyState';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusIndicator } from '@/components/ui/status-indicator';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
    PaginationEllipsis
} from '@/components/ui/pagination';

export default function ClientsPage() {
    const { orgId } = useParams();
    const { user } = useAuthStore();
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

    useEffect(() => {
        if (orgId) {
            fetchClients();
        }
    }, [orgId]);

    const fetchClients = () => {
        setLoading(true);
        api.get(`/organizations/${orgId}/clients`)
            .then(res => {
                setClients(res.data.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post(`/organizations/${orgId}/clients`, formData);
            setShowModal(false);
            setFormData({ name: '', email: '', phone: '' });
            fetchClients();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Failed to create client');
        }
    };

    const handleCopyPortal = async (e: React.MouseEvent, client: any) => {
        e.preventDefault(); // Prevent navigation
        e.stopPropagation();

        // If no token, generate one
        let token = client.portalToken;
        if (!token) {
            try {
                const res = await api.post(`/portal/generate/${client.id}`);
                token = res.data.data.token;
                // Update local state to reflect new token
                setClients(prev => prev.map(c => c.id === client.id ? { ...c, portalToken: token } : c));
            } catch (err) {
                alert('Failed to generate portal token');
                return;
            }
        }

        const url = `${window.location.origin}/portal/${token}`;
        navigator.clipboard.writeText(url);
        alert('Portal link copied to clipboard!');
    };

    const filteredClients = clients.filter(c =>
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex-1 p-10 overflow-auto h-full bg-gray-50 dark:bg-zinc-950 transition-colors">
            <div className="max-w-6xl mx-auto">
                <Breadcrumbs
                    items={[
                        { label: 'Dashboard', href: `/dashboard/${orgId}` },
                        { label: 'Clients' }
                    ]}
                />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Clients</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage your agency clients and projects</p>
                    </div>
                    <div className="flex gap-3 w-full md:w-auto">
                        <Input
                            placeholder="Search clients..."
                            className="w-full md:w-64"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Button
                            onClick={() => setShowModal(true)}
                            className="gap-2"
                        >
                            <Plus size={18} /> Add Client
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <Skeleton key={i} className="h-48 w-full rounded-xl" />
                        ))}
                    </div>
                ) : filteredClients.length === 0 ? (
                    <EmptyState
                        icon={Users}
                        title={searchQuery ? "No clients found" : "No clients yet"}
                        description={searchQuery ? `No clients found matching "${searchQuery}"` : "Add your first client to start managing projects."}
                        action={searchQuery ? undefined : { label: "Create Client", onClick: () => setShowModal(true) }}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredClients.map(client => (
                            <Link
                                href={`/dashboard/${orgId}/clients/${client?.id}`}
                                key={client?.id}
                                className="block group relative"
                            >
                                <Card className="h-full hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md transition-all">
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded-full flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                {client.name.charAt(0)}
                                            </div>
                                            <StatusIndicator status={client.status === 'active' ? 'active' : 'inactive'} />
                                        </div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 mb-1 transition-colors">
                                            {client.name}
                                        </h3>

                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={(e) => handleCopyPortal(e, client)}
                                            className="absolute top-4 right-4 text-gray-400 hover:text-indigo-600 opacity-0 group-hover:opacity-100 transition-all"
                                            title="Copy Portal Link"
                                        >
                                            <LinkIcon size={16} />
                                        </Button>

                                        <div className="space-y-2 mt-4">
                                            {client.email && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <Mail size={14} /> {client.email}
                                                </div>
                                            )}
                                            {client.phone && (
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <Phone size={14} /> {client.phone}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-zinc-800 pt-4 mt-4">
                                            <Folder size={16} className="mr-2 text-gray-400" />
                                            <span className="font-medium text-gray-900 dark:text-white mr-1">{client._count?.projects || 0}</span> Projects
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && filteredClients.length > 0 && (
                    <div className="mt-8">
                        <Pagination>
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#" isActive>1</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">2</PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationEllipsis />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationNext href="#" />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    </div>
                )}

                {/* Inline Modal (Better would be Dialog component, but using standard Fixed overlay for now) */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm animate-in fade-in">
                        <div className="bg-white dark:bg-zinc-900 rounded-xl p-6 w-[400px] shadow-2xl animate-in zoom-in-95 border border-gray-200 dark:border-zinc-800">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Client</h2>
                                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">✕</button>
                            </div>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="contact@acme.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone <span className="text-gray-400 font-normal">(Optional)</span></label>
                                    <Input
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="+1 555..."
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-zinc-800 mt-6">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button type="submit">
                                        Create Client
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
