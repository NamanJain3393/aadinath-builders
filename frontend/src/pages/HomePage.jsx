import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Building2, Home, MapPin, Search } from 'lucide-react';

import { useEffect } from 'react';
import axios from '@/api/axios';

const HomePage = () => {
    useEffect(() => {
        const incrementVisit = async () => {
            try {
                await axios.post('/api/visits');
            } catch (error) {
                console.error('Failed to track visit', error);
            }
        };
        incrementVisit();
    }, []);

    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center bg-slate-900 text-white overflow-hidden">
                <div className="absolute inset-0 bg-black/50 z-10" />
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80")' }}
                />

                <div className="relative z-20 container px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        Building Trust. <span className="text-yellow-500">Delivering Homes.</span>
                    </h1>
                    <p className="text-lg md:text-xl text-slate-200 mb-8 max-w-2xl mx-auto">
                        Discover premium residential and commercial properties tailored to your lifestyle and budget.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" className="bg-yellow-600 hover:bg-yellow-700 text-white" asChild>
                            <Link to="/properties">View Properties</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="border-white text-black hover:bg-white/10 hover:text-white" asChild>
                            <Link to="/contact">Contact Us</Link>
                        </Button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 bg-slate-50">
                <div className="container px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Choose Us?</h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">We bring decades of experience and a commitment to quality in every project we undertake.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600">
                                <Home className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Premium Properties</h3>
                            <p className="text-slate-600">Hand-picked properties that meet the highest standards of quality and design.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Prime Locations</h3>
                            <p className="text-slate-600">Strategically located projects ensuring connectivity and convenience.</p>
                        </div>
                        <div className="bg-white p-8 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
                            <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center mb-6 text-yellow-600">
                                <Building2 className="h-6 w-6" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Transparent Deals</h3>
                            <p className="text-slate-600">Complete transparency in paperwork and transactions. No hidden costs.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
