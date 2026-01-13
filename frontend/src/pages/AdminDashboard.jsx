import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Plus, Trash2, Edit, LogOut, Upload, LayoutDashboard, MessageSquare, Users } from 'lucide-react';
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
    const [visitCount, setVisitCount] = useState(0);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const [activeFormTab, setActiveFormTab] = useState('overview');
    const [propertyForm, setPropertyForm] = useState({
        title: '', price: '', location: '', type: 'Flat', area: '', description: '', images: '', status: 'Available',
        bedrooms: '', bathrooms: '', balconies: '', parking: '', furnishing: 'Unfurnished', floorNumber: '',
        carpetArea: '', superArea: '', propertyAge: 'New Launch', facing: '', project: '', amenities: [], videoUrl: ''
    });

    useEffect(() => {
        if (!userInfo || userInfo.role !== 'admin') {
            navigate('/admin');
            return;
        }

        const fetchAdminData = async () => {
            const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

            // Fetch Properties
            try {
                const propsRes = await axios.get('/api/properties');
                setProperties(propsRes.data.properties);
            } catch (error) {
                console.error('Error fetching properties:', error);
                // Don't show toast for properties to avoid clutter if other things fail
            }

            // Fetch Inquiries
            try {
                const inqRes = await axios.get('/api/inquiries', config);
                setInquiries(inqRes.data);
            } catch (error) {
                console.error('Error fetching inquiries:', error);
                // toast.error('Failed to load inquiries');
            }

            // Fetch Visit Count
            try {
                const visitRes = await axios.get('/api/visits', config);
                setVisitCount(visitRes.data.count);
            } catch (error) {
                console.error('Error fetching visits:', error);
            }
        };

        fetchAdminData();
    }, [navigate]);

    const handleSaveProperty = async (e) => {
        e.preventDefault();
        const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };

        const formattedData = {
            ...propertyForm,
            images: typeof propertyForm.images === 'string' ? propertyForm.images.split(',').map(i => i.trim()).filter(Boolean) : propertyForm.images,
            // Ensure numbers are numbers
            price: Number(propertyForm.price),
            bedrooms: Number(propertyForm.bedrooms) || 0,
            bathrooms: Number(propertyForm.bathrooms) || 0,
            balconies: Number(propertyForm.balconies) || 0,
            amenities: Array.isArray(propertyForm.amenities) ? propertyForm.amenities : []
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
            resetForm();
        } catch (error) {
            console.error(error);
            toast.error('Failed to save property');
        }
    };

    const resetForm = () => {
        setPropertyForm({
            title: '', price: '', location: '', type: 'Flat', area: '', description: '', images: '', status: 'Available',
            bedrooms: '', bathrooms: '', balconies: '', parking: '', furnishing: 'Unfurnished', floorNumber: '',
            carpetArea: '', superArea: '', propertyAge: 'New Launch', facing: '', project: '', amenities: [], videoUrl: ''
        });
        setActiveFormTab('overview');
    };

    const openEditModal = (property) => {
        setEditingProperty(property);
        setPropertyForm({
            ...property,
            images: property.images.join(', '),
            amenities: property.amenities || [],
            videoUrl: property.videoUrl || ''
        });
        setActiveFormTab('overview');
        setIsDialogOpen(true);
    }

    const toggleAmenity = (amenity) => {
        const current = propertyForm.amenities || [];
        if (current.includes(amenity)) {
            setPropertyForm({ ...propertyForm, amenities: current.filter(a => a !== amenity) });
        } else {
            setPropertyForm({ ...propertyForm, amenities: [...current, amenity] });
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
                    Authorization: `Bearer ${userInfo.token}`
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);

            // Append the new image URL to the current list
            const currentImages = propertyForm.images || '';
            // If currentImages is empty string, just set data. If not, comma append.
            // Also handle if it ends with comma
            let newImages = currentImages.trim();
            if (newImages && !newImages.endsWith(',')) {
                newImages += ', ';
            }
            newImages += data;

            setPropertyForm({ ...propertyForm, images: newImages });
            setUploading(false);
            toast.success('Image uploaded');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Image upload failed');
        }
    };

    const uploadVideoHandler = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('image', file);
        setUploading(true);

        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${userInfo.token}`
                },
            };

            const { data } = await axios.post('/api/upload', formData, config);
            setPropertyForm({ ...propertyForm, videoUrl: data.filePath });
            setUploading(false);
            toast.success('Video uploaded successfully');
        } catch (error) {
            console.error(error);
            setUploading(false);
            toast.error('Video upload failed');
        }
    };

    const amenitiesList = ['Lift', 'Gym', 'Swimming Pool', 'Clubhouse', 'Security', 'Power Backup', 'Park', 'Vastu Compliant', 'Gas Pipeline', 'Intercom'];

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b sticky top-0 z-30">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-yellow-100 p-2 rounded-lg">
                            <LayoutDashboard className="h-5 w-5 text-yellow-700" />
                        </div>
                        <h1 className="text-xl font-bold bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent">
                            Aadinath Admin
                        </h1>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-slate-600 hidden md:inline font-medium">
                            Welcome, {userInfo?.name || 'Admin'}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => {
                                localStorage.removeItem('userInfo');
                                navigate('/admin');
                            }}
                        >
                            <LogOut className="h-4 w-4 mr-2" /> Logout
                        </Button>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8 space-y-8">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Properties</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{properties.length}</h3>
                            </div>
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                                <LayoutDashboard className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Total Inquiries</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{inquiries.length}</h3>
                            </div>
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                                <MessageSquare className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-xl border shadow-sm">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-slate-500">Website Visits</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-2">{visitCount}</h3>
                            </div>
                            <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                                <Users className="h-5 w-5" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Navigation Tabs */}
                <div className="border-b">
                    <nav className="flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('properties')}
                            className={`
                                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors
                                ${activeTab === 'properties'
                                    ? 'border-yellow-500 text-yellow-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            `}
                        >
                            Manage Properties
                        </button>
                        <button
                            onClick={() => setActiveTab('inquiries')}
                            className={`
                                py-4 px-1 inline-flex items-center border-b-2 font-medium text-sm transition-colors
                                ${activeTab === 'inquiries'
                                    ? 'border-yellow-500 text-yellow-600'
                                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                            `}
                        >
                            Leads & Inquiries
                            {inquiries.length > 0 && (
                                <span className="ml-2 bg-slate-100 text-slate-600 py-0.5 px-2 rounded-full text-xs">
                                    {inquiries.length}
                                </span>
                            )}
                        </button>
                    </nav>
                </div>

                {activeTab === 'properties' && (
                    <div className="space-y-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <h2 className="text-2xl font-bold text-slate-800">Manage Properties</h2>
                            <Dialog open={isDialogOpen} onOpenChange={(open) => {
                                setIsDialogOpen(open);
                                if (!open) {
                                    setEditingProperty(null);
                                    resetForm();
                                }
                            }}>
                                <DialogTrigger asChild>
                                    <Button className="bg-slate-900 text-white hover:bg-slate-800">
                                        <Plus className="h-4 w-4 mr-2" /> Add Property
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>{editingProperty ? 'Edit Property' : 'Add New Property'}</DialogTitle>
                                    </DialogHeader>

                                    {/* ... (Tab buttons and Form remain same, just ensuring we don't break them) ... */}
                                    <div className="flex border-b mb-4 space-x-4">
                                        {['Overview', 'Specs', 'Features', 'Media'].map((tab) => (
                                            <button
                                                key={tab}
                                                type="button"
                                                onClick={() => setActiveFormTab(tab.toLowerCase())}
                                                className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeFormTab === tab.toLowerCase() ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-700'
                                                    }`}
                                            >
                                                {tab}
                                            </button>
                                        ))}
                                    </div>

                                    <form onSubmit={handleSaveProperty} className="space-y-6 py-2">
                                        {activeFormTab === 'overview' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Property Title</label>
                                                    <Input placeholder="e.g. Luxury 3BHK Apartment" value={propertyForm.title} onChange={e => setPropertyForm({ ...propertyForm, title: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Price (₹)</label>
                                                    <Input placeholder="Price" type="number" value={propertyForm.price} onChange={e => setPropertyForm({ ...propertyForm, price: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Location / Address</label>
                                                    <Input placeholder="Location" value={propertyForm.location} onChange={e => setPropertyForm({ ...propertyForm, location: e.target.value })} required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Project Name (Optional)</label>
                                                    <Input placeholder="Project Name" value={propertyForm.project} onChange={e => setPropertyForm({ ...propertyForm, project: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Property Type</label>
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={propertyForm.type} onChange={e => setPropertyForm({ ...propertyForm, type: e.target.value })}>
                                                        <option value="Flat">Flat</option>
                                                        <option value="Plot">Plot</option>
                                                        <option value="Villa">Villa</option>
                                                        <option value="Commercial">Commercial</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Status</label>
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={propertyForm.status} onChange={e => setPropertyForm({ ...propertyForm, status: e.target.value })}>
                                                        <option value="Available">Available</option>
                                                        <option value="Sold">Sold</option>
                                                        <option value="Under Offer">Under Offer</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}

                                        {activeFormTab === 'specs' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Bedrooms</label>
                                                    <Input type="number" placeholder="e.g. 3" value={propertyForm.bedrooms} onChange={e => setPropertyForm({ ...propertyForm, bedrooms: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Bathrooms</label>
                                                    <Input type="number" placeholder="e.g. 2" value={propertyForm.bathrooms} onChange={e => setPropertyForm({ ...propertyForm, bathrooms: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Balconies</label>
                                                    <Input type="number" placeholder="e.g. 1" value={propertyForm.balconies} onChange={e => setPropertyForm({ ...propertyForm, balconies: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Floor No.</label>
                                                    <Input placeholder="e.g. 3rd of 5" value={propertyForm.floorNumber} onChange={e => setPropertyForm({ ...propertyForm, floorNumber: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Super Area</label>
                                                    <Input placeholder="e.g. 1500 sqft" value={propertyForm.superArea} onChange={e => setPropertyForm({ ...propertyForm, superArea: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Carpet Area</label>
                                                    <Input placeholder="e.g. 1200 sqft" value={propertyForm.carpetArea} onChange={e => setPropertyForm({ ...propertyForm, carpetArea: e.target.value })} />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Furnishing</label>
                                                    <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={propertyForm.furnishing} onChange={e => setPropertyForm({ ...propertyForm, furnishing: e.target.value })}>
                                                        <option value="Unfurnished">Unfurnished</option>
                                                        <option value="Semi-Furnished">Semi-Furnished</option>
                                                        <option value="Fully-Furnished">Fully-Furnished</option>
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Parking</label>
                                                    <Input placeholder="e.g. 1 Covered" value={propertyForm.parking} onChange={e => setPropertyForm({ ...propertyForm, parking: e.target.value })} />
                                                </div>
                                            </div>
                                        )}

                                        {activeFormTab === 'features' && (
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-slate-500">Property Age</label>
                                                        <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={propertyForm.propertyAge} onChange={e => setPropertyForm({ ...propertyForm, propertyAge: e.target.value })}>
                                                            <option value="New Launch">New Launch</option>
                                                            <option value="Resale">Resale</option>
                                                            <option value="Under Construction">Under Construction</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-xs font-semibold uppercase text-slate-500">Facing</label>
                                                        <Input placeholder="e.g. North-East" value={propertyForm.facing} onChange={e => setPropertyForm({ ...propertyForm, facing: e.target.value })} />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Amenities</label>
                                                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                                                        {amenitiesList.map(amenity => (
                                                            <div key={amenity} className="flex items-center space-x-2">
                                                                <input
                                                                    type="checkbox"
                                                                    id={`amenity-${amenity}`}
                                                                    checked={propertyForm.amenities?.includes(amenity)}
                                                                    onChange={() => toggleAmenity(amenity)}
                                                                    className="h-4 w-4 rounded border-slate-300"
                                                                />
                                                                <label htmlFor={`amenity-${amenity}`} className="text-sm cursor-pointer">{amenity}</label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {activeFormTab === 'media' && (
                                            <div className="space-y-4">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Description</label>
                                                    <textarea
                                                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm min-h-[100px]"
                                                        placeholder="Detailed description of the property..."
                                                        value={propertyForm.description}
                                                        onChange={e => setPropertyForm({ ...propertyForm, description: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Video / 360 View URL</label>
                                                    <div className="space-y-2">
                                                        <Input
                                                            placeholder="e.g. YouTube link or 360 tour URL"
                                                            value={propertyForm.videoUrl}
                                                            onChange={e => setPropertyForm({ ...propertyForm, videoUrl: e.target.value })}
                                                        />
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-xs text-slate-400 whitespace-nowrap">Or Upload Video:</span>
                                                            <Input
                                                                type="file"
                                                                accept="video/mp4,video/webm,video/ogg"
                                                                onChange={uploadVideoHandler}
                                                                className="cursor-pointer text-xs"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-xs font-semibold uppercase text-slate-500">Images</label>
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

                                                    {/* Image Previews */}
                                                    {propertyForm.images && propertyForm.images.length > 0 && (
                                                        <div className="grid grid-cols-4 gap-2 mt-4">
                                                            {(typeof propertyForm.images === 'string' ? propertyForm.images.split(',') : propertyForm.images).filter(url => url.trim() !== '').map((url, index) => (
                                                                <div key={index} className="relative aspect-video rounded-md overflow-hidden bg-slate-100 border group">
                                                                    <img src={url.trim()} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        <div className="pt-4 flex justify-end gap-2 border-t mt-4">
                                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                            <Button type="submit">Save Property</Button>
                                        </div>
                                    </form>
                                </DialogContent>
                            </Dialog>
                        </div>

                        {/* Properties Grid */}
                        {properties.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-lg border border-dashed">
                                <p className="text-slate-500 mb-2">No properties found.</p>
                                <Button variant="outline" onClick={() => setIsDialogOpen(true)}>Add Your First Property</Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {properties.map(property => (
                                    <div key={property._id} className="bg-white border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
                                        <div className="h-48 bg-slate-200 relative">
                                            {property.images && property.images.length > 0 ? (
                                                <img
                                                    src={property.images[0]}
                                                    alt={property.title}
                                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="secondary" className="h-8 w-8 bg-white/90 hover:bg-white" onClick={() => openEditModal(property)}>
                                                    <Edit className="h-4 w-4 text-slate-700" />
                                                </Button>
                                                <Button size="icon" variant="destructive" className="h-8 w-8" onClick={() => handleDeleteProperty(property._id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                            <div className="absolute bottom-2 left-2">
                                                <span className={`text-xs px-2 py-1 rounded font-medium shadow-sm ${property.status === 'Sold' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
                                                    {property.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="font-bold text-lg leading-tight line-clamp-1">{property.title}</h3>
                                            </div>
                                            <p className="text-sm text-slate-500 mb-3 flex items-center gap-1 truncate">
                                                {property.location}
                                            </p>
                                            <div className="flex justify-between items-center pt-3 border-t">
                                                <span className="font-bold text-xl text-slate-900">₹ {property.price ? property.price.toLocaleString('en-IN') : '0'}</span>
                                                <div className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded">
                                                    {property.bedrooms ? `${property.bedrooms} BHK` : property.type} | {property.area}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'inquiries' && (
                    <div>
                        <h2 className="text-2xl font-bold mb-6">Leads & Inquiries</h2>

                        <div className="space-y-8">
                            {/* Property Inquiries */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-700">Property Specific Inquiries</h3>
                                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-600 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Property Interest</th>
                                                <th className="px-6 py-3">Contact</th>
                                                <th className="px-6 py-3">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inquiries.filter(i => i.propertyId).map(inquiry => (
                                                <tr key={inquiry._id} className="border-b hover:bg-slate-50">
                                                    <td className="px-6 py-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                                                    <td className="px-6 py-4 text-blue-600 font-medium">{inquiry.propertyId?.title || 'Unknown Property'}</td>
                                                    <td className="px-6 py-4">
                                                        <div>{inquiry.email}</div>
                                                        <div className="text-slate-500">{inquiry.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs truncate" title={inquiry.message}>{inquiry.message}</td>
                                                </tr>
                                            ))}
                                            {inquiries.filter(i => i.propertyId).length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No property inquiries yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* General Inquiries */}
                            <div>
                                <h3 className="text-lg font-semibold mb-3 text-slate-700">General Contact Inquiries</h3>
                                <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-sm text-left">
                                        <thead className="bg-slate-100 text-slate-600 uppercase">
                                            <tr>
                                                <th className="px-6 py-3">Date</th>
                                                <th className="px-6 py-3">Name</th>
                                                <th className="px-6 py-3">Subject</th>
                                                <th className="px-6 py-3">Contact</th>
                                                <th className="px-6 py-3">Message</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {inquiries.filter(i => !i.propertyId).map(inquiry => (
                                                <tr key={inquiry._id} className="border-b hover:bg-slate-50">
                                                    <td className="px-6 py-4">{new Date(inquiry.createdAt).toLocaleDateString()}</td>
                                                    <td className="px-6 py-4 font-medium">{inquiry.name}</td>
                                                    <td className="px-6 py-4 text-slate-500 italic">General Contact</td>
                                                    <td className="px-6 py-4">
                                                        <div>{inquiry.email}</div>
                                                        <div className="text-slate-500">{inquiry.phone}</div>
                                                    </td>
                                                    <td className="px-6 py-4 max-w-xs truncate" title={inquiry.message}>{inquiry.message}</td>
                                                </tr>
                                            ))}
                                            {inquiries.filter(i => !i.propertyId).length === 0 && (
                                                <tr>
                                                    <td colSpan="5" className="px-6 py-8 text-center text-slate-500">No general inquiries yet.</td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default AdminDashboard;
