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
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">{property.title}</h1>
                                <div className="flex items-center text-slate-500 gap-1">
                                    <MapPin className="h-4 w-4" />
                                    {property.location}
                                </div>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">₹ {property.price.toLocaleString('en-IN')}</div>
                                <div className="text-sm text-slate-500">{property.status}</div>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-lg border mb-6">
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Type</div>
                                <div className="font-semibold">{property.type}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Area</div>
                                <div className="font-semibold">{property.area}</div>
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Bedrooms</div>
                                <div className="font-semibold">N/A</div> {/* Placeholder */}
                            </div>
                            <div>
                                <div className="text-slate-500 text-xs uppercase tracking-wider">Updated</div>
                                <div className="font-semibold">{new Date(property.updatedAt).toLocaleDateString()}</div>
                            </div>
                        </div>

                        <div>
                            <h2 className="text-xl font-bold mb-3">Description</h2>
                            <p className="text-slate-600 leading-relaxed whitespace-pre-line">{property.description}</p>
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
