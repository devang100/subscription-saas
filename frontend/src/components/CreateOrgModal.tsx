import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { api } from "@/lib/api";
import { useRouter } from "next/navigation";

interface CreateOrgModalProps {
    children: React.ReactNode;
}

export function CreateOrgModal({ children }: CreateOrgModalProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post('/organizations', { name, slug });
            setOpen(false);
            router.push(`/dashboard/${res.data.data.id}`);
        } catch (error) {
            console.error(error);
            // In a real app, show error toast
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <form onSubmit={handleSubmit}>
                    <DialogHeader>
                        <DialogTitle>Create Organization</DialogTitle>
                        <DialogDescription>
                            Create a new organization to manage your projects and team.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    // Auto-generate slug
                                    setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-'));
                                }}
                                placeholder="Acme Corp"
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="slug">Slug</Label>
                            <Input
                                id="slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="acme-corp"
                                required
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Creating..." : "Create Organization"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
