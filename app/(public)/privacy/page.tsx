import { Badge } from '@/components/ui/badge';

export default function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-3 border-teal text-teal">Legal</Badge>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-green">Privacy Policy</h1>
        <p className="text-muted-foreground mt-2">Last updated: May 1, 2024</p>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-lg font-display font-semibold text-green">1. Introduction</h2>
          <p>Loving Family Daycare ("we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our parent portal, or engage with our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">2. Information We Collect</h2>
          <p>We may collect personal information including but not limited to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Parent/guardian names, contact details, and identification information</li>
            <li>Child information including name, date of birth, medical history, and educational records</li>
            <li>Payment and billing information</li>
            <li>Usage data and analytics when you use our digital platforms</li>
            <li>Communications between parents and staff through our messaging system</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">3. How We Use Your Information</h2>
          <p>We use the collected information to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Provide and manage daycare services for your child</li>
            <li>Process payments and maintain billing records</li>
            <li>Communicate with parents about their child's progress, events, and important updates</li>
            <li>Ensure the safety, health, and wellbeing of all children in our care</li>
            <li>Improve our services and website experience</li>
            <li>Comply with legal and regulatory requirements</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">4. Information Sharing</h2>
          <p>We do not sell or rent your personal information to third parties. We may share information with:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Authorized staff members who need access to perform their duties</li>
            <li>Healthcare providers in case of medical emergencies</li>
            <li>Service providers who assist with payment processing and technical operations</li>
            <li>Regulatory authorities when required by law</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">5. Data Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, access controls, and regular security assessments.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">6. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Access your personal information</li>
            <li>Request correction of inaccurate information</li>
            <li>Request deletion of your data (subject to legal retention requirements)</li>
            <li>Object to certain processing activities</li>
            <li>Request a copy of your data in a portable format</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green">7. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at privacy@lovingfamily.ng or through our contact page.</p>
        </section>
      </div>
    </div>
  );
}
