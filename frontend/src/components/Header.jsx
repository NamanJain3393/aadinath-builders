import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();

    const isAdmin = location.pathname.startsWith('/admin');

    if (isAdmin && location.pathname !== '/admin') return null; // Don't show public header on admin dashboard

    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
                <Link to="/" className="flex items-center gap-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                        Aadinath Builders
                    </span>
                </Link>
                <nav className="hidden md:flex items-center gap-6">
                    <Link to="/" className="text-sm font-medium hover:text-primary">
                        Home
                    </Link>
                    <Link to="/properties" className="text-sm font-medium hover:text-primary">
                        Properties
                    </Link>
                    <Link to="/contact" className="text-sm font-medium hover:text-primary">
                        Contact
                    </Link>
                    <Button asChild variant="default" className="bg-yellow-600 hover:bg-yellow-700">
                        <Link to="/contact">Enquire Now</Link>
                    </Button>
                </nav>
                <div className="md:hidden">
                    <button onClick={toggleMenu} className="p-2">
                        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>
            {isOpen && (
                <div className="md:hidden border-t p-4 space-y-4 bg-background">
                    <Link
                        to="/"
                        className="block text-sm font-medium hover:text-primary"
                        onClick={toggleMenu}
                    >
                        Home
                    </Link>
                    <Link
                        to="/properties"
                        className="block text-sm font-medium hover:text-primary"
                        onClick={toggleMenu}
                    >
                        Properties
                    </Link>
                    <Link
                        to="/contact"
                        className="block text-sm font-medium hover:text-primary"
                        onClick={toggleMenu}
                    >
                        Contact
                    </Link>
                </div>
            )}
        </header>
    );
};

export default Header;
