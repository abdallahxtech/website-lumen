import type { Metadata } from "next";
import { PageHero } from "@/components/ui";
import { site, officeAddressLines } from "@/content/site";
import { pageMeta } from "@/lib/seo";

export const metadata: Metadata = pageMeta({ title: "Privacy policy", description: "How Lumen Realty collects, uses and protects personal information.", path: "/privacy-policy" });

/**
 * TEMPLATE — requires review by a UAE-qualified lawyer before launch.
 * It describes only what this website actually does today: enquiry forms stored
 * on Lumen's server, optional CRM forwarding, no analytics or advertising cookies.
 * Update it whenever tracking or integrations change.
 */
export default function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Legal" title="Privacy policy" crumbs={[{ href: "/", label: "Home" }, { label: "Privacy policy" }]} intro="Last updated 20 October 2026. Draft pending legal review." />
      <section className="on-ivory band-tight">
        <div className="wrap prose-lumen">
          <h2>Who we are</h2>
          <p>{site.name} is a real estate brokerage based at {officeAddressLines.join(", ")}. We are responsible for the personal information you give us through this website.</p>
          <h2>What we collect</h2>
          <p>When you send an enquiry we collect your name, mobile number and, if you provide them, your email address, message and property preferences. We also record the page you sent it from and any campaign parameters in the link you followed, so we know how you found us.</p>
          <h2>How we use it</h2>
          <p>We use your details to respond to your enquiry and to provide the services you ask for. If you tick the optional box, we will also send you occasional market updates; you can opt out at any time.</p>
          <h2>Where it is stored</h2>
          <p>Enquiries are stored securely on our servers and may be passed to the customer relationship management system our advisors use. Access is limited to Lumen staff who need it.</p>
          <h2>Cookies and analytics</h2>
          <p>This website currently uses no advertising or analytics cookies. If that changes, we will ask for your consent first and update this policy.</p>
          <h2>How long we keep it</h2>
          <p>We keep enquiry records for as long as needed to serve you and to meet our legal and regulatory obligations, then delete or anonymise them.</p>
          <h2>Your rights</h2>
          <p>Under UAE data protection law you may ask to access, correct or delete your personal data, or object to its use for marketing. Contact us on {site.whatsapp.display} or visit our office to make a request.</p>
        </div>
      </section>
    </>
  );
}
