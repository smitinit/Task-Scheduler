import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 20, 2026</p>
        </div>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            1. Acceptance of Terms
          </h2>
          <p>
            By accessing and using the Task Scheduler application ("Service"),
            you accept and agree to be bound by the terms and provision of this
            agreement. If you do not agree to abide by the above, please do not
            use this service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">2. Use License</h2>
          <p>
            Permission is granted to temporarily download one copy of the
            materials (information or software) from the Task Scheduler for
            personal, non-commercial transitory viewing only. This is the grant
            of a license, not a transfer of title, and under this license you
            may not:
          </p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Modifying or copying the materials</li>
            <li>
              Using the materials for any commercial purpose or for any public
              display
            </li>
            <li>Attempting to modify any materials</li>
            <li>
              Removing any copyright or other proprietary notations from the
              materials
            </li>
            <li>
              Transferring the materials to another person or "mirroring" the
              materials on any other server
            </li>
            <li>
              Using the materials for any illegal purpose or in violation of any
              applicable laws or regulations
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">3. Disclaimer</h2>
          <p>
            The materials on the Task Scheduler website are provided on an 'as
            is' basis. Task Scheduler makes no warranties, expressed or implied,
            and hereby disclaims and negates all other warranties including,
            without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">4. Limitations</h2>
          <p>
            In no event shall Task Scheduler or its suppliers be liable for any
            damages (including, without limitation, damages for loss of data or
            profit, or due to business interruption) arising out of the use or
            inability to use the materials on the Task Scheduler website, even
            if Task Scheduler or an authorized representative has been notified
            orally or in writing of the possibility of such damage.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            5. Accuracy of Materials
          </h2>
          <p>
            The materials appearing on the Task Scheduler website could include
            technical, typographical, or photographic errors. Task Scheduler
            does not warrant that any of the materials in its website are
            accurate, complete, or current. Task Scheduler may make changes to
            the materials contained on its website at any time without notice.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">6. Links</h2>
          <p>
            Task Scheduler has not reviewed all of the sites linked to its
            website and is not responsible for the contents of any such linked
            site. The inclusion of any link does not imply endorsement by Task
            Scheduler of the site; use of any such linked website is at the
            user's own risk.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">7. Modifications</h2>
          <p>
            Task Scheduler may revise these terms of service for its website at
            any time without notice. By using this website, you are agreeing to
            be bound by the then current version of these terms of service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in
            accordance with the laws of the jurisdiction in which Task Scheduler
            operates, and you irrevocably submit to the exclusive jurisdiction
            of the courts in that location.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">9. User Accounts</h2>
          <p>
            If you create an account with Task Scheduler, you are responsible
            for maintaining the confidentiality of your account information and
            password, and you are responsible for all activities that occur
            under your account. You agree to notify Task Scheduler immediately
            of any unauthorized use of your account.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            10. Prohibited Conduct
          </h2>
          <p>Users agree not to use the Service in any way that:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Violates any applicable law or regulation</li>
            <li>Infringes upon intellectual property rights</li>
            <li>Contains malware or harmful code</li>
            <li>Harasses, threatens, or defames others</li>
            <li>Attempts to gain unauthorized access to the Service</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">
            11. Contact Information
          </h2>
          <p>
            If you have any questions about these Terms of Service, please
            contact us at patelsmit090305@gmail.com
          </p>
        </section>
      </div>
    </div>
  )
}
