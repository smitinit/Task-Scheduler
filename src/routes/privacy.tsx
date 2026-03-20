import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
})

function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 20, 2026</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Task Scheduler ("we," "us," or "Company") operates the Task
            Scheduler website. This page informs you of our policies regarding
            the collection, use, and disclosure of personal data when you use
            our Service and the choices you have associated with that data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            2. Information Collection and Use
          </h2>
          <p>
            We collect several different types of information for various
            purposes to provide and improve our Service to you.
          </p>

          <h3 className="text-xl font-semibold mt-6 mb-3">
            Types of Data Collected:
          </h3>

          <h4 className="font-semibold mt-4 mb-2">Personal Data:</h4>
          <ul className="list-disc list-inside space-y-2">
            <li>Email address</li>
            <li>First name and last name</li>
            <li>Cookies and Usage Data</li>
            <li>Task and schedule information you create</li>
          </ul>

          <h4 className="font-semibold mt-4 mb-2">Usage Data:</h4>
          <p>
            When you access the Service by or through a mobile device, we may
            collect certain information automatically, including, but not
            limited to:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-2">
            <li>Type of mobile device</li>
            <li>Mobile device unique ID</li>
            <li>Mobile operating system</li>
            <li>Type of mobile Internet browser</li>
            <li>Unique device identifiers</li>
            <li>Information about how you interact with our Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Use of Data</h2>
          <p>Task Scheduler uses the collected data for various purposes:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>To provide and maintain our Service</li>
            <li>To notify you about changes to our Service</li>
            <li>
              To allow you to participate in interactive features of our Service
            </li>
            <li>To provide customer support</li>
            <li>
              To gather analysis or valuable information so that we can improve
              our Service
            </li>
            <li>To monitor the usage of our Service</li>
            <li>To detect, prevent and address technical issues</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Security of Data</h2>
          <p>
            The security of your data is important to us but remember that no
            method of transmission over the Internet or method of electronic
            storage is 100% secure. While we strive to use commercially
            acceptable means to protect your Personal Data, we cannot guarantee
            its absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Communication Preferences
          </h2>
          <p>
            We may send you emails regarding your account, including
            notifications about your tasks, security alerts, and promotional
            content. You can opt-out of promotional emails at any time by
            clicking the unsubscribe link in any marketing email we send.
            However, we will continue to send you service-related announcements
            as needed.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            6. Third-Party Services
          </h2>
          <p>
            Our Service may contain links to other sites that are not operated
            by us. If you click on a third-party link, you will be directed to
            that third party's site. We strongly advise you to review the
            Privacy Policy of every site you visit. We have no control over and
            assume no responsibility for the content, privacy policies, or
            practices of any third-party sites or services.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            7. Google OAuth Authentication
          </h2>
          <p>
            We use Google OAuth for authentication purposes. When you sign in
            using Google OAuth, you are allowing us to collect your Google
            account information (email address and name). Google is not
            responsible for our privacy practices. Please review Google's
            Privacy Policy for more information on how they handle your data.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Cookies</h2>
          <p>
            We use cookies to enhance your experience on our Service. Cookies
            are small data files placed on your device that help us remember
            your preferences and track your usage patterns. You can instruct
            your browser to refuse all cookies or to indicate when a cookie is
            being sent.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
          <p>
            Our Service does not address anyone under the age of 18
            ("Children"). We do not knowingly collect personally identifiable
            information from anyone under 18. If you are a parent or guardian
            and you are aware that your child has provided us with Personal
            Data, please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Changes to This Privacy Policy
          </h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page
            and updating the "Last updated" date at the top of this Privacy
            Policy.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@taskscheduler.com
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">12. Data Deletion</h2>
          <p>
            You have the right to request deletion of your personal data and
            account at any time. To request account deletion, please contact us
            at patelsmit090305@gmail.com with your account information. We will
            process your request within 30 days.
          </p>
        </section>
      </div>
    </div>
  )
}
