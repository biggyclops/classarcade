# Next Chapter

A ClassArcade browser game for graduating seniors and Individual Instruction classes.

## Implemented

- Character/name/background selection; five starting scenarios, quick and ongoing modes; guided/challenge support.
- Town with six accessible location buttons; employment eligibility and scenario-based schedule checks.
- Six-category planner with take-home pay, expenses, monthly surplus/shortfall, upfront costs, and six-month projection. Draft choices never spend money. Commit runs calculations and short explanations for each change.
- Deposits and car down payments; amortized example payments; insurance/fuel/maintenance; tuition; withheld-pay estimate; monthly events, debt recovery, goals and learning history.
- Built-in calculator without eval, sentence starters, read-aloud, keyboard controls, responsive layout, teacher-mutated sound/music settings, no countdown by default.
- Invitation-only multi-teacher accounts, private class reports and CSV, student class/nickname/PIN registration/resume, teacher PIN reset, owner-issued password-reset links, class pause and optional time limit.
- Teacher-approved class boards, bilateral class connections, private friend-code requests, player acceptance and both teachers' approval for cross-class partnerships. Only shared payment status is exposed to partners.
- Shared two-bedroom rent payments, cover-unpaid-rent choice, and reimbursement at month settlement. Other players are never generated as fake roommates.
- Google Maps directions links for selected character locations; no student home location/GPS is requested.

## External services and deliberate limits

All built-in listings are fictional teaching examples; they are never presented as current listings. A teacher can import permitted JSON listing snapshots with source URLs. New games freeze their listing snapshot; refreshes do not replace an existing student's selected listings.

A RentCast adapter is provided for licensed rental data (`RENTCAST_KEY`); CareerOneStop credentials (`CAREERONESTOP_TOKEN`, `CAREERONESTOP_USER`) can fetch job leads, but missing salaries/schedules must be verified/imported, never invented. Vehicle listings currently require teacher snapshot import. These provider credentials are not configured; no live-provider success is claimed. Google Maps links work without a key; embedded Google Maps and automatic route validation are not enabled. Current built-in route checks use clearly labeled fictional travel estimates, not verified Google transit schedules.

Automated email delivery is not configured. The owner generates email-bound private invitation and password-reset links and shares them manually. This app does not send email or expose open teacher registration. Do not place provider credentials in GitHub or browser code.

Withholding is an illustrative flat 20%, not a personalized payroll tax calculation. Insurance, car depreciation, housing deposits and transport schedules are simplified teaching assumptions. Health coverage is a scenario assumption, not an eligibility determination. Six-month projections assume fixed costs and exclude unpredictable events. No grades are assigned from wealth, salary, or chance events; reports provide evidence for teacher judgment.

Time limits count elapsed time from character creation, including time away, and are off by default. Pause prevents game decisions; it is not a stopwatch pause. Teacher mute/pause updates reach active student tabs on the next 15-second refresh.

## Operations

Source lives in the ClassArcade GitHub repository; no duplicate file-library copy is needed. The existing Sites project retains its ID and public audience, adds D1 binding `DB`, and serves the same launcher/assets plus `/api/next-chapter`.

Schema is in `next-chapter/server/schema.sql`, with initial bounded migration under `drizzle/`. Never edit an applied migration; append later migrations. Local preview data is separate. Use the owner setup link once, choose your own credentials, create a class, and invite additional teachers in Account & invitations. Keep setup/reset links private.

## Design and verification

Primary reference: generated Next Chapter full desktop screen. Production town: separate generated autumn Lowell-inspired town illustration. UI text/controls remain native HTML/React, not baked into an image. Model and API tests cover financial projections, deposits, wrong-answer retries, recoverable debt, career/schedule constraints, prepaid rent, invite-only access, class isolation, PIN resume, board moderation, and cross-class approvals.
