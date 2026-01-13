import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-slate-900 text-slate-50 py-12">
            <div className="container px-4 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-bold mb-4 bg-gradient-to-r from-yellow-600 to-yellow-400 bg-clip-text text-transparent">
                            Aadinath Builders
                        </h3>
                        <p className="text-slate-400 text-sm">
                            Building Trust. Delivering Homes. We help you find your dream property with transparency and trust.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li><Link to="/" className="hover:text-yellow-500">Home</Link></li>
                            <li><Link to="/properties" className="hover:text-yellow-500">Properties</Link></li>
                            <li><Link to="/contact" className="hover:text-yellow-500">Contact</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-bold mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-slate-400">
                            <li>Phone: +91 9756970500, +91 7248643393, +916395675559</li>
                            <li>Email: infoaadinathbuilders@gmail.com</li>
                            <li>Address: Indra Udhyan Marg, Vikas Nagar, Dehradun</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-xs text-slate-500">
                    © {new Date().getFullYear()} Aadinath Builders. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
