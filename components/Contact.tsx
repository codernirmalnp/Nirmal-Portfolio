"use client"

import React, { useState } from 'react';
import { contactData } from '@/lib/siteData';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (response.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch {
            setStatus('error');
        }
    };

    return (
        <div id="contact" className="container max-w-[1320px] mx-auto px-5 md:px-10 xl:px-5 pt-24 xl:pt-28">
            <div className="w-full lg:flex space-y-6 lg:space-y-0">
                <div className="w-full lg:w-1/3">
                    <h6 className="pl-[20px] relative font-outfit font-medium text-sm uppercase tracking-wider text-white/40 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:border-2 before:border-white/30">{contactData.mainData.title}</h6>
                    <h2 className="font-outfit font-medium text-4xl md:text-5xl lg:text-6xl text-white mt-2">{contactData.mainData.title2} <span className="bg-themeGradient bg-clip-text text-transparent">{contactData.mainData.title2Span}</span></h2>
                </div>
                <div className="w-full lg:w-2/3">
                    {/* Contact Info */}
                    <div className="flex flex-wrap">
                        <div className="w-full sm:w-1/2">
                            <h6 className="font-outfit font-medium uppercase text-sm tracking-wider text-white mb-2">Email:</h6>
                            <h3 className="font-outfit font-medium text-2xl lg:text-3xl text-white break-all">{contactData.mainData.email}</h3>
                        </div>
                        {/* Removed phone number section */}
                    </div>
                    {/* Contact Form */}
                    <div className="mt-8 lg:text-right">
                        <form className="space-y-4" method="post" id="contactform" onSubmit={handleSubmit}>
                            <div className="flex space-x-4">
                                <div className="w-1/2">
                                    <input
                                        className="w-full bg-darkBg px-5 py-4 rounded-lg placeholder:text-white/40 text-white/70 focus:outline-none"
                                        type="text"
                                        id="name"
                                        name="name"
                                        placeholder="Name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required />
                                </div>
                                <div className="w-1/2">
                                    <input
                                        className="w-full bg-darkBg px-5 py-4 rounded-lg placeholder:text-white/40 text-white/70 focus:outline-none"
                                        type="email"
                                        id="email"
                                        name="email"
                                        placeholder="E-Mail"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required />
                                </div>
                            </div>
                            <input
                                className="w-full bg-darkBg px-5 py-4 rounded-lg placeholder:text-white/40 text-white/70 focus:outline-none"
                                type="text"
                                id="subject"
                                name="subject"
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required />
                            <textarea className="w-full bg-darkBg px-5 py-4 rounded-lg placeholder:text-white/40 text-white/70 h-[160px] focus:outline-none" name="message" id="message" placeholder="Message" value={formData.message} onChange={handleChange} ></textarea>
                            <button className={`inline-block relative group overflow-hidden bg-white/15 px-7 py-3 pr-11 rounded-3xl font-outfit font-medium uppercase text-sm tracking-wider text-white before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:top-1/2 after:right-[28px] after:-translate-y-1/2 after:bg-white after:w-[5px] after:h-[5px] after:rounded-full after:transition-all after:duration-[60ms] hover:after:opacity-40 hover:after:scale-[2.7] ${status === 'loading' ? 'non-disabled' : ''}`} type="submit" disabled={status === 'loading'}>
                                <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="Send Message">Send Message</span>
                            </button>
                        </form>
                        {/* Submit result */}
                        <div className="submit-result">
                            {status === 'success' && (
                                <span id="success" className="transition duration-200 ease-out text-green-700">Thank you! Your Message has been sent.</span>
                            )}
                            {status === 'error' && (
                                <span id="error" className="transition duration-200 ease-out text-red-600">Something went wrong. Please try again!</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
