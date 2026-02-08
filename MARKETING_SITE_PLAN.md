# 🚀 Modern Marketing Website Implementation Plan
**Objective:** Create a high-converting, visually stunning, and animated landing website for "Agency OS".

## 1. Technology Stack
*   **Framework:** Next.js 14+ (Existing)
*   **Styling:** Tailwind CSS (Existing)
*   **Animations:** `framer-motion` (Standard for React animations)
*   **Icons:** `lucide-react` (Existing)
*   **Fonts:** `Inter` (Body) + `Outfit` or `Space Grotesk` (Headings for modern look)

## 2. Architecture & Structure
We will separate the marketing pages from the application dashboard to allow for different layouts (e.g., Marketing needs a public Navbar/Footer, Dashboard needs a Sidebar).

```
src/app/
├── (marketing)/          # New Route Group for Marketing Site
│   ├── layout.tsx        # Marketing Navbar & Footer
│   ├── page.tsx          # Homepage (Hero, Features, Pricing)
│   ├── about/            # About Page
│   │   └── page.tsx
│   ├── services/         # Services/Features Page
│   │   └── page.tsx
│   └── contact/          # Contact Page
│       └── page.tsx
├── (auth)/               # Existing Auth Pages
├── dashboard/            # Existing App Pages
```

## 3. Design Language & Aesthetics
*   **Theme:** "Dark Mode First" or "Clean Glassmorphism".
    *   *Primary:* Indigo (#6366f1) & Violet (#8b5cf6) gradients.
    *   *Background:* Deep Zinc (#09090b) or White with slight noise texture.
*   **Animations:**
    *   **Scroll Reveal:** Elements fade in and slide up as you scroll.
    *   **Parallax:** Subtle movement of background elements.
    *   **Hover Effects:** Glows and scale effects on cards.
*   **Imagery:** High-fidelity screenshots of the app (Dashboard) placed inside sleek device frames (Macbook/iPhone mockups).

## 4. Development Steps

### Phase 1: Setup & Foundation
1.  Install `framer-motion` and `clsx` / `tailwind-merge`.
2.  Create `src/components/marketing/` directory.
3.  Build a **Marketing Navbar**:
    *   Logo (Left)
    *   Links: Home, Features, About, Pricing (Center)
    *   Buttons: Login (Ghost), Register (Gradient Primary) (Right)
4.  Build a **Marketing Footer**:
    *   Links, Social Icons, Newsletter signup.

### Phase 2: The Homepage "Wow" Factor
1.  **Hero Section:**
    *   Big, bold H1 Headline with gradient text.
    *   Subtext explaining the value proposition.
    *   Two CTA buttons ("Get Started", "View Demo").
    *   **Visual:** A 3D-tilted or floating screenshot of the Dashboard.
2.  **Logo Cloud:** "Trusted by" section with grayed-out company logos (Social Proof).

### Phase 3: Showcasing the Product (Features)
1.  **Bento Grid Layout:** A trendy grid varying box sizes showing different features (e.g., "Real-time Chat", "Kanban Board").
2.  **Interactive Tabs:** Click a feature name -> Change the screenshot/illustration.
3.  **Project Showcase:** A slider or carousel showing specific project case studies or templates.

### Phase 4: Pricing & Conversion
1.  **Pricing Section:** Display the 3 plans (Starter, Pro, Enterprise).
    *   *Action:* Link these "Subscribe" buttons directly to the `/register?plan=PRO` or stripe checkout flow.
2.  **CTA Section:** A final large banner at the bottom encouraging sign-ups.

### Phase 5: Additional Pages
1.  **About Us:** Team photos, Mission statement, animated numbers (e.g., "1000+ Users").
2.  **Contact:** Simple form (name, email, message) + Email links.

## 5. Implementation Roadmap for AI Assistant
*   **Step 1:** Create `(marketing)` layout and install dependencies.
*   **Step 2:** Build the `Hero` component with animations.
*   **Step 3:** Build the `Navbar` and `Footer`.
*   **Step 4:** Implement the `Features` section using the Bento Grid design.
*   **Step 5:** Create the `Pricing` component using real data from our previous plan setup.
*   **Step 6:** Polish and Responsiveness check.
