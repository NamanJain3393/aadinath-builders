import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { MapPin, Maximize, Home } from 'lucide-react';

const PropertyDetailsPage = () => {
    const { id } = useParams();
    const [property, setProperty] = useState(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: 'I am interested in this property. Please contact me.'
    });

    useEffect(() => {
        const fetchProperty = async () => {
            try {
                const { data } = await axios.get(`/api/properties/${id}`);
                setProperty(data);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
                toast.error('Failed to load property details');
            }
        };

        fetchProperty();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/inquiries', {
                ...formData,
                propertyId: id
            });
            toast.success('Inquiry sent successfully!');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Failed to send inquiry.');
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen">Loading...</div>;
    if (!property) return <div className="text-center py-20">Property not found</div>;

    return (
        <div className="container px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column - Details */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="rounded-xl overflow-hidden bg-slate-100 h-[400px] relative">
                        {property.images && property.images.length > 0 ? (
                            <img
                                src={property.images[0]}
                                alt={property.title}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">No Image Available</div>
                        )}
                    </div>

                    <div>
                        <div>
                            <div className="flex flex-col md:flex-row justify-between items-start mb-6 gap-4">
                                <div>
                                    <h1 className="text-3xl font-bold mb-2 text-slate-900">{property.title}</h1>
                                    <div className="flex items-center text-slate-500 gap-1 mb-1">
                                        <MapPin className="h-4 w-4" />
                                        {property.location}
                                    </div>
                                    {property.project && (
                                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded w-fit mt-2">
                                            Project: {property.project}
                                        </div>
                                    )}
                                </div>
                                <div className="text-left md:text-right">
                                    <div className="text-3xl font-bold text-slate-900">₹ {property.price.toLocaleString('en-IN')}</div>
                                    <div className="flex items-center gap-2 mt-1 md:justify-end">
                                        <span className={`text-xs px-2 py-1 rounded font-medium ${property.status === 'Sold' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                            {property.status}
                                        </span>
                                        <span className="text-xs px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">{property.propertyAge}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Overview */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-white rounded-xl border shadow-sm mb-8">
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Bedrooms</div>
                                    <div className="font-bold text-slate-900">{property.bedrooms ? `${property.bedrooms} BHK` : 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Super Area</div>
                                    <div className="font-bold text-slate-900">{property.superArea || property.area || 'N/A'}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Type</div>
                                    <div className="font-bold text-slate-900">{property.type}</div>
                                </div>
                                <div>
                                    <div className="text-slate-400 text-xs uppercase tracking-wider font-semibold mb-1">Furnishing</div>
                                    <div className="font-bold text-slate-900">{property.furnishing}</div>
                                </div>
                            </div>

                            {/* Detailed Specs */}
                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-4 text-slate-900">Property Specifications</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8 text-sm">
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Bathrooms</span>
                                        <span className="font-medium">{property.bathrooms || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Balconies</span>
                                        <span className="font-medium">{property.balconies || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Floor</span>
                                        <span className="font-medium">{property.floorNumber || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Parking</span>
                                        <span className="font-medium">{property.parking || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Carpet Area</span>
                                        <span className="font-medium">{property.carpetArea || '-'}</span>
                                    </div>
                                    <div className="flex justify-between border-b pb-2">
                                        <span className="text-slate-500">Facing</span>
                                        <span className="font-medium">{property.facing || '-'}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Amenities */}
                            {property.amenities && property.amenities.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold mb-4 text-slate-900">Amenities</h2>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {property.amenities.map((amenity, index) => (
                                            <div key={index} className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg">
                                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                                <span className="text-sm font-medium text-slate-700">{amenity}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="mb-8">
                                <h2 className="text-xl font-bold mb-3 text-slate-900">Description</h2>
                                <p className="text-slate-600 leading-relaxed whitespace-pre-line text-sm md:text-base">{property.description}</p>
                            </div>

                            {/* Video Tour */}
                            {property.videoUrl && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-bold mb-4 text-slate-900">Video Tour / 360° View</h2>
                                    <div className="aspect-video bg-black rounded-lg overflow-hidden relative">
                                        {property.videoUrl.includes('youtube.com') || property.videoUrl.includes('youtu.be') ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={property.videoUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'www.youtube.com/embed/')}
                                                title="Property Video"
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            ></iframe>
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-white">
                                                <a href={property.videoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline">
                                                    <Maximize className="h-6 w-6" />
                                                    View 360° / Video Tour
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column - Inquiry Form */}
                <div className="lg:col-span-1">
                    <div className="bg-card border rounded-xl p-6 shadow-sm sticky top-24">
                        <h3 className="text-xl font-bold mb-4">Interested?</h3>
                        <p className="text-sm text-slate-500 mb-6">Fill out the form below and we'll get back to you shortly.</p>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <Input
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    type="email"
                                    placeholder="Email Address"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <Input
                                    type="tel"
                                    placeholder="Phone Number"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                    placeholder="Message"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">Send Inquiry</Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PropertyDetailsPage;
