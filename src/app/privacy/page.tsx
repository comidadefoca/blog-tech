import FadeIn from "@/components/FadeIn";
import Link from "next/link";

export default function PrivacyPolicyPage() {
    return (
        <div className="w-full flex flex-col pt-10 pb-24 px-6 max-w-3xl mx-auto min-h-[60vh]">
            <FadeIn delay={100} direction="up">
                {/* Header Section */}
                <div className="mb-12 border-b border-zinc-800 pb-12">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-lg text-zinc-400 font-medium">
                        Last updated: October 24, 2024
                    </p>
                </div>

                {/* Content */}
                <div className="prose prose-lg prose-invert max-w-none text-zinc-400 prose-headings:font-serif prose-headings:text-white prose-a:text-tribune-accent">

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">1. Introduction</h2>
                    <p>
                        Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.
                    </p>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">2. Information we collect</h2>
                    <p>
                        We may collect information about you in a variety of ways. The information we may collect on the Site includes:
                    </p>
                    <ul>
                        <li><strong>Personal Data:</strong> Personally identifiable information, such as your name, shipping address, email address, and telephone number that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site.</li>
                        <li><strong>Derivative Data:</strong> Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">3. Use of your information</h2>
                    <p>
                        Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:
                    </p>
                    <ul>
                        <li>Create and manage your account.</li>
                        <li>Deliver targeted advertising, coupons, newsletters, and other information regarding promotions and the Site to you.</li>
                        <li>Email you regarding your account or order.</li>
                        <li>Fulfill and manage purchases, orders, payments, and other transactions related to the Site.</li>
                    </ul>

                    <h2 className="text-3xl font-bold mt-10 mb-6 font-sans text-white">4. Contact Us</h2>
                    <p>
                        If you have questions or comments about this Privacy Policy, please contact us at: <a href="mailto:privacy@tribuneblog.com">privacy@tribuneblog.com</a>
                    </p>
                </div>
            </FadeIn>
        </div>
    );
}
