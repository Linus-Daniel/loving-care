
› follow this, You are an expert full-stack engineer. Your job is to build a complete,
  production-ready web application for "Loving Family Daycare" — a Nigerian
  nursery school platform with a public website, parent portal, and full
  admin dashboard.

  Build everything from scratch. Do not skip any page, feature, or
  integration. Follow every instruction in this prompt precisely.

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🧱 TECH STACK — USE EXACTLY THIS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Framework:        Next.js  (App Router, TypeScript)
  Styling:          Tailwind CSS + shadcn/ui components
  CMS:              Sanity.io (for public content management)
  Auth:             Clerk (parent + admin auth, role-based)
  Database:         Supabase (PostgreSQL)
  ORM:              Prisma
  Payments:         Stripe
  Email:            Resend + React Email
  Calendar:         FullCalendar (React)
  Analytics:        Vercel Analytics + PostHog
  Hosting:          Vercel (configure vercel.json)
  Icons:            Lucide React
  Forms:            React Hook Form + Zod validation
  State:            Zustand (global), TanStack Query (server state)
  Tables:           TanStack Table
  Charts:           Recharts
  File Upload:      UploadThing
  PDF Generation:   React PDF (@react-pdf/renderer)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🎨 DESIGN SYSTEM — APPLY GLOBALLY
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Define these in tailwind.config.ts and globals.css:

  Colors: use the colors in the project

  Fonts (Google Fonts via next/font):
    Display/Headings: Nunito (weights: 400, 600, 700, 800)
    Body:             DM Sans (weights: 400, 500)
    Mono/Data:        JetBrains Mono (weights: 400, 500)

  Border Radius:
    sm: 8px | md: 12px | lg: 16px | pill: 9999px

  Shadows:
    card: 0 2px 12px rgba(0,0,0,0.06)
    hover: 0 8px 24px rgba(0,0,0,0.10)

  Breakpoints:
    mobile: 375px | tablet: 768px | desktop: 1440px

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📁 PROJECT STRUCTURE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  loving-family-daycare/
  ├── app/
  │   ├── (public)/               # Public website layout
  │   │   ├── page.tsx            # Home
  │   │   ├── about/
  │   │   ├── programs/
  │   │   ├── gallery/
  │   │   ├── events/
  │   │   ├── contact/
  │   │   ├── register/
  │   │   ├── faq/
  │   │   ├── privacy-policy/
  │   │   └── terms/
  │   ├── (auth)/                 # Auth pages (Clerk)
  │   │   ├── login/
  │   │   └── sign-up/
  │   ├── (parent)/               # Parent portal layout
  │   │   ├── dashboard/
  │   │   ├── child-profile/
  │   │   ├── attendance/
  │   │   ├── payments/
  │   │   ├── make-payment/
  │   │   ├── events/
  │   │   ├── messages/
  │   │   ├── resources/
  │   │   ├── support/
  │   │   └── settings/
  │   ├── (admin)/                # Admin dashboard layout
  │   │   ├── dashboard/
  │   │   ├── children/
  │   │   ├── parents/
  │   │   ├── staff/
  │   │   ├── attendance/
  │   │   ├── attendance-reports/
  │   │   ├── registrations/
  │   │   ├── registrations/[id]/
  │   │   ├── payments/
  │   │   ├── payments/[id]/
  │   │   ├── invoices/
  │   │   ├── events/
  │   │   ├── calendar/
  │   │   ├── messages/
  │   │   ├── announcements/
  │   │   ├── resources/
  │   │   ├── cms/
  │   │   ├── support/
  │   │   ├── analytics/
  │   │   ├── seo/
  │   │   ├── social/
  │   │   ├── roles/
  │   │   └── settings/
  │   ├── admin-login/            # Separate admin auth
  │   └── api/
  │       ├── webhooks/
  │       │   ├── stripe/
  │       │   └── clerk/
  │       ├── stripe/
  │       │   ├── create-payment-intent/
  │       │   └── create-invoice/
  │       ├── attendance/
  │       ├── registrations/
  │       ├── children/
  │       ├── parents/
  │       ├── staff/
  │       ├── messages/
  │       ├── announcements/
  │       ├── resources/
  │       ├── support/
  │       └── upload/
  ├── components/
  │   ├── ui/                     # shadcn/ui base components
  │   ├── public/                 # Public site components
  │   │   ├── Navbar.tsx
  │   │   ├── Footer.tsx
  │   │   ├── HeroSection.tsx
  │   │   ├── ProgramCard.tsx
  │   │   ├── TestimonialCarousel.tsx
  │   │   ├── StatCounter.tsx
  │   │   ├── EventCard.tsx
  │   │   └── GalleryGrid.tsx
  │   ├── parent/                 # Parent portal components
  │   │   ├── ParentSidebar.tsx
  │   │   ├── AttendanceCalendar.tsx
  │   │   ├── PaymentCard.tsx
  │   │   └── MessageThread.tsx
  │   ├── admin/                  # Admin components
  │   │   ├── AdminSidebar.tsx
  │   │   ├── AdminHeader.tsx
  │   │   ├── KPICard.tsx
  │   │   ├── DataTable.tsx
  │   │   ├── AttendanceGrid.tsx
  │   │   └── RevenueChart.tsx
  │   ├── forms/                  # All form components
  │   │   ├── RegistrationForm/
  │   │   │   ├── Step1Personal.tsx
  │   │   │   ├── Step2Address.tsx
  │   │   │   ├── Step3Medical.tsx
  │   │   │   ├── Step4Guardian.tsx
  │   │   │   ├── Step5Payment.tsx
  │   │   │   └── FormStepper.tsx
  │   │   ├── ContactForm.tsx
  │   │   └── SupportTicketForm.tsx
  │   └── shared/
  │       ├── EmptyState.tsx
  │       ├── LoadingTable.tsx
  │       ├── StatusBadge.tsx
  │       ├── PageHeader.tsx
  │       └── ConfirmModal.tsx
  ├── lib/
  │   ├── prisma.ts
  │   ├── supabase.ts
  │   ├── stripe.ts
  │   ├── resend.ts
  │   ├── clerk.ts
  │   ├── sanity.ts
  │   └── utils.ts
  ├── hooks/
  │   ├── useAttendance.ts
  │   ├── usePayments.ts
  │   ├── useChildren.ts
  │   └── useMessages.ts
  ├── store/
  │   └── useAppStore.ts
  ├── prisma/
  │   └── schema.prisma
  ├── sanity/
  │   ├── schemas/
  │   │   ├── announcement.ts
  │   │   ├── program.ts
  │   │   ├── event.ts
  │   │   ├── staffMember.ts
  │   │   ├── galleryImage.ts
  │   │   └── faqItem.ts
  │   └── sanity.config.ts
  ├── emails/
  │   ├── RegistrationConfirmation.tsx
  │   ├── PaymentReceipt.tsx
  │   ├── EventReminder.tsx
  │   └── WelcomeEmail.tsx
  ├── types/
  │   └── index.ts
  ├── middleware.ts               # Clerk route protection
  ├── next.config.js
  ├── tailwind.config.ts
  └── .env.local.example

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🗄️ DATABASE SCHEMA (Prisma)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build the complete schema.prisma with these models:

  model User {
    id            String    @id @default(cuid())
    clerkId       String    @unique
    email         String    @unique
    name          String
    phone         String?
    role          Role      @default(PARENT)
    avatar        String?
    createdAt     DateTime  @default(now())
    updatedAt     DateTime  @updatedAt
    children      Child[]
    messages      Message[]
    tickets       SupportTicket[]
    notifications Notification[]
    payments      Payment[]
  }

  model Child {
    id               String       @id @default(cuid())
    firstName        String
    lastName         String
    dateOfBirth      DateTime
    gender           String
    program          String
    enrollmentDate   DateTime
    status           EnrollStatus @default(PENDING)
    photo            String?
    parentId         String
    parent           User         @relation(fields: [parentId], references: [id])
    medicalInfo      MedicalInfo?
    attendance       Attendance[]
    createdAt        DateTime     @default(now())
    updatedAt        DateTime     @updatedAt
  }

  model MedicalInfo {
    id              String  @id @default(cuid())
    childId         String  @unique
    child           Child   @relation(fields: [childId], references: [id])
    conditions      String?
    medications     String?
    doctorName      String?
    doctorPhone     String?
    allergies       String?
  }

  model Registration {
    id              String           @id @default(cuid())
    status          RegistrationStatus @default(PENDING)
    childFirstName  String
    childLastName   String
    dateOfBirth     DateTime
    gender          String
    program         String
    preferredStart  DateTime?
    parentName      String
    parentEmail     String
    parentPhone     String
    streetAddress   String
    city            String
    state           String
    country         String
    emergencyName   String
    emergencyPhone  String
    emergencyRel    String
    medicalInfo     String?
    medications     String?
    doctorContact   String?
    previousSchool  String?
    gradeLevel      String?
    referralSource  String?
    comments        String?
    termsAccepted   Boolean
    privacyAccepted Boolean
    parentalConsent Boolean
    paymentMethod   String?
    adminNotes      String?
    reviewedBy      String?
    createdAt       DateTime         @default(now())
    updatedAt       DateTime         @updatedAt
  }

  model Attendance {
    id        String           @id @default(cuid())
    childId   String
    child     Child            @relation(fields: [childId], references: [id])
    date      DateTime
    status    AttendanceStatus
    notes     String?
    markedBy  String?
    createdAt DateTime         @default(now())
  }

  model Payment {
    id              String        @id @default(cuid())
    userId          String
    user            User          @relation(fields: [userId], references: [id])
    stripePaymentId String?       @unique
    amount          Float
    currency        String        @default("NGN")
    status          PaymentStatus
    description     String
    receiptUrl      String?
    paymentMethod   String?
    createdAt       DateTime      @default(now())
  }

  model Invoice {
    id          String        @id @default(cuid())
    invoiceNo   String        @unique
    parentEmail String
    parentName  String
    items       Json
    total       Float
    dueDate     DateTime
    status      InvoiceStatus @default(PENDING)
    sentAt      DateTime?
    paidAt      DateTime?
    createdAt   DateTime      @default(now())
  }

  model Message {
    id          String    @id @default(cuid())
    senderId    String
    sender      User      @relation(fields: [senderId], references: [id])
    receiverId  String
    content     String
    isRead      Boolean   @default(false)
    threadId    String
    createdAt   DateTime  @default(now())
  }

  model Announcement {
    id          String    @id @default(cuid())
    title       String
    body        String
    targetRole  Role      @default(PARENT)
    targetClass String?
    isDraft     Boolean   @default(false)
    scheduledAt DateTime?
    sentAt      DateTime?
    createdBy   String
    createdAt   DateTime  @default(now())
  }

  model Resource {
    id          String   @id @default(cuid())
    name        String
    fileUrl     String
    fileType    String
    category    String
    visibility  String   @default("parents")
    uploadedBy  String
    createdAt   DateTime @default(now())
  }

  model SupportTicket {
    id          String       @id @default(cuid())
    userId      String
    user        User         @relation(fields: [userId], references: [id])
    subject     String
    description String
    priority    Priority     @default(MEDIUM)
    status      TicketStatus @default(OPEN)
    assignedTo  String?
    replies     TicketReply[]
    createdAt   DateTime     @default(now())
    updatedAt   DateTime     @updatedAt
  }

  model TicketReply {
    id        String        @id @default(cuid())
    ticketId  String
    ticket    SupportTicket @relation(fields: [ticketId], references: [id])
    content   String
    authorId  String
    isStaff   Boolean       @default(false)
    createdAt DateTime      @default(now())
  }

  model Staff {
    id        String   @id @default(cuid())
    name      String
    email     String   @unique
    phone     String?
    role      String
    class     String?
    photo     String?
    bio       String?
    isActive  Boolean  @default(true)
    createdAt DateTime @default(now())
  }

  model Notification {
    id        String   @id @default(cuid())
    userId    String
    user      User     @relation(fields: [userId], references: [id])
    title     String
    message   String
    isRead    Boolean  @default(false)
    type      String
    link      String?
    createdAt DateTime @default(now())
  }

  enum Role {
    SUPER_ADMIN
    ADMIN
    STAFF
    PARENT
  }

  enum EnrollStatus {
    PENDING
    ACTIVE
    INACTIVE
    GRADUATED
  }

  enum RegistrationStatus {
    PENDING
    APPROVED
    REJECTED
    WAITLISTED
  }

  enum AttendanceStatus {
    PRESENT
    ABSENT
    LATE
    EXCUSED
  }

  enum PaymentStatus {
    PENDING
    SUCCEEDED
    FAILED
    REFUNDED
  }

  enum InvoiceStatus {
    PENDING
    PAID
    OVERDUE
    CANCELLED
  }

  enum Priority {
    LOW
    MEDIUM
    HIGH
    URGENT
  }

  enum TicketStatus {
    OPEN
    IN_PROGRESS
    CLOSED
  }

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔐 AUTH & MIDDLEWARE
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Use Clerk for all authentication. Configure middleware.ts to:

  1. Protect ALL /parent/* routes — require PARENT or ADMIN role
  2. Protect ALL /admin/* routes — require ADMIN or SUPER_ADMIN role
  3. Protect /admin-login separately from public login
  4. Allow public access to all /(public)/* routes
  5. Sync Clerk user creation webhook to Prisma User table via
     /api/webhooks/clerk
  6. Store role in Clerk publicMetadata: { role: "PARENT" | "ADMIN" }
  7. Read role from Clerk session claims in middleware for
     redirect logic

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🌐 SECTION 1 — PUBLIC PAGES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build a shared PublicLayout with:
  - Sticky Navbar: logo left, nav links center (Home, About,
    Programs, Gallery, Events, Contact), "Enroll Now" button
    right (yellow pill button), hamburger menu on mobile
  - Footer: Logo, nav links, social icons, contact info,
    copyright, privacy + terms links

  PAGE 1 — HOME (app/(public)/page.tsx)
  - Hero: Large headline, subheadline, two CTAs,
    background gradient (green to teal) with decorative
    circle shapes
  - Stats: Animated count-up for 4 metrics on scroll
    (200+ Happy Families, 10+ Years, 30+ Staff, 6 Programs)
  - Why Choose Us: 3 icon feature cards
  - Programs Preview: Horizontal scroll cards on mobile,
    3-col grid on desktop, each card: program name,
    age range badge, short description, Learn More link
  - Testimonials: Auto-playing carousel, parent avatar,
    quote, star rating
  - Gallery Preview: 6-image masonry grid, View Gallery link
  - Upcoming Events: 3 event cards fetched from Sanity
  - CTA Banner: Full-width green section with yellow headline
    and Enroll button
  - All content except stats fetched from Sanity

  PAGE 2 — ABOUT (app/(public)/about/page.tsx)
  - Hero banner with school image background + green overlay
  - Mission & Vision: Two highlighted stat cards
  - Our Story: Vertical timeline from 2014 to present
  - Core Values: 2x2 grid of icon cards
  - Meet Our Team: Staff cards from Supabase staff table
  - CTA section at bottom

  PAGE 3 — PROGRAMS (app/(public)/programs/page.tsx)
  - Tab navigation: Infant Care, Toddler, Preschool,
    After School
  - Each tab content: Photo left, details right (desktop);
    stacked on mobile
  - Features: Checkmark list
  - Weekly schedule: Simple day/activity table
  - Content from Sanity programs schema
  - Register CTA at bottom

  PAGE 4 — GALLERY (app/(public)/gallery/page.tsx)
  - Filter tabs: All, Classroom, Outdoor, Events, Art & Craft
  - Masonry grid using CSS columns
  - Each image: hover overlay with zoom icon and caption
  - Lightbox: Full-screen image view on click with
    prev/next arrows and close button
  - Images from Sanity galleryImage schema with category field

  PAGE 5 — EVENTS (app/(public)/events/page.tsx)
  - Toggle: Calendar View / List View
  - Calendar: FullCalendar month view (read-only for public)
  - List: Event cards with date badge, title, time,
    location, description, Register button
  - Register button: Links to login if not authenticated,
    else registers in DB
  - Past events shown in muted style below current events
  - Events from Supabase + Sanity

  PAGE 6 — CONTACT (app/(public)/contact/page.tsx)
  - Two-column layout (desktop), stacked (mobile)
  - Left: ContactForm component using React Hook Form + Zod,
    sends email via Resend on submit
  - Right: Address card, phone, email,
    Google Maps embed (iframe), business hours card
  - Social media icon row

  PAGE 7 — REGISTRATION (app/(public)/register/page.tsx)
  - Multi-step form with 5 steps + progress stepper
  - FormStepper shows current step, completed steps
    (checkmarks), upcoming steps
  - Use React Hook Form with Zod schema per step
  - Persist form state across steps with Zustand
  - Step 1: Personal info (child + parent details)
  - Step 2: Address + emergency contact
  - Step 3: Medical info + educational background
  - Step 4: Guardian info + consent checkboxes
    (Terms, Privacy, Parental Consent)
  - Step 5: Payment method selection
    (Card via Stripe, Bank Transfer)
  - Review screen: Summary of all fields before submit
  - On submit: POST to /api/registrations,
    send confirmation email via Resend,
    redirect to success page
  - Success page: Confirmation number, next steps,
    return home button

  PAGE 8 — LOGIN (app/(auth)/login/page.tsx)
  - Clerk SignIn component with custom appearance
    matching design system
  - Redirect parents to /parent/dashboard
  - Redirect admins to /admin/dashboard

  PAGE 9 — SIGN UP (app/(auth)/sign-up/page.tsx)
  - Clerk SignUp component with custom appearance
  - After signup webhook syncs to Prisma User
    with default PARENT role

  PAGE 10 — FAQ (app/(public)/faq/page.tsx)
  - Search input that filters questions client-side
  - Accordion sections by category from Sanity faqItem schema
  - Still need help? CTA card

  PAGE 11 — PRIVACY POLICY (app/(public)/privacy-policy/page.tsx)
  - Long-form document layout
  - Sticky table of contents sidebar on desktop
  - Smooth scroll to sections

  PAGE 12 — TERMS (app/(public)/terms/page.tsx)
  - Same layout as Privacy Policy

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  👨‍👩‍👧 SECTION 2 — PARENT PORTAL
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build ParentLayout with:
  - Left sidebar (240px) with nav items:
    Dashboard, My Child, Attendance, Payments,
    Events, Messages, Resources, Support, Settings, Logout
  - Active state: green background, yellow text + icon
  - Sidebar collapses to icon-only at md breakpoint
  - Collapses to bottom tab bar on mobile (5 main items)
  - Top header bar: Breadcrumb left,
    notification bell + avatar right
  - Main content: Scrollable, padded, grey background

  PAGE 13 — PARENT DASHBOARD
  - "Good [morning/afternoon/evening], [name]!" greeting
  - 4 KPI cards: Attendance % (this month),
    Upcoming Events, Outstanding Balance, Unread Messages
  - Child summary card: Photo, name, class,
    teacher name, enrollment status badge
  - Attendance strip: Mon–Fri current week,
    colored dot per day (green/red/yellow)
  - Upcoming Events: 3 compact event cards
  - Recent messages: 2 previews with unread indicator
  - Quick Actions: Pay Now, View Calendar,
    Message Teacher buttons

  PAGE 14 — CHILD PROFILE
  - Profile header: Large avatar, name, age,
    class, status badge, Edit button
  - Three tabs: Overview | Medical | Documents
  - Overview: All basic details in labeled grid
  - Medical: Conditions, medications, doctor info
  - Documents: File list with name, type icon,
    date, download button
  - Edit mode: Inline form editing

  PAGE 15 — ATTENDANCE RECORDS
  - Month navigation (prev/next)
  - Summary chips: Present (count), Absent, Late, Excused
  - FullCalendar month view with custom day cell rendering:
    green dot = present, red = absent, yellow = late
  - Detail table below: Date, Day, Status badge, Notes
  - Export to PDF button using @react-pdf/renderer

  PAGE 16 — PAYMENT HISTORY
  - Summary cards: Total Paid (year),
    Outstanding Balance, Next Due Date
  - Filter row: Month picker, Status dropdown
  - TanStack Table: Date, Description, Amount,
    Status badge, Download Receipt
  - Pagination
  - Data from /api/payments?userId=...

  PAGE 17 — MAKE PAYMENT
  - Outstanding balance card (yellow border, bold amount)
  - Fee breakdown table: Tuition, extras, total
  - Payment method tabs: Card | Bank Transfer
  - Card tab: Stripe Elements (CardElement component)
  - On submit: POST to /api/stripe/create-payment-intent,
    confirm payment, update DB, send receipt email
  - Bank Transfer tab: Account details +
    upload proof of payment
  - SSL security badge below form

  PAGE 18 — EVENTS CALENDAR (PARENT)
  - FullCalendar month view
  - Two event types: All Events (grey) and
    My Registered Events (green)
  - Click event: Side panel with full details +
    Register/Unregister button
  - Toggle email reminder per event
  - API: GET /api/events,
    POST /api/events/[id]/register

  PAGE 19 — MESSAGES
  - Two-panel layout (desktop),
    full-screen thread on mobile with back button
  - Left panel: Thread list sorted by latest
    Each item: Avatar, name, message preview, timestamp,
    unread count badge
  - Right panel: Message bubbles
    Parent messages: right-aligned, green background
    Staff messages: left-aligned, teal background
    Timestamp below each bubble
  - Input bar: Text input + send button
  - New Message: Dropdown to select staff member
  - Notifications tab: System alerts list

  PAGE 20 — RESOURCES
  - Search bar
  - Category filter tabs: Forms, Newsletters,
    Curriculum, Policies
  - Resource cards: File icon (PDF=red, DOC=blue),
    name, category badge, date, file size,
    Download button
  - Data from /api/resources

  PAGE 21 — SUPPORT TICKETS
  - "Open New Ticket" button → modal form:
    Subject, Priority, Description
  - Tickets table: ID, Subject, Priority badge,
    Status badge, Date, View button
  - Single ticket view (drawer or separate page):
    Description, status timeline, staff replies
    (chat-style), reply input

  PAGE 22 — SETTINGS
  - Tabs: Profile | Security | Notifications | Privacy
  - Profile: Edit name, phone, upload avatar (UploadThing)
  - Security: Change password via Clerk, 2FA toggle
  - Notifications: Toggle matrix
    (rows: payment/event/message, cols: email/in-app)
  - Privacy: Download my data (JSON export),
    Delete account (confirmation modal)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🛠️ SECTION 3 — ADMIN DASHBOARD
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build AdminLayout with:
  - Wider sidebar (260px), grouped nav sections
  - Top header: Search bar, notification bell with
    dropdown, admin avatar with role badge
  - Sidebar groups: Overview | People | Attendance |
    Registrations | Finance | Communications |
    Content | Support | Analytics | System
  - Sidebar collapses on toggle, persists in localStorage

  PAGE 23 — ADMIN OVERVIEW
  - Welcome + today's date
  - Row 1 KPIs: Total Children, New Registrations
    (this month), Revenue (this month),
    Open Tickets — with trend arrow vs last month
  - Row 2 KPIs: Staff Count, Today Attendance %,
    Upcoming Events, Pending Approvals
  - Revenue Chart: Recharts LineChart,
    last 12 months, green line
  - Enrollment Chart: Recharts BarChart,
    monthly new enrollments, teal bars
  - Attendance Heatmap: Custom CSS grid,
    color intensity = attendance rate per day
  - Recent Registrations: Mini table (5 rows)
  - Recent Transactions: Mini table (5 rows)
  - Quick Actions panel: 4 large icon buttons

  PAGE 24 — MANAGE CHILDREN
  - Search input + Class filter + Status filter
  - TanStack Table: Avatar, Full Name, Age,
    Class, Enroll Date, Status badge,
    Actions (View, Edit, Delete)
  - Add Child button → slide-over form
  - Delete: Confirmation modal
  - Export CSV button
  - Pagination + items-per-page selector

  PAGE 25 — MANAGE PARENTS
  - Same TanStack Table pattern as children
  - Columns: Avatar, Name, Email, Phone,
    Children (linked names), Status, Actions
  - View parent → shows linked children +
    payment history summary

  PAGE 26 — MANAGE STAFF
  - Toggle: Grid view / Table view
  - Grid: Photo cards with name, role, class,
    status dot, Edit/Deactivate buttons
  - Table: Same data in row format
  - Add Staff → form modal
  - All data from Supabase Staff table

  PAGE 27 — ATTENDANCE MANAGEMENT
  - Date picker (defaults to today)
  - Class filter dropdown
  - Attendance table: Child avatar + name,
    Present/Absent/Late/Excused toggle buttons per row
  - Mark All Present button
  - Auto-save indicator (debounced)
  - PATCH /api/attendance on each toggle

  PAGE 28 — ATTENDANCE REPORTS
  - Filters: Date range, Class, Child, Status
  - Summary stat cards: % rates
  - Recharts BarChart: Attendance by class
  - Full filterable TanStack Table
  - Export PDF button (React PDF)
  - Export CSV button

  PAGE 29 — REGISTRATION REQUESTS
  - Filter tabs: All | Pending | Approved |
    Rejected | Waitlisted
  - TanStack Table: Child name, Parent,
    Date Submitted, Program, Status badge, View
  - Bulk action bar (appears on row select):
    Approve Selected, Reject Selected
  - Search by parent email or child name

  PAGE 30 — REGISTRATION DETAIL
  - Full details display in organized sections
    (cards per category)
  - Status action buttons: Approve (green),
    Reject (red), Waitlist (yellow),
    Request Info (blue)
  - On Approve: Creates Child + User records,
    sends welcome email via Resend
  - Internal notes textarea (admin only)
  - Status change timeline at bottom
  - PATCH /api/registrations/[id]

  PAGE 31 — PAYMENTS OVERVIEW
  - Summary cards: Total Collected, Pending,
    Overdue, This Month
  - Recharts BarChart: Monthly revenue (12 months)
  - Filters: Date range, Status, Search parent name
  - TanStack Table: Parent, Child, Amount,
    Type, Status badge, Date, View, Download Receipt
  - Export CSV

  PAGE 32 — PAYMENT DETAIL
  - All transaction metadata displayed
  - Stripe payment ID, method (last 4 or PayPal)
  - Status badge + processed timestamp
  - Download Receipt button (PDF)
  - Issue Refund button (calls Stripe refund API)
    with confirmation modal

  PAGE 33 — INVOICES & BILLING
  - Create Invoice button → form modal:
    Select parent (searchable dropdown),
    Add line items (description + amount rows),
    set due date, send immediately or save draft
  - Invoices TanStack Table: Invoice #, Parent,
    Amount, Due Date, Status, Send/Download actions
  - On Send: POST to /api/stripe/create-invoice,
    send email via Resend

  PAGE 34 — EVENTS MANAGER
  - FullCalendar month view + List view toggle
  - Events table: Title, Date, Time,
    Registrations/Capacity, Status, Edit/Delete
  - Create Event button → full form modal:
    Title, Description, Date, Time, Location,
    Capacity, Cover Photo (UploadThing),
    Email Reminder toggle, Visibility
  - POST/PATCH/DELETE /api/events

  PAGE 35 — CALENDAR MANAGEMENT
  - Full FullCalendar admin view
  - Click any date → Add Event or
    Add Holiday modal
  - Color coding: Holiday=red, Event=teal,
    Exam=yellow, Regular=green
  - Drag-and-drop event rescheduling
  - View all events as hoverable tooltips

  PAGE 36 — MESSAGES / INBOX (ADMIN)
  - All parent conversations visible to admin
  - Assignee dropdown per conversation
    (assign to staff member)
  - Filter: Unread, By staff assignee, By parent
  - Same two-panel layout as parent messages
  - Staff replies visible from admin view

  PAGE 37 — ANNOUNCEMENTS
  - Create Announcement button → form:
    Title, Body (rich text textarea),
    Target (All / By Role / By Class),
    Schedule toggle (date/time picker),
    Channels (in-app toggle, email toggle)
  - Announcements TanStack Table: Title, Target,
    Status (Draft/Scheduled/Sent), Date, Edit/Delete
  - Sent announcements are read-only

  PAGE 38 — RESOURCES MANAGER
  - Drag-and-drop upload zone (UploadThing)
  - Resources TanStack Table: Name, Category,
    Uploaded by, Date, Visibility,
    Edit category/visibility, Delete
  - Category management: Add/remove categories
  - Bulk delete

  PAGE 39 — CMS / CONTENT EDITOR
  - Page list: Home, About, Programs, FAQ
    (pointing to Sanity documents)
  - Click page → opens Sanity Studio embedded
    (or link out to Sanity Studio)
  - Alternative: Build simple custom editor for
    key fields (hero text, CTA text, contact info)
    with PATCH to Sanity via API

  PAGE 40 — SUPPORT TICKETS (ADMIN)
  - Filter tabs: All | Open | In Progress | Closed
  - Priority filter: All | Urgent | High | Medium | Low
  - TanStack Table: ID, Parent, Subject,
    Priority badge, Status badge, Assigned Staff,
    Date, View
  - Single ticket page: Full thread,
    reply box (staff), change status dropdown,
    assign to staff dropdown, priority update

  PAGE 41 — ANALYTICS DASHBOARD
  - Traffic Chart: Vercel Analytics data
    (page views line chart)
  - User Behavior: Top pages table
  - Device Breakdown: Recharts PieChart
    (Mobile/Desktop/Tablet)
  - Enrollment Funnel: Recharts FunnelChart
    (Visitors → Registration page →
    Form started → Submitted → Approved)
  - Traffic Source: Recharts BarChart
    (Organic, Social, Direct, Referral)
  - PostHog custom event data for user actions

  PAGE 42 — SEO SETTINGS
  - Pages list with editable rows:
    Page name, Meta Title (input),
    Meta Description (textarea),
    OG Image (UploadThing),
    Focus Keyword (input), SEO Score dot
  - SEO score calculated from:
    title length (50-60), description length (150-160),
    keyword present
  - Save changes updates next-seo config or
    metadata exports in page files
  - Sitemap regeneration button (calls /api/sitemap)
  - Robots.txt editor (textarea + save)

  PAGE 43 — SOCIAL MEDIA SETTINGS
  - Cards for Instagram, Facebook, Twitter
  - Each: Platform icon, URL input,
    Connect/Disconnect toggle,
    "Fetch latest 3 posts" preview
  - Feed preview: 3 latest post thumbnails + captions
  - Share buttons config: Toggle which pages
    show share buttons

  PAGE 44 — ROLES & PERMISSIONS
  - Role cards: Super Admin, Admin, Staff, Parent
  - Expand each card: Permission matrix table
    (modules as rows, View/Edit/Delete/Approve as cols)
  - Toggle permissions per role
  - Add Custom Role button → name + inherit from dropdown
  - Users table below: Name, Email, Current Role,
    Change Role dropdown

  PAGE 45 — SITE SETTINGS
  - Tabs: General | Appearance | Email |
    Integrations | Maintenance
  - General: School name, tagline, logo (UploadThing),
    favicon, contact email, phone, address, timezone
  - Appearance: Primary color picker (updates CSS var),
    font selector with live preview,
    dark/light mode default toggle
  - Email: Resend API key, sender name,
    sender email, email footer textarea
  - Integrations: Stripe public/secret key,
    PostHog API key, Google Analytics ID,
    Sanity project ID + dataset,
    Clerk publishable key
  - Maintenance: Toggle maintenance mode
    (shows maintenance page to non-admins),
    custom maintenance message

  PAGE 46 — ADMIN LOGIN
  - Separate from public login at /admin-login
  - Full-screen split layout:
    Left = branded panel (green, logo, tagline),
    Right = login form
  - "Admin Portal Access" label
  - Email + Password fields
  - 2FA code field (conditional on Clerk 2FA)
  - Login button
  - Forgot password link
  - NO registration link visible
  - Failed login: Show error message,
    lockout after 5 attempts

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📡 API ROUTES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build all API routes as Next.js Route Handlers.
  Use Zod for request validation on all POST/PATCH routes.
  Return consistent JSON: { success, data, error, meta }

  /api/registrations
    GET  — list all (admin only), filter by status
    POST — create new registration,
           send confirmation email via Resend

  /api/registrations/[id]
    GET   — single registration detail
    PATCH — update status + admin notes (admin only)
            on APPROVED: create Child + User in DB,
            send welcome email

  /api/children
    GET  — list children (admin: all, parent: own)
    POST — create child (admin only)

  /api/children/[id]
    GET    — single child
    PATCH  — update child
    DELETE — soft delete (set status INACTIVE)

  /api/attendance
    GET  — list by childId + date range
    POST — create/update attendance record (admin/staff)

  /api/payments
    GET  — list payments (admin: all, parent: own)

  /api/stripe/create-payment-intent
    POST — create Stripe PaymentIntent,
           return clientSecret

  /api/stripe/create-invoice
    POST — create Stripe Invoice,
           send email to parent

  /api/webhooks/stripe
    POST — handle payment_intent.succeeded:
           update Payment record status in DB,
           send receipt email via Resend

  /api/webhooks/clerk
    POST — handle user.created:
           sync to Prisma User with PARENT role

  /api/events
    GET  — list all events
    POST — create event (admin only)

  /api/events/[id]
    PATCH  — update event
    DELETE — delete event

  /api/events/[id]/register
    POST   — register parent for event
    DELETE — unregister

  /api/messages
    GET  — get thread between two users
    POST — send message

  /api/messages/threads
    GET  — list all threads for current user

  /api/announcements
    GET  — list (filter by role/class)
    POST — create announcement (admin)

  /api/resources
    GET  — list by category + visibility
    POST — create resource record after
           UploadThing upload

  /api/support
    GET  — list tickets (admin: all, parent: own)
    POST — create ticket

  /api/support/[id]
    PATCH — update status, assignee (admin)

  /api/support/[id]/replies
    POST — add reply to ticket

  /api/staff
    GET  — list all staff
    POST — create staff member

  /api/upload — handled by UploadThing

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📧 EMAIL TEMPLATES (React Email)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build 4 React Email templates with
  Loving Family Daycare branding (green header,
  yellow accents, footer with address + socials):

  1. RegistrationConfirmation.tsx
     Props: parentName, childName, confirmationNumber,
            program, nextSteps[]

  2. RegistrationApproved.tsx
     Props: parentName, childName, startDate,
            portalLoginUrl

  3. PaymentReceipt.tsx
     Props: parentName, amount, description,
            transactionId, date, receiptUrl

  4. EventReminder.tsx
     Props: parentName, eventTitle, eventDate,
            eventLocation, eventTime

  Send all emails via Resend:
  import { Resend } from 'resend'
  const resend = new Resend(process.env.RESEND_API_KEY)

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  📦 SANITY SCHEMAS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  Build these Sanity schemas for CMS-managed content:

  1. program — name, slug, ageRange, description,
     features[], weeklySchedule, image, isActive
  2. event — title, slug, date, time, location,
     description, image, capacity, isPublic
  3. staffMember — name, role, class, bio, photo, order
  4. galleryImage — image, caption, category, order
  5. faqItem — question, answer, category, order
  6. announcement — title, body, publishedAt
  7. homepageContent — heroHeadline, heroSubtext,
     stats[], whyUsItems[], testimonials[]

  Configure sanity.config.ts with all schemas.
  Fetch in Next.js using @sanity/client with
  NEXT_PUBLIC_SANITY_PROJECT_ID + NEXT_PUBLIC_SANITY_DATASET

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  🔧 SHARED COMPONENTS TO BUILD
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  StatusBadge — maps status string to colored chip:
    PENDING=yellow, APPROVED=green, REJECTED=red,
    ACTIVE=teal, ABSENT=red, PRESENT=green, LATE=yellow

  DataTable — reusable TanStack Table wrapper:
    Props: columns[], data[], isLoading,
           pagination, searchable, exportable
    Shows skeleton rows when isLoading=true
    Shows EmptyState when data=[]

  EmptyState — centered illustration + message +
    optional action button:
    Use a simple SVG illustration (no external images)

  KPICard — stat card:
    Props: title, value, trend, trendDirection, icon, color

  PageHeader — page title + breadcrumb +
    optional action button slot

  ConfirmModal — shadcn AlertDialog wrapper:
    Props: title, description, onConfirm, isLoading

  LoadingTable — skeleton rows matching table structure

  FormStepper — step indicator:
    Props: steps[], currentStep
    Completed steps: checkmark, Active: green circle,
    Upcoming: grey circle

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ⚙️ CONFIGURATION FILES
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  .env.local.example — include ALL required env vars:
    DATABASE_URL
    DIRECT_URL
    NEXT_PUBLIC_SUPABASE_URL
    NEXT_PUBLIC_SUPABASE_ANON_KEY
    SUPABASE_SERVICE_ROLE_KEY
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
    CLERK_SECRET_KEY
    CLERK_WEBHOOK_SECRET
    NEXT_PUBLIC_SANITY_PROJECT_ID
    NEXT_PUBLIC_SANITY_DATASET
    SANITY_API_TOKEN
    STRIPE_PUBLIC_KEY
    STRIPE_SECRET_KEY
    STRIPE_WEBHOOK_SECRET
    RESEND_API_KEY
    NEXT_PUBLIC_POSTHOG_KEY
    NEXT_PUBLIC_POSTHOG_HOST
    UPLOADTHING_SECRET
    UPLOADTHING_APP_ID
    NEXT_PUBLIC_APP_URL

  next.config.js:
    - Configure image domains for Supabase + Sanity + UploadThing
    - Enable experimental serverActions

  tailwind.config.ts:
    - Extend theme with all brand colors, fonts,
      border radius, and shadows defined above
    - Include shadcn/ui config

  middleware.ts:
    - Clerk auth middleware with route matchers:
      publicRoutes: ["/", "/about", "/programs",
        "/gallery", "/events", "/contact",
        "/register", "/faq", "/privacy-policy",
        "/terms", "/login", "/sign-up", "/admin-login",
        "/api/webhooks/(.*)"]
      protectedRoutes: ["/parent/(.*)", "/admin/(.*)"]
      adminRoutes: ["/admin/(.*)"]

  vercel.json:
    - Build + deployment config
    - Environment variable references

  prisma/schema.prisma:
    - Full schema as defined above
    - Use postgresql provider
    - Connection via Supabase DATABASE_URL + DIRECT_URL

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. Project init: npx create-next-app with TypeScript +
     Tailwind, install all dependencies
  2. tailwind.config.ts + globals.css — design system tokens
  3. prisma/schema.prisma — full schema + migrate
  4. lib/ files — prisma, supabase, stripe, resend,
     clerk, sanity clients
  5. types/index.ts — shared TypeScript types
  6. Sanity schemas + sanity.config.ts
  7. middleware.ts — Clerk route protection
  8. Shared components (ui/ + shared/)
  9. Public layout + Navbar + Footer
  10. All 12 public pages
  11. Auth pages (login + sign-up)
  12. API routes (all)
  13. Webhooks (Clerk + Stripe)
  14. Parent portal layout + all 10 parent pages

  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ QUALITY REQUIREMENTS
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  1. TypeScript strict mode — no 'any' types
  2. All forms validated with Zod schemas
  3. All API routes: authenticate with Clerk,
     validate request body with Zod
  4. All data tables: loading skeleton,
     empty state, pagination
  5. All destructive actions (delete, reject, refund):
     confirmation modal
  6. All pages: proper metadata exports
     (title, description) for SEO
  7. All images: next/image component
  8. All internal navigation: next/link
  9. Error boundaries on all portal pages
  10. Toast notifications (shadcn Sonner) for all
      success/error API responses
  11. Fully responsive — every page tested at
      375px, 768px, 1440px
  12. Loading states on all buttons during async actions
  13. Role-based UI: admin-only buttons/sections
      hidden from parents
  14. README.md with setup instructions,
      env var descriptions, and deployment steps