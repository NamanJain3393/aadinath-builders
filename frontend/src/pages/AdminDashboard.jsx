import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, LogOut, Upload } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [properties, setProperties] = useState([]);
    const [inquiries, setInquiries] = useState([]);
    const [activeTab, setActiveTab] = useState('properties');
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingProperty, setEditingProperty] = useState(null);
    const [uploading, setUploading] = useState(false);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [propertyForm, setPropertyForm] = useState({
        title: '', price: '', location: '', type: 'Flat', area: '', description: '', images: '', status: 'Available'
    });

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin');
            return;
        }

        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const fetchData = async () => {
            try {
                const propsRes = await axios.get('/api/properties');
                setProperties(propsRes.data.properties);

                const inqRes = await axios.get('/api/inquiries', config);
                setInquiries(inqRes.data);
            } catch (error) {
                console.error(error);
                if (error.response?.status === 401) {
                    localStorage.removeItem('userInfo');
                    navigate('/admin');
                }
            }
        };
        fetchData();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('userInfo');
        navigate('/admin');
    };

    const handleDeleteProperty = async (id) => {
        if (!window.confirm('Are you sure?')) return;
        try {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
            await axios.delete(`/api/properties/${id}`, config);
            setProperties(properties.filter(p => p._id !== id));
            toast.success('Property deleted');
        } catch (error) {
            toast.error('Failed to delete property');
        }
    };

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            // Add new image URL to existing images
            const currentImages = propertyForm.images ? propertyForm.images.split(',').map(i => i.trim()).filter(Boolean) : [];
            currentImages.push(data.filePath); // Add only path, proxy handles domain

            setPropertyForm({ ...propertyForm, images: currentImages.join(', ') });
            setUploading(false);
            toast.success('Image uploaded');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const handleSaveProperty = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
        // Split images by comma
        const formattedData = {
            ...propertyForm,
            images: typeof propertyForm.images === 'string' ? propertyForm.images.split(',').map(i => i.trim()) : propertyForm.images
        };

        try {
            if (editingProperty) {
                const { data } = await axios.put(`/api/properties/${editingProperty._id}`, formattedData, config);
                setProperties(properties.map(p => p._id === data._id ? data : p));
                toast.success('Property updated');
            } else {
                const { data } = await axios.post('/api/properties', formattedData, config);
                setProperties([data, ...properties]);
                toast.success('Property added');
            }
            setIsDialogOpen(false);
            setEditingProperty(null);
            setPropertyForm({ title: '', price: '', location: '', type: 'Flat', area: '', description: '', images: '', status: 'Available' });
        } catch (error) {
            toast.error('Failed to save property');
        }
    };

    const openEditModal = (property) => {
        setEditingProperty(property);
        setPropertyForm({
            title: property.title,
            price: property.price,
            location: property.location,
            type: property.type,
            area: property.area,
            description: property.description,
            images: property.images.join(', '),
            status: property.status
        });
        setIsDialogOpen(true);
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">Admin Dashboard</h1>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Welcome, {userInfo?.name}</span>
                    <Button variant="ghost" size="sm" onClick={handleLogout}><LogOut className="h-4 w-4 mr-2" /> Logout</Button>
                </div>
            </header>

            <div className="container mx-auto px-4 py-8">
                <div className="flex gap-4 mb-6">
                    <Button
                        variant={activeTab === 'properties' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('properties')}
                    >
                        Properties
                    </Button>
                    <Button
                        variant={activeTab === 'inquiries' ? 'default' : 'outline'}
                        onClick={() => setActiveTab('inquiries')}
                    >
                        Inquiries
                    </Button>
                </div>

                {activeTab === 'properties' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold">Manage Properties</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setEditingProperty(null);
                                    setPropertyForm({ title: '', price: '', location: '', type: 'Flat', area: '', description: '', images: '', status: 'Available' });
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button><Plus className="h-4 w-4 mr-2" /> Add Property</Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                                    </DialogHeader>
                                    <form onSubmit={handleSaveProperty} className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="Title" value={propertyForm.title} onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })} required />
                                            <Input placeholder="Price" type="number" value={propertyForm.price} onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <Input placeholder="Location" value={propertyForm.location} onChange={e => setPropertyForm({ ...propertyForm, location: e.target.value })} required />
                                            <Input placeholder="Area (e.g. 1200 sqft)" value={propertyForm.area} onChange={e => setPropertyForm({ ...propertyForm, area: e.target.value })} required />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={propertyForm.type}
                                                onChange={e => setPropertyForm({ ...propertyForm, type: e.target.value })}
                                            >
                                                <option value="Flat">Flat</option>
                                                <option value="Plot">Plot</option>
                                                <option value="Villa">Villa</option>
                                                <option value="Commercial">Commercial</option>
                                            </select>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={propertyForm.status}
                                                onChange={e => setPropertyForm({ ...propertyForm, status: e.target.value })}
                                            >
                                                <option value="Available">Available</option>
                                                <option value="Sold">Sold</option>
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Input
                                                type="text"
                                                placeholder="Image URLs (comma separated) or Upload below"
                                                value={propertyForm.images}
                                                onChange={e => setPropertyForm({ ...propertyForm, images: e.target.value })}
                                            />
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    type="file"
                                                    id="image-file"
                                                    onChange={uploadFileHandler}
                                                    className="cursor-pointer"
                                                />
                                                {uploading && <div className="text-sm text-slate-500">Uploading...</div>}
                                            </div>
                                        </div>                                        <textarea
                                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                            placeholder="Description"
                                            value={propertyForm.description}
                                            onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                            required
                                        />
                                        <Button type="submit" className="w-full">Save Property</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map(property => (
                                <div key={property._id} className="bg-white border rounded-lg p-4 shadow-sm relative">
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEditModal(property)}>
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteProperty(property._id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <h3 className="font-bold pr-20">{property.title}</h3>
                                    <p className="text-sm text-slate-500">{property.location}</p>
                                    <div className="mt-2 flex justify-between items-center">
                                        <span className="font-bold">₹ {property.price.toLocaleString('en-IN')}</span>
                                        <span className={`text-xs px-2 py-1 rounded ${property.status === 'Sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {property.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Leads & Inquiries</h2>
                        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-100 text-slate-600 uppercase">
                                    <tr>
                                        <th className="px-6 py-3">Date</th>
                                        <th className="px-6 py-3">Name</th>
                                        <th className="px-6 py-3">Property</th>
                                        <th className="px-6 py-3">Contact</th>
                                        <th className="px-6 py-3">Message</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {inquiries.map(inquiry => (
                                        <tr key={inquiry._id} className="border-b hover:bg-slate-50">
                                            <td className="px-6 py-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                                            <td className="px-6 py-4">{inquiry.propertyId ? inquiry.propertyId.title : 'General Inquiry'}</td>
                                            <td className="px-6 py-4">
                                                <div>{inquiry.email}</div>
                                                <div className="text-slate-500">{inquiry.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 max-w-xs truncate" title={inquiry.message}>{inquiry.message}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {inquiries.length === 0 && <div className="p-8 text-center text-slate-500">No inquiries found.</div>}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;
