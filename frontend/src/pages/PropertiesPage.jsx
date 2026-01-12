import { useState, useEffect } from 'react';
import axios from '@/api/axios';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

const PropertiesPage = () => {
    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data } = await axios.get(`/api/properties?keyword=${searchTerm}`);
                setProperties(data.properties);
                setLoading(false);
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };

        fetchProperties();
    }, [searchTerm]);

    const handleSearch = (e) => {
        e.preventDefault();
        // search is handled by useEffect dependency
    };

    return (
        <div className="container px-4 py-8 min-h-screen">
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold">Featured Properties</h1>
                <form onSubmit={handleSearch} className="flex gap-2 w-full md:w-auto">
                    <Input
                        type="text"
                        placeholder="Search location or title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full md:w-80"
                    />
                    <Button type="submit" size="icon">
                        <Search className="h-4 w-4" />
                    </Button>
                </form>
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <div key={property._id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all bg-card">
                            <div className="h-48 bg-slate-200 relative">
                                {property.images && property.images.length > 0 ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                                    {property.type}
                                </div>
                            </div>
                            <div className="p-4">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-lg font-bold line-clamp-1">{property.title}</h3>
                                    <span className={cn("text-xs px-2 py-1 rounded font-medium", property.status === 'Sold' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600')}>
                                        {property.status}
                                    </span>
                                </div>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2">{property.location}</p>
                                <div className="flex justify-between items-center mt-auto">
                                    <span className="text-xl font-bold text-primary">₹ {property.price.toLocaleString('en-IN')}</span>
                                    <Button asChild size="sm" variant="outline">
                                        <Link to={`/properties/${property._id}`}>View Details</Link>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {properties.length === 0 && (
                        <div className="col-span-full text-center py-12 text-slate-500">
                            No properties found matching your search.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PropertiesPage;
