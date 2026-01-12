import { useState } from 'react';
import axios from '@/api/axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Mail, Phone, MapPin } from 'lucide-react';

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/api/inquiries', formData); // General inquiry
            toast.success('Message sent successfully!');
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            toast.error('Failed to send message.');
        }
    };

    return (
        <div className="container px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
                <p className="text-slate-600 max-w-2xl mx-auto">Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
                <div className="space-y-8">
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                            <MapPin className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Our Office</h3>
                            <p className="text-slate-600">Indra Udhyan Marg, Vikas Nagar,<br />Dehradun Uttarakhand 248198
                            </p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                            <Phone className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Phone</h3>
                            <p className="text-slate-600">+91 9756970500</p>
                            <p className="text-slate-600">+91 7248643393</p>
                            <p className="text-slate-600">+91 6395675559</p>
                            <p className="text-slate-500 text-sm">Mon-Sat from 8am to 5pm</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-lg text-primary">
                            <Mail className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold mb-1">Email</h3>
                            <p className="text-slate-600">info@aadinathbuilders.com</p>
                        </div>
                    </div>
                </div>

                <div className="bg-card border rounded-xl p-8 shadow-sm">
                    <h2 className="text-2xl font-bold mb-6">Send Message</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    placeholder="Name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="col-span-2 md:col-span-1">
                                <Input
                                    placeholder="Phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div>
                            <Input
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <textarea
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[150px]"
                                placeholder="How can we help you?"
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                required
                            />
                        </div>
                        <Button type="submit" className="w-full">SendMessage</Button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
