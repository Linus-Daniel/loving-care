import { Badge } from '@/components/ui/badge';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
      <div className="text-center mb-10">
        <Badge variant="outline" className="mb-3 border-teal text-teal">Legal</Badge>
        <h1 className="text-3xl lg:text-4xl font-display font-bold text-green-500">Terms & Conditions</h1>
        <p className="text-muted-foreground mt-2">Last updated: May 1, 2024</p>
      </div>

      <div className="prose prose-sm max-w-none text-muted-foreground space-y-6">
        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">1. Acceptance of Terms</h2>
          <p>By accessing and using the Loving Family Daycare website, parent portal, and services, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">2. Enrollment and Registration</h2>
          <p>Enrollment in our daycare programs is subject to availability and completion of all required documentation. We reserve the right to decline enrollment if:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Required documents are not provided or are incomplete</li>
            <li>The child's needs exceed our care capabilities</li>
            <li>There are no available spots in the requested program</li>
            <li>Payment obligations are not met</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">3. Fees and Payments</h2>
          <p>Tuition fees are due monthly in advance. Late payments may incur additional charges. We reserve the right to suspend services for accounts with outstanding balances exceeding 30 days.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">4. Attendance and Pick-up</h2>
          <p>Parents must adhere to our operating hours. Children must be picked up by the designated closing time. Repeated late pick-ups may result in additional fees or termination of services.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">5. Health and Safety</h2>
          <p>Parents must inform us of any medical conditions, allergies, or special needs. Children showing signs of illness should be kept at home. We follow strict health protocols to ensure the wellbeing of all children and staff.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">6. Photography and Media</h2>
          <p>We may photograph children during activities for educational and promotional purposes. Parents can opt out of promotional photography by submitting a written request to the administration.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">7. Termination</h2>
          <p>Either party may terminate the daycare agreement with one month's written notice. We reserve the right to terminate immediately in cases of non-payment, repeated policy violations, or behavior that endangers others.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">8. Liability</h2>
          <p>While we take every precaution to ensure child safety, parents acknowledge that minor injuries may occur during normal play activities. We are not liable for incidents arising from undisclosed medical conditions or failure to follow our policies.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">9. Changes to Terms</h2>
          <p>We may update these Terms and Conditions from time to time. Changes will be posted on this page with an updated effective date. Continued use of our services constitutes acceptance of the revised terms.</p>
        </section>

        <section>
          <h2 className="text-lg font-display font-semibold text-green-500">10. Contact</h2>
          <p>For questions about these Terms and Conditions, please contact us at legal@lovingfamily.ng.</p>
        </section>
      </div>
    </div>
  );
}
