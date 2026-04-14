# FundEgypt — Design System & UI Documentation

> **Version:** 1.0.0  
> **Last Updated:** April 2026  
> **Audience:** All team members — Alaa, Menna, Hashem, John, Kariem  
> **Stack:** React + TypeScript (Frontend) · Django + Python (Backend)

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Color System](#2-color-system)
3. [Typography](#3-typography)
4. [Spacing & Layout](#4-spacing--layout)
5. [Components](#5-components)
6. [Page Specifications](#6-page-specifications)
7. [Responsive Breakpoints](#7-responsive-breakpoints)
8. [Forms & Validation](#8-forms--validation)
9. [States & Feedback](#9-states--feedback)
10. [Icons & Imagery](#10-icons--imagery)
11. [Tailwind Configuration](#11-tailwind-configuration)
12. [Accessibility Guidelines](#12-accessibility-guidelines)
13. [Do's & Don'ts](#13-dos--donts)

---

## 1. Project Overview

FundEgypt is a modern crowdfunding web platform for Egyptian fundraising campaigns. The design language is **clean, professional, and trustworthy** — inspired by platforms like GoFundMe and Kickstarter but tailored for an Egyptian audience.

### Design Principles

| Principle | Description |
|---|---|
| **Clarity** | Every element has a clear purpose. No decorative clutter. |
| **Trust** | Green palette signals growth, safety, and reliability. |
| **Accessibility** | All text meets WCAG AA contrast ratio (4.5:1 minimum). |
| **Consistency** | Same component looks and behaves identically on every page. |
| **Mobile-first** | Design for 375px screens first, then scale up. |

---

## 2. Color System

### 2.1 Core Palette

| Token Name | Hex | Usage |
|---|---|---|
| `brand-primary` | `#2FA084` | Primary buttons, CTAs, links, focus rings, active states |
| `brand-secondary` | `#1F6F5F` | Hover states, navbar background, headings, high-emphasis text |
| `brand-success` | `#6FCF97` | Progress bar fill, success badges, positive indicators |
| `brand-mint` | `#D1F2EB` | Progress bar track, light badges, card accents, cover banners |
| `surface-page` | `#EEEEEE` | Page background (light mode) |
| `surface-card` | `#FFFFFF` | Card backgrounds, input backgrounds, modals |
| `text-primary` | `#1F6F5F` | Headings, navbar text, high-emphasis labels |
| `text-body` | `#4A5568` | Body text, descriptions, secondary labels |
| `text-muted` | `#A0AEC0` | Placeholder text, disabled labels, hints |

### 2.2 Semantic Colors

| Token Name | Hex | Usage |
|---|---|---|
| `danger` | `#E53E3E` | Delete buttons, cancel actions, error messages |
| `danger-light` | `#FFF5F5` | Error input backgrounds, danger alert backgrounds |
| `warning` | `#F57F17` | Progress bar when funded 25–75% |
| `warning-light` | `#FFF8E1` | Warning alert backgrounds |
| `info` | `#3182CE` | Informational banners, Facebook button |
| `info-light` | `#EBF8FF` | Info alert backgrounds |

### 2.3 Progress Bar Color Rules

The progress bar fill color changes based on how much of the goal has been funded:

```
< 25% funded   →  fill: #E53E3E  (red)    — project at risk
25% – 75%      →  fill: #F57F17  (amber)  — project in progress  
> 75% funded   →  fill: #6FCF97  (green)  — project thriving
Track (always) →  background: #D1F2EB
```

### 2.4 Color Usage Examples

```tsx
// Tailwind classes mapped to palette
// Primary button
<button className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white rounded-lg px-6 py-2">
  Start a Campaign
</button>

// Card surface
<div className="bg-white border border-[#D1F2EB] rounded-xl p-6">

// Page background
<main className="bg-[#EEEEEE] min-h-screen">

// Progress bar
<div className="bg-[#D1F2EB] rounded-full h-2">
  <div className="bg-[#6FCF97] h-2 rounded-full" style={{ width: `${percent}%` }} />
</div>
```

---

## 3. Typography

### 3.1 Font Family

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

Import in your `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

### 3.2 Type Scale

| Name | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `heading-xl` | 36px / 2.25rem | 700 | 1.2 | Hero section tagline |
| `heading-lg` | 28px / 1.75rem | 600 | 1.3 | Page titles (H1) |
| `heading-md` | 22px / 1.375rem | 600 | 1.4 | Section headings (H2) |
| `heading-sm` | 18px / 1.125rem | 600 | 1.4 | Card titles, sub-section headings (H3) |
| `body-lg` | 16px / 1rem | 400 | 1.7 | Main body text, descriptions |
| `body-sm` | 14px / 0.875rem | 400 | 1.6 | Secondary text, captions, metadata |
| `label` | 12px / 0.75rem | 500 | 1.4 | Form labels, badges, tags |
| `micro` | 11px / 0.6875rem | 400 | 1.4 | Timestamps, footnotes |

### 3.3 Text Color Rules

- Headings on white/light backgrounds → `#1F6F5F`
- Body text on white/light backgrounds → `#4A5568`
- Text on `#2FA084` or `#1F6F5F` buttons → `#FFFFFF`
- Text on `#D1F2EB` mint badges → `#1F6F5F`
- Placeholder text → `#A0AEC0`
- Disabled text → `#CBD5E0`

---

## 4. Spacing & Layout

### 4.1 Spacing Scale

All spacing uses a base-8 scale:

| Token | Value | Usage |
|---|---|---|
| `space-1` | 4px | Micro gaps (between icon and label) |
| `space-2` | 8px | Internal component padding |
| `space-3` | 12px | Small gaps between related elements |
| `space-4` | 16px | Standard component padding |
| `space-5` | 20px | Medium section gaps |
| `space-6` | 24px | Card padding |
| `space-8` | 32px | Large section gaps |
| `space-10` | 40px | Extra large gaps, hero padding |
| `space-16` | 64px | Section top/bottom padding |
| `space-24` | 96px | Hero section height base |

### 4.2 Container Widths

```css
/* Centered content container */
max-width: 1200px;
margin: 0 auto;
padding: 0 24px;  /* 24px horizontal padding on all screens */
```

### 4.3 Grid System

| Layout | Columns | Gap | Use case |
|---|---|---|---|
| Project grid (desktop) | 3 columns | 24px | Project card listings |
| Project grid (tablet) | 2 columns | 16px | Project card listings |
| Project grid (mobile) | 1 column | 16px | Project card listings |
| Category row | 6 columns | 16px | Category icon cards |
| Two-column form | 2 columns | 24px | Create/Edit project |
| Full-width | 1 column | — | Hero, sliders, page headers |

### 4.4 Border Radius

| Token | Value | Usage |
|---|---|---|
| `rounded-sm` | 6px | Small badges, tags, pills |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards, modals, images |
| `rounded-xl` | 16px | Large cards, featured sections |
| `rounded-full` | 9999px | Avatar circles, progress bars, round buttons |

### 4.5 Shadows

```css
/* Card default */
box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

/* Card hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

/* Modal / Dropdown */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);

/* Navbar */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
```

---

## 5. Components

### 5.1 Buttons

#### Primary Button
```tsx
// Background: #2FA084 | Hover: #1F6F5F | Text: #FFFFFF
<button className="bg-[#2FA084] hover:bg-[#1F6F5F] text-white 
                   font-medium text-sm px-6 py-2.5 rounded-lg 
                   transition-colors duration-200">
  Start a Campaign
</button>
```

#### Secondary Button (Outline)
```tsx
// Border: #2FA084 | Text: #2FA084 | Hover bg: #D1F2EB
<button className="border border-[#2FA084] text-[#2FA084] 
                   hover:bg-[#D1F2EB] font-medium text-sm 
                   px-6 py-2.5 rounded-lg transition-colors duration-200">
  Learn More
</button>
```

#### Danger Button
```tsx
// Background: #E53E3E | Hover: #C53030 | Text: #FFFFFF
<button className="bg-[#E53E3E] hover:bg-[#C53030] text-white 
                   font-medium text-sm px-6 py-2.5 rounded-lg 
                   transition-colors duration-200">
  Delete Account
</button>
```

#### Danger Ghost Button (subtle)
```tsx
// Text: #E53E3E | Hover bg: #FFF5F5 — used for low-emphasis danger
<button className="text-[#E53E3E] hover:bg-[#FFF5F5] font-medium 
                   text-sm px-4 py-2 rounded-lg transition-colors duration-200">
  Cancel Campaign
</button>
```

#### Button Sizes

| Size | Padding | Font size | Use case |
|---|---|---|---|
| Large | `px-8 py-3` | 16px | Hero CTA, Donate Now |
| Default | `px-6 py-2.5` | 14px | Most buttons |
| Small | `px-4 py-2` | 13px | Card actions, table row buttons |
| Icon-only | `p-2` | — | Icon buttons in navbar |

#### Button States

| State | Style |
|---|---|
| Default | Solid fill |
| Hover | Darken background by ~15% |
| Focus | `outline: 2px solid #2FA084; outline-offset: 2px` |
| Disabled | `opacity-50 cursor-not-allowed` — do not change color |
| Loading | Replace text with spinner + "Loading..." |

---

### 5.2 Input Fields

```tsx
// Default input
<input
  className="w-full bg-white border border-gray-200 rounded-lg 
             px-4 py-2.5 text-sm text-[#4A5568] 
             placeholder:text-[#A0AEC0]
             focus:outline-none focus:border-[#2FA084] 
             focus:ring-2 focus:ring-[#2FA084]/20
             transition-colors duration-200"
/>
```

#### Input States

| State | Border | Ring |
|---|---|---|
| Default | `#E2E8F0` (light gray) | none |
| Hover | `#CBD5E0` | none |
| Focus | `#2FA084` | `rgba(47, 160, 132, 0.2)` |
| Error | `#E53E3E` | `rgba(229, 62, 62, 0.2)` |
| Disabled | `#E2E8F0` | none — `bg-gray-50 cursor-not-allowed` |
| Locked (email) | `#E2E8F0` | none — show lock icon inside |

#### Form Label
```tsx
<label className="block text-sm font-medium text-[#4A5568] mb-1.5">
  Email address
</label>
```

#### Error Message
```tsx
<p className="mt-1 text-xs text-[#E53E3E]">
  Please enter a valid Egyptian phone number (01X-XXXX-XXXX)
</p>
```

---

### 5.3 Project Card

The project card is the most reused component in the entire app. Every instance must look identical.

```
┌─────────────────────────────┐
│  [Project Image — 16:9]     │
│                             │
│  [Category Badge]           │
├─────────────────────────────┤
│  Project Title (H3, 18px)   │
│  Short description (14px)   │
│                             │
│  ████████████░░░░  72%      │  ← #6FCF97 fill / #D1F2EB track
│  45,000 EGP raised          │
│  of 62,500 EGP goal         │
│                             │
│  ★★★★☆ 4.2   |  12 days left│
│  [Donate Now]               │
└─────────────────────────────┘
```

```tsx
// TypeScript interface
interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  raised: number;
  target: number;
  rating: number;
  daysLeft: number;
  isFeatured?: boolean;
}
```

**Card Rules:**
- Background: `#FFFFFF`
- Border: `1px solid #D1F2EB`
- Border radius: `12px`
- Shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Hover shadow: `0 4px 12px rgba(0,0,0,0.12)` + `transform: translateY(-2px)`
- Image aspect ratio: always `16:9`, `object-fit: cover`
- Title: max 2 lines, then `overflow: hidden; text-overflow: ellipsis`
- Description: max 2 lines, clipped
- "Featured" badge: `bg-[#D1F2EB] text-[#1F6F5F]` — top-left corner of image

---

### 5.4 Navbar

```
┌────────────────────────────────────────────────────────────┐
│ 🌱 FundEgypt    Explore   Categories   Start Campaign      Login  Register │
└────────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `#1F6F5F` |
| Text color | `#FFFFFF` |
| Height | `64px` |
| Position | `sticky top-0 z-50` |
| Shadow | `0 2px 8px rgba(0,0,0,0.08)` |
| Logo font | Inter 600, 20px, `#FFFFFF` |
| Nav links | Inter 400, 14px, `#FFFFFF`, hover: underline |
| Login button | Outline: `border-white text-white hover:bg-white/10` |
| Register button | `bg-[#2FA084] text-white hover:bg-[#6FCF97]` |

**Logged-in navbar** (replace Login/Register with):
- User avatar (circular, 32px)
- Username (truncated at 15 chars)
- Dropdown: My Profile · My Donations · Logout

---

### 5.5 Progress Bar

```tsx
interface ProgressBarProps {
  raised: number;
  target: number;
}

function ProgressBar({ raised, target }: ProgressBarProps) {
  const percent = Math.min(Math.round((raised / target) * 100), 100);
  const fillColor = percent < 25 ? '#E53E3E' : percent < 75 ? '#F57F17' : '#6FCF97';

  return (
    <div>
      <div className="bg-[#D1F2EB] rounded-full h-2 overflow-hidden">
        <div
          className="h-2 rounded-full transition-all duration-500"
          style={{ width: `${percent}%`, backgroundColor: fillColor }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-[#4A5568]">
          {raised.toLocaleString('ar-EG')} EGP raised
        </span>
        <span className="text-xs font-medium text-[#1F6F5F]">{percent}%</span>
      </div>
    </div>
  );
}
```

---

### 5.6 Badges & Tags

#### Category Badge (on cards)
```tsx
<span className="bg-[#D1F2EB] text-[#1F6F5F] text-xs font-medium 
                 px-2.5 py-1 rounded-full">
  Medical
</span>
```

#### Featured Badge (top corner of image)
```tsx
<span className="absolute top-3 left-3 bg-[#2FA084] text-white 
                 text-xs font-medium px-2.5 py-1 rounded-full">
  Featured
</span>
```

#### Tag Pill (on project pages)
```tsx
<span className="bg-[#EEEEEE] text-[#4A5568] text-xs font-medium 
                 px-3 py-1 rounded-full border border-gray-200">
  #education
</span>
```

#### Status Badge

| Status | Background | Text |
|---|---|---|
| Active | `#D1F2EB` | `#1F6F5F` |
| Completed | `#EBF8FF` | `#2B6CB0` |
| Cancelled | `#FFF5F5` | `#C53030` |
| Expired | `#F7FAFC` | `#718096` |

---

### 5.7 Star Rating

- Empty star: `#D1F2EB`
- Filled star: `#F6AD55` (amber — never use green for stars)
- Interactive: highlight on hover up to cursor position
- Size: 20px on cards, 24px on project detail page
- Show numeric value: `4.2` in `text-sm text-[#4A5568]` next to stars

---

### 5.8 Avatar

```tsx
// Profile picture circle
<img
  src={user.profilePic}
  alt={user.name}
  className="w-10 h-10 rounded-full object-cover border-2 border-[#D1F2EB]"
/>

// Fallback initials avatar (when no image)
<div className="w-10 h-10 rounded-full bg-[#2FA084] flex items-center 
                justify-center text-white text-sm font-medium">
  {initials}
</div>
```

---

### 5.9 Modal / Dialog

```
┌─────────────── Overlay (rgba(0,0,0,0.5)) ───────────────┐
│                                                          │
│    ┌─────────────────────────────────────────────┐      │
│    │  Modal Title (H3, #1F6F5F)          [✕]    │      │
│    ├─────────────────────────────────────────────┤      │
│    │  Modal body content here                    │      │
│    │                                             │      │
│    ├─────────────────────────────────────────────┤      │
│    │            [Cancel]  [Confirm Action]       │      │
│    └─────────────────────────────────────────────┘      │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

| Property | Value |
|---|---|
| Background | `#FFFFFF` |
| Border radius | `16px` |
| Max width | `480px` |
| Padding | `24px` |
| Title | H3, `#1F6F5F`, 18px, weight 600 |
| Close button | Top-right, icon-only, `text-[#A0AEC0] hover:text-[#4A5568]` |
| Footer buttons | Right-aligned, Cancel (outline) + Primary action |

---

### 5.10 Toast Notifications

| Type | Background | Left border | Icon |
|---|---|---|---|
| Success | `#F0FFF4` | `4px solid #2FA084` | ✓ in `#2FA084` |
| Error | `#FFF5F5` | `4px solid #E53E3E` | ✕ in `#E53E3E` |
| Warning | `#FFFFF0` | `4px solid #F57F17` | ⚠ in `#F57F17` |
| Info | `#EBF8FF` | `4px solid #3182CE` | ℹ in `#3182CE` |

- Position: `top-right`, `margin: 16px`
- Auto-dismiss: 4 seconds
- Border radius: `8px`
- Shadow: `0 4px 12px rgba(0,0,0,0.12)`

---

## 6. Page Specifications

### 6.1 Homepage

**Sections in order:**

| # | Section | Height | Notes |
|---|---|---|---|
| 1 | Sticky Navbar | 64px | Background `#1F6F5F` |
| 2 | Hero Banner | min 480px | Full-width, bg `#1F6F5F`, tagline + CTA |
| 3 | Top-Rated Slider | auto | Horizontal scroll, 5 cards, `#FFFFFF` cards |
| 4 | Latest Projects | auto | Section heading + 5-card grid (3 cols desktop) |
| 5 | Featured Projects | auto | Same grid + Featured badge on cards |
| 6 | Categories Row | auto | 6 icon cards in a row |
| 7 | Search Bar | auto | Centered, large, `#2FA084` focus border |
| 8 | Footer | auto | `#1F6F5F` background, white text |

**Hero section details:**
- Background: `#1F6F5F`
- Tagline: "Fund Your Dream, Change Egypt" — `heading-xl`, `#FFFFFF`
- Sub-tagline: 16px, `rgba(255,255,255,0.85)`
- CTA button: `bg-[#2FA084]`, large size, min-width `180px`
- Optional: background illustration or subtle pattern (opacity ≤ 0.1)

**Category icon cards:**
- Size: `120px × 120px`
- Background: `#FFFFFF`
- Border: `1px solid #D1F2EB`
- Icon: 32px, `#2FA084`
- Label: `text-sm font-medium text-[#1F6F5F]`
- Hover: `bg-[#D1F2EB]`

---

### 6.2 Register Page

- Page background: `#EEEEEE`
- Card: `#FFFFFF`, `border-radius: 16px`, `padding: 40px`, max-width `480px`, centered
- Title: "Create your account" — H2, `#1F6F5F`
- All 7 fields stacked vertically, `gap: 16px`
- Profile picture field: dashed border upload area, `#D1F2EB` dashed border, click or drag
- "Create Account" button: full width, large, `bg-[#2FA084]`
- Bottom link: "Already have an account? **Login**" — link in `#2FA084`

---

### 6.3 Login Page

- Same card layout as Register, max-width `400px`
- Title: "Welcome back"
- Email + Password fields only
- "Show password" toggle icon inside input (right side)
- "Forgot password?" link: `text-sm text-[#2FA084]`, right-aligned above button
- "Login" button: full width, large
- Divider: `──── or ────` in `#A0AEC0`
- "Continue with Facebook" button: `bg-[#1877F2] text-white`
- Bottom link: "Don't have an account? **Register**"

---

### 6.4 Activation Page

**State A — Success:**
- Large checkmark icon: `#2FA084`, 64px
- Title: "Account activated!" — H2, `#1F6F5F`
- Body: "You can now log in and start funding great projects."
- Button: "Go to Login" — primary button

**State B — Expired:**
- Warning triangle icon: `#F57F17`, 64px
- Title: "Link expired"
- Body: "Your activation link has expired. Request a new one below."
- Button: "Resend Activation Email" — primary button
- Note: Show success toast after resend

---

### 6.5 User Profile Page

- Cover banner: `background: #D1F2EB`, height `180px`
- Profile picture: circular, `100px`, centered, `border: 4px solid #FFFFFF`, overlaps banner bottom by 50px
- Name: H2, `#1F6F5F`, centered below avatar
- "Member since": `text-sm text-[#4A5568]`
- Tab nav: `My Projects | My Donations | About` — active tab has `border-bottom: 2px solid #2FA084 text-[#2FA084]`
- Edit Profile button: secondary outline button, top-right of card
- Delete Account: `text-sm text-[#E53E3E] hover:underline` — bottom of About tab

---

### 6.6 Project Detail Page

**Layout (top to bottom):**

| Element | Details |
|---|---|
| Image slider | Full-width, `height: 420px`, CSS scroll-snap, dot indicators |
| Project header | Title (H1), Category badge, Tags row |
| Progress section | Progress bar + raised/target amounts + days left badge |
| Action row | "Donate Now" (large primary), "Report Project" (ghost small) |
| Rating section | Average stars + "Rate this project" interactive stars |
| Creator card | Avatar, name, "View profile" link |
| Description | Full project description, `body-lg`, `text-[#4A5568]` |
| Comments section | Comment list + Add comment textarea |
| Similar projects | Horizontal scroll row, 4 cards |

**Donate Now button:** Large, full-width on mobile, `min-width: 200px` on desktop, `bg-[#2FA084]`

**Days left badge:**
```tsx
<span className="bg-[#FFF8E1] text-[#F57F17] text-sm font-medium px-3 py-1 rounded-full">
  12 days left
</span>
```

---

### 6.7 Create Project Page (3-Step Form)

**Step indicator at top:**
```
Step ①  ────  Step ②  ────  Step ③
Basic Info     Media          Goal
```
- Active step: `#2FA084` filled circle, white number
- Completed step: `#6FCF97` filled circle, white checkmark
- Upcoming step: `#D1F2EB` circle, `#A0AEC0` number

**Step 1 — Basic Info:**
- Title (text input)
- Category (select dropdown, styled)
- Details (textarea, min-height `160px`)

**Step 2 — Media & Tags:**
- Image upload: dashed border box, `border: 2px dashed #D1F2EB`, drag & drop, click to select
- Multiple images allowed, preview thumbnails below
- Tags input: type and press Enter to add, display as removable pill tags

**Step 3 — Goal & Schedule:**
- Total Target (number input + "EGP" suffix label)
- Start Date (date picker)
- End Date (date picker — must be after start date)

**Live preview card** (right column on desktop, hidden on mobile):
- Shows the ProjectCard component updating in real time as user types

---

### 6.8 Search Results Page

- Search bar at top, pre-filled with current query
- Results count: `"Showing 12 results for 'education'"` — `text-sm text-[#4A5568]`
- Filter sidebar (left, 240px wide on desktop):
  - Category (checkboxes)
  - Status (Active / Completed / Cancelled — radio)
  - Sort by (Latest / Most Funded / Highest Rated — radio)
- Project grid: 2 columns on desktop, 1 on mobile
- Empty state:
  - Illustration placeholder (plant with no water — or similar)
  - "No projects found" — H3, `#1F6F5F`
  - "Try a different keyword or browse categories" — `text-[#4A5568]`
  - "Browse Categories" button — secondary outline

---

## 7. Responsive Breakpoints

```css
/* Mobile first — these are Tailwind's defaults */
sm:   640px   /* Large phones, landscape */
md:   768px   /* Tablets */
lg:   1024px  /* Small desktop / laptop */
xl:   1280px  /* Standard desktop */
2xl:  1536px  /* Large desktop */
```

### Responsive Behavior Per Component

| Component | Mobile (< 768px) | Tablet (768–1024px) | Desktop (> 1024px) |
|---|---|---|---|
| Navbar | Hamburger menu | Hamburger menu | Full horizontal |
| Hero | Stacked, centered | Stacked | Side-by-side optional |
| Project grid | 1 column | 2 columns | 3 columns |
| Category row | 3 columns × 2 rows | 6 columns | 6 columns |
| Create project form | Single column, no preview | Single column | Two-column with preview |
| Project detail | Full-width single column | Full-width | Content + sidebar |
| Search filters | Bottom sheet / drawer | Sidebar | Sidebar |
| Navbar buttons | Stack in drawer | Visible | Visible |

---

## 8. Forms & Validation

### 8.1 Validation Rules

| Field | Rule |
|---|---|
| First name / Last name | Required, min 2 chars, max 50 chars |
| Email | Required, valid email format |
| Password | Required, min 8 chars, at least 1 uppercase + 1 number |
| Confirm password | Must match password exactly |
| Mobile phone | Must match Egyptian format: `^01[0125]\d{8}$` |
| Profile picture | Optional, max 5MB, formats: JPG, PNG, WEBP |
| Project title | Required, min 10 chars, max 100 chars |
| Project details | Required, min 50 chars |
| Total target | Required, number, min 1000 EGP |
| End date | Must be at least 7 days after start date |
| Comment | Required, min 1 char, max 1000 chars |
| Donation amount | Required, number, min 10 EGP |

### 8.2 Validation Timing

- Validate **on blur** (when user leaves field) — not on every keystroke
- Validate **on submit** — show all errors at once if any remain
- Clear error **on next input** (when user starts fixing)

### 8.3 Egyptian Phone Number Format

```tsx
// Validator function
export function isValidEgyptianPhone(phone: string): boolean {
  return /^01[0125]\d{8}$/.test(phone.replace(/[-\s]/g, ''));
}

// Accepted prefixes:
// 010 — Vodafone
// 011 — Etisalat
// 012 — Mobinil / Orange
// 015 — WE
```

---

## 9. States & Feedback

### 9.1 Loading States

Every data-fetching component must show a skeleton loader — never a blank screen or spinner alone.

```tsx
// Skeleton card (use for project cards while loading)
<div className="bg-white rounded-xl overflow-hidden border border-[#D1F2EB] animate-pulse">
  <div className="bg-[#EEEEEE] h-48 w-full" />
  <div className="p-4 space-y-3">
    <div className="bg-[#EEEEEE] h-4 rounded w-3/4" />
    <div className="bg-[#EEEEEE] h-3 rounded w-full" />
    <div className="bg-[#D1F2EB] h-2 rounded-full w-full" />
  </div>
</div>
```

### 9.2 Empty States

Every list that can be empty must show a helpful empty state:

| Page | Empty state message |
|---|---|
| My Projects | "You haven't created any projects yet. Start your first campaign!" |
| My Donations | "You haven't donated to any project yet. Explore projects." |
| Search results | "No results for '{query}'. Try a different keyword." |
| Comments | "No comments yet. Be the first to comment!" |
| Category page | "No active projects in this category yet." |

### 9.3 Error States

| Error | UI response |
|---|---|
| Network error | Toast: "Connection error. Please check your internet." |
| 401 Unauthorized | Redirect to Login page, clear auth tokens |
| 403 Forbidden | Show inline message: "You don't have permission to do this." |
| 404 Not Found | Show full 404 page with "Go Home" button |
| 500 Server Error | Toast: "Something went wrong. Please try again." |
| Form validation | Red border + error text under each invalid field |

---

## 10. Icons & Imagery

### 10.1 Icon Library

Use **Lucide React** for all icons:

```bash
npm install lucide-react
```

```tsx
import { Heart, Search, Star, ChevronRight, Upload } from 'lucide-react';

// Standard icon size: 20px
<Search size={20} color="#2FA084" />

// In buttons: 16px
<Upload size={16} className="mr-2" />
```

### 10.2 Icon Usage Reference

| Icon | Usage |
|---|---|
| `Heart` | Donate / like |
| `Star` | Rating |
| `Search` | Search bar |
| `Upload` | Image / file upload |
| `User` | Profile, avatar fallback |
| `Calendar` | Start / end date |
| `Clock` | Days remaining |
| `Flag` | Report |
| `ChevronRight` | Navigation arrows |
| `CheckCircle` | Success states |
| `AlertTriangle` | Warning / expired |
| `Lock` | Disabled email field |
| `LogOut` | Logout |
| `Plus` | Create new |
| `Edit` | Edit action |
| `Trash2` | Delete action |
| `MessageCircle` | Comments |
| `Share2` | Share project |

### 10.3 Project Images

- Aspect ratio: always `16:9`
- `object-fit: cover` — never stretch
- Border radius: `12px` on cards, `0` on full-width sliders
- Fallback: green gradient placeholder with project title initials
- Lazy load all images: use `loading="lazy"` attribute

---

## 11. Tailwind Configuration

Add this to your `tailwind.config.ts` to make all palette colors available as Tailwind classes:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary:   '#2FA084',
          secondary: '#1F6F5F',
          success:   '#6FCF97',
          mint:      '#D1F2EB',
        },
        surface: {
          page: '#EEEEEE',
          card: '#FFFFFF',
        },
        text: {
          heading:   '#1F6F5F',
          body:      '#4A5568',
          muted:     '#A0AEC0',
          disabled:  '#CBD5E0',
        },
        danger: {
          DEFAULT: '#E53E3E',
          light:   '#FFF5F5',
        },
        warning: {
          DEFAULT: '#F57F17',
          light:   '#FFF8E1',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm:  '6px',
        md:  '8px',
        lg:  '12px',
        xl:  '16px',
      },
      boxShadow: {
        card:       '0 1px 3px rgba(0,0,0,0.08)',
        'card-hover':'0 4px 12px rgba(0,0,0,0.12)',
        modal:      '0 8px 24px rgba(0,0,0,0.15)',
        navbar:     '0 2px 8px rgba(0,0,0,0.08)',
      },
    },
  },
  plugins: [],
}

export default config
```

---

## 12. Accessibility Guidelines

Every team member is responsible for accessibility in their own pages.

### 12.1 Color Contrast

| Pair | Contrast ratio | Pass/Fail |
|---|---|---|
| `#FFFFFF` on `#2FA084` | 3.8:1 | ⚠ AA Large only |
| `#FFFFFF` on `#1F6F5F` | 6.2:1 | ✅ AA + AAA |
| `#4A5568` on `#FFFFFF` | 7.4:1 | ✅ AA + AAA |
| `#1F6F5F` on `#FFFFFF` | 6.2:1 | ✅ AA + AAA |
| `#1F6F5F` on `#D1F2EB` | 4.8:1 | ✅ AA |
| `#FFFFFF` on `#E53E3E` | 4.5:1 | ✅ AA |

> **Note:** Use `#1F6F5F` (not `#2FA084`) for small text on white backgrounds to meet AA.

### 12.2 Required Attributes

```tsx
// Images must always have alt text
<img src={project.image} alt={`${project.title} campaign cover`} />

// Icon-only buttons must have aria-label
<button aria-label="Close dialog">
  <X size={20} />
</button>

// Form inputs must have associated labels
<label htmlFor="email">Email address</label>
<input id="email" type="email" />

// Loading states
<div role="status" aria-live="polite">Loading projects...</div>

// Modals must trap focus
// Use a library like @radix-ui/react-dialog
```

### 12.3 Keyboard Navigation

- All interactive elements must be reachable with `Tab`
- Focus ring must always be visible: `focus:ring-2 focus:ring-[#2FA084] focus:ring-offset-2`
- Never use `outline: none` without a replacement focus indicator
- Modals must trap focus inside when open
- Press `Escape` to close all modals and dropdowns

---

## 13. Do's & Don'ts

### Do's ✅

- Use `#1F6F5F` for all heading text on white backgrounds
- Use `#2FA084` for all primary interactive elements (buttons, links, active borders)
- Always show a loading skeleton while data is being fetched
- Always show an empty state when a list has no items
- Use `16px` as minimum body font size
- Use `border-radius: 12px` on all cards
- Use Inter font exclusively
- Add `transition-colors duration-200` to all interactive elements
- Write TypeScript interfaces for every API response
- Use `toLocaleString('ar-EG')` for displaying EGP amounts

### Don'ts ❌

- Don't use `#2FA084` for small body text (fails contrast on white)
- Don't use pure black `#000000` anywhere
- Don't show a blank screen while loading
- Don't mix border radius values — stick to the defined scale
- Don't use more than 2 font weights on the same element
- Don't use inline styles for colors — use Tailwind classes
- Don't hardcode strings — use constants or i18n keys
- Don't skip `alt` attributes on images
- Don't use `!important` in CSS
- Don't display raw numbers without `toLocaleString()` formatting

---

## Quick Reference Card

```
COLORS ─────────────────────────────────────────────
  Buttons / CTAs / Links:   #2FA084
  Hover / Navbar / Headings: #1F6F5F
  Progress bar fill (healthy): #6FCF97
  Mint accents / track:     #D1F2EB
  Page background:          #EEEEEE
  Cards:                    #FFFFFF
  Body text:                #4A5568
  Danger:                   #E53E3E

TYPOGRAPHY ──────────────────────────────────────────
  Font: Inter
  Hero: 36px / 700
  Page title: 28px / 600
  Section heading: 22px / 600
  Card title: 18px / 600
  Body: 16px / 400
  Small: 14px / 400
  Label: 12px / 500

SPACING (base-8) ────────────────────────────────────
  xs: 4px  |  sm: 8px  |  md: 16px
  lg: 24px  |  xl: 32px  |  2xl: 64px

BORDER RADIUS ───────────────────────────────────────
  Badges / pills: 6px
  Buttons / inputs: 8px
  Cards: 12px
  Large cards / modals: 16px
  Avatars / progress: 9999px
```

---

*FundEgypt Design System v1.0 — built by Team FundEgypt, April 2026*
