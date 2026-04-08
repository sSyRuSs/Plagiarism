# Plagiarism Checker Website Specification

## 1. Project Overview

**Project Name:** Plagiarism Checker
**Project Type:** Web Application (Next.js Static Export)
**Core Functionality:** A client-side plagiarism checking tool that compares text input against sample documents to detect similarity/copying
**Target Users:** Students, teachers, writers, content creators

---

## 2. UI/UX Specification

### Layout Structure

- **Header:** Fixed navigation with logo and nav links
- **Hero Section:** Main landing area with tool access
- **Main Content:** Text input area + results display
- **Footer:** Credits and links

### Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### Visual Design

**Color Palette:**
- Primary: `#1a1a2e` (Deep Navy)
- Secondary: `#16213e` (Dark Blue)
- Accent: `#e94560` (Coral Red)
- Background: `#0f0f1a` (Near Black)
- Surface: `#1f1f3a` (Card Background)
- Text Primary: `#eaeaea`
- Text Secondary: `#a0a0b0`
- Success: `#4ade80`
- Warning: `#fbbf24`
- Error: `#ef4444`

**Typography:**
- Heading Font: `Outfit` (Google Fonts)
- Body Font: `DM Sans` (Google Fonts)
- H1: 48px / 700 weight
- H2: 32px / 600 weight
- H3: 24px / 600 weight
- Body: 16px / 400 weight
- Small: 14px / 400 weight

**Spacing System:**
- Base unit: 8px
- Sections: 80px vertical padding
- Cards: 24px padding
- Elements: 16px gap

**Visual Effects:**
- Card shadows: `0 4px 24px rgba(233, 69, 96, 0.1)`
- Hover transitions: 300ms ease
- Glassmorphism on cards: `backdrop-filter: blur(10px)`
- Subtle gradient overlays

### Components

1. **Navigation Bar**
   - Logo (text-based)
   - Nav links: Home, How It Works, About
   - Transparent → solid on scroll

2. **Hero Section**
   - Large headline
   - Subtitle description
   - CTA button

3. **Text Input Area**
   - Large textarea (min 200px height)
   - Character count display
   - Clear button
   - Sample text button

4. **Results Panel**
   - Similarity percentage (circular progress)
   - Match highlights (colored text spans)
   - Match list with sources
   - Copy report button

5. **How It Works Section**
   - 3-step process cards
   - Icons for each step

6. **Footer**
   - Simple copyright text

---

## 3. Functionality Specification

### Core Features

1. **Text Input**
   - Accept plain text input
   - Minimum 50 characters required
   - Maximum 10,000 characters
   - Display character/word count

2. **Plagiarism Detection Algorithm**
   - N-gram based similarity (trigrams)
   - Fuzzy matching with threshold (80% similarity)
   - Compare against onboard sample database
   - Return match percentage and locations

3. **Results Display**
   - Overall similarity percentage
   - Highlight matched portions in input
   - List individual matches with source
   - Export results as text

4. **Sample Database**
   - Pre-loaded sample texts (5-10 documents)
   - Topics: academic, creative, technical

### User Interactions

1. User enters/pastes text into textarea
2. Clicks "Check for Plagiarism" button
3. System processes and displays results
4. User can view highlighted matches
5. User can clear and start over

### Edge Cases

- Empty input: Show validation error
- Too short: Show minimum character warning
- No matches found: Show success message
- Very high similarity: Show alert

---

## 4. Technical Specification

### Stack
- Next.js 14 (App Router)
- TypeScript
- CSS Modules (no Tailwind)
- Static export for GitHub Pages

### GitHub Actions Deployment
- Build Next.js app
- Deploy to GitHub Pages
- Trigger on push to main branch

### File Structure
```
/app
  /page.tsx
  /layout.tsx
  /globals.css
/components
  /Header.tsx
  /Hero.tsx
  /TextInput.tsx
  /Results.tsx
  /HowItWorks.tsx
  /Footer.tsx
/public
  /samples/ (reference documents)
/scripts/
  /checkPlagiarism.ts (algorithm)
/.next/
  (build output - GitHub Pages)
.github/
  /workflows/
    /deploy.yml
```

---

## 5. Acceptance Criteria

- [ ] Next.js app initializes and runs locally
- [ ] UI matches color palette and typography specs
- [ ] Text input accepts and validates text
- [ ] Plagiarism checker returns similarity percentage
- [ ] Matched text is highlighted in results
- [ ] Responsive design works on all breakpoints
- [ ] GitHub Actions builds and deploys successfully
- [ ] Deployed site is accessible on GitHub Pages