# Admin Panel - Complete Plan for Doctor Verification

## 🎯 GOAL

Build a secure admin panel where:
1. Admin can see all doctors waiting for verification
2. Admin can view doctor's documents/certificate
3. Admin can **APPROVE** the doctor (verified = TRUE)
4. Admin can **REJECT** the doctor with a reason
5. Only VERIFIED doctors appear in doctor search

---

## 📋 SIMPLE FLOW

```
Doctor Submits Registration
    ↓
Doctor Status = "Pending" (waiting for admin review)
    ↓
Admin Logs In (with ADMIN password)
    ↓
Admin sees:
  • Doctor's name
  • Clinic
  • Registration number
  • Document/certificate
    ↓
Admin clicks either:
  "✓ APPROVE" or "✗ REJECT"
    ↓
If APPROVE:
  • Doctor Status = "Verified"
  • Doctor can now be seen by patients
    
If REJECT:
  • Doctor Status = "Rejected"
  • Admin gives a reason
  • Doctor sees rejection reason and can register again
```

---

## 🔐 SECURITY - MOST IMPORTANT!

### Problem:
If ANYONE can become admin, the system is broken!

### Solution:
Use an ADMIN SECRET PASSWORD

**How it works:**

```
Person tries to access: /admin
    ↓
Admin page asks: "Enter Admin Password"
    ↓
Person enters password
    ↓
Password checks: Is it correct?
    ↓
  CORRECT → Show admin dashboard
  WRONG → Show error, block them
```

**Better Security (for future):**
- Admin login with email + password (set by owner)
- Admin role in database (admin = TRUE)
- Only people with admin role can access /admin

**For NOW (simple version):**
- Use a SECRET admin password in `.env.local`
- Person enters password to access admin panel

---

## 🗄️ DATABASE CHANGES NEEDED

### Current Doctor Verification Status:
```
Doctor has: verificationStatus = "pending" (always)
```

### After Changes:
```
Doctor has: verificationStatus = "pending" | "verified" | "rejected"
And: rejectionReason = "Reason why doctor was rejected"
```

**In prisma/schema.prisma:**
```prisma
model DoctorProfile {
  // ... existing fields ...
  
  verificationStatus    String   @default("pending")  // "pending", "verified", "rejected"
  rejectionReason      String?                        // Why rejected? (nullable - only if rejected)
  verifiedAt           DateTime?                      // When was doctor verified?
  verifiedByAdmin      String?                        // Which admin verified?
  
  // ... rest of fields ...
}
```

---

## 📁 FILES TO CREATE

### 1. Admin Login Page
**File:** `src/app/admin/login/page.tsx`

**What it does:**
- Shows a password input field
- Admin enters password
- Checks if password is correct
- If correct, saves admin session
- If wrong, shows error

**Explanation:**
```
Admin opens: http://localhost:3000/admin
    ↓
Sees login page with password field
    ↓
Enters password
    ↓
Clicks "Login"
    ↓
Frontend sends password to backend
    ↓
Backend checks: Is password correct?
    ↓
If YES: Creates admin session (token)
If NO: Shows error
```

---

### 2. Admin Dashboard Page
**File:** `src/app/admin/dashboard/page.tsx`

**What it does:**
- Shows list of all doctors waiting for verification
- Each doctor shows:
  - Name
  - Clinic name
  - City
  - Specialization
  - Registration number
  - Document URL (download/view)
  - Verification status (Pending/Verified/Rejected)
- Has buttons: "Approve" or "Reject"

**Explanation:**
```
Admin opens: http://localhost:3000/admin/dashboard
    ↓
Page loads
    ↓
Backend fetches: All doctors with status = "pending"
    ↓
Shows list of pending doctors
    ↓
Admin clicks a doctor's name
    ↓
Either:
  1. Goes to detail page, OR
  2. Shows modal (popup) with full details
```

---

### 3. Verify Doctor Detail Page
**File:** `src/app/admin/verify/[doctorId]/page.tsx`

**What it does:**
- Shows ONE doctor's full details
- Shows the uploaded document (if available)
- Has "Approve" button
- Has "Reject" button (with text field for reason)

**Explanation:**
```
Admin clicks on a doctor from the list
    ↓
Opens: http://localhost:3000/admin/verify/doctor123
    ↓
Page shows:
  • Full name
  • Clinic details
  • Professional details
  • Document/Certificate
  • Verification buttons
    ↓
Admin reviews all details
    ↓
Admin clicks either:
  1. "✓ Approve Doctor"
  2. "✗ Reject Doctor"
```

---

### 4. Backend API Routes

#### A. Admin Login API
**File:** `src/app/api/admin/login/route.ts`

**What it does:**
- Receives password from frontend
- Checks: Is password = ADMIN_PASSWORD?
- If yes: Creates admin session token
- If no: Returns error

**Simple Code:**
```typescript
export async function POST(request) {
  const { password } = await request.json();

  // Check if password matches the admin password in .env.local
  if (password !== process.env.ADMIN_PASSWORD) {
    return { error: 'Invalid password' };  // Wrong password
  }

  // If correct, create a session token
  const adminToken = generateToken();  // Create unique token
  
  return { 
    token: adminToken,
    message: 'Admin logged in successfully'
  };
}
```

---

#### B. Get Pending Doctors API
**File:** `src/app/api/admin/doctors/pending/route.ts`

**What it does:**
- Fetches all doctors with status = "pending"
- Sends back the list

**Simple Code:**
```typescript
export async function GET(request) {
  // Check: Is user logged in as admin?
  const isAdmin = checkAdminSession(request);
  
  if (!isAdmin) {
    return { error: 'Not authorized' };  // Not admin
  }

  // Get all doctors with pending status
  const pendingDoctors = await prisma.doctorProfile.findMany({
    where: { verificationStatus: 'pending' },
  });

  return { doctors: pendingDoctors };
}
```

---

#### C. Verify Doctor API
**File:** `src/app/api/admin/doctors/verify/route.ts`

**What it does:**
- Receives: doctor ID + action (approve/reject) + rejection reason
- Updates doctor's verification status
- If approved: Sets status = "verified"
- If rejected: Sets status = "rejected" + stores reason

**Simple Code:**
```typescript
export async function POST(request) {
  // Check: Is user logged in as admin?
  const isAdmin = checkAdminSession(request);
  
  if (!isAdmin) {
    return { error: 'Not authorized' };
  }

  const { doctorId, action, rejectionReason } = await request.json();

  // Validate action
  if (!['approve', 'reject'].includes(action)) {
    return { error: 'Invalid action' };
  }

  if (action === 'approve') {
    // Update doctor status to "verified"
    await prisma.doctorProfile.update({
      where: { id: doctorId },
      data: {
        verificationStatus: 'verified',
        verifiedAt: new Date(),
        verifiedByAdmin: 'AdminName',  // Could be admin's email
      },
    });

    return { message: 'Doctor approved successfully' };
  }

  if (action === 'reject') {
    if (!rejectionReason) {
      return { error: 'Rejection reason required' };
    }

    // Update doctor status to "rejected"
    await prisma.doctorProfile.update({
      where: { id: doctorId },
      data: {
        verificationStatus: 'rejected',
        rejectionReason: rejectionReason,
      },
    });

    return { message: 'Doctor rejected successfully' };
  }
}
```

---

#### D. Get Doctor Details API
**File:** `src/app/api/admin/doctors/[doctorId]/route.ts`

**What it does:**
- Receives: doctor ID
- Fetches that doctor's FULL details from database
- Sends back all information

**Simple Code:**
```typescript
export async function GET(request, { params }) {
  // Check: Is user logged in as admin?
  const isAdmin = checkAdminSession(request);
  
  if (!isAdmin) {
    return { error: 'Not authorized' };
  }

  const { doctorId } = params;

  // Get doctor's full details
  const doctor = await prisma.doctorProfile.findUnique({
    where: { id: doctorId },
    include: {
      user: true,  // Include user info
    },
  });

  if (!doctor) {
    return { error: 'Doctor not found' };
  }

  return { doctor };
}
```

---

## 🔒 SECURITY CHECKS

### What MUST happen for security:

1. **Admin Password Protection**
   ```
   Every admin page checks:
   "Is the admin session token valid?"
   
   If NO token → Redirect to /admin/login
   If token expired → Redirect to /admin/login
   If token invalid → Block access
   ```

2. **Middleware for Admin Routes**
   ```typescript
   // In src/middleware.ts
   // Add protection for admin routes
   
   const adminRoutes = [
     '/admin/login',
     '/admin/dashboard',
     '/admin/verify/:path*',
   ];
   
   // Before accessing admin routes:
   // Check if admin session is valid
   ```

3. **Backend Validation**
   ```
   Before updating doctor verification:
   ✓ Check: Is user logged in as admin?
   ✓ Check: Does doctor exist?
   ✓ Check: Is action valid (approve/reject)?
   ✓ Check: If rejecting, is reason provided?
   ```

4. **Admin Session Token**
   ```
   When admin logs in:
   - Create a special token (similar to user login)
   - Store in browser (httpOnly cookie)
   - Expires after 24 hours (for security)
   - Cannot be guessed (use strong random generation)
   ```

---

## 📊 COMPLETE FLOW WITH FILES

```
Step 1: Admin Tries to Access
┌─────────────────────────────────────┐
│ Admin opens: http://localhost:3000/admin
│ File: src/app/admin/login/page.tsx
│ Shows: Password input field
└─────────────────────────────────────┘
            ↓
Step 2: Admin Enters Password
┌─────────────────────────────────────┐
│ Admin types password
│ Admin clicks "Login"
│ File: src/app/admin/login/page.tsx
└─────────────────────────────────────┘
            ↓
Step 3: Backend Checks Password
┌─────────────────────────────────────┐
│ API Route: /api/admin/login
│ File: src/app/api/admin/login/route.ts
│ Checks: Is password correct?
│ YES: Returns admin token
│ NO: Returns error
└─────────────────────────────────────┘
            ↓
Step 4: Admin Sees Dashboard
┌─────────────────────────────────────┐
│ Redirects to: /admin/dashboard
│ File: src/app/admin/dashboard/page.tsx
│ Shows: List of pending doctors
│ API: GET /api/admin/doctors/pending
└─────────────────────────────────────┘
            ↓
Step 5: Admin Clicks on Doctor
┌─────────────────────────────────────┐
│ Redirects to: /admin/verify/doctor123
│ File: src/app/admin/verify/[doctorId]/page.tsx
│ Shows: Full doctor details
│ API: GET /api/admin/doctors/doctor123
└─────────────────────────────────────┘
            ↓
Step 6: Admin Reviews and Decides
┌─────────────────────────────────────┐
│ Admin reads all details
│ Admin views certificate/document
│ Admin clicks either:
│   "✓ Approve" OR "✗ Reject"
└─────────────────────────────────────┘
            ↓
Step 7: Backend Updates Database
┌─────────────────────────────────────┐
│ API Route: /api/admin/doctors/verify
│ File: src/app/api/admin/doctors/verify/route.ts
│ Updates DoctorProfile:
│   verificationStatus = "verified" or "rejected"
│   rejectionReason = reason (if rejected)
│   verifiedAt = current date/time
└─────────────────────────────────────┘
            ↓
Step 8: Doctor Sees Result
┌─────────────────────────────────────┐
│ Doctor logs in
│ File: src/app/doctor/dashboard/page.tsx
│ Shows: verificationStatus
│ If rejected: Shows rejection reason
│ If approved: Shows "Verified" badge
└─────────────────────────────────────┘
```

---

## 📁 NEW FILES STRUCTURE

After building admin panel:

```
src/
├── app/
│   ├── admin/                                ← NEW ADMIN AREA
│   │   ├── login/
│   │   │   └── page.tsx                      ← Admin login page
│   │   ├── dashboard/
│   │   │   └── page.tsx                      ← List of pending doctors
│   │   └── verify/
│   │       └── [doctorId]/
│   │           └── page.tsx                  ← Doctor detail & verify
│   │
│   ├── api/
│   │   ├── admin/                            ← NEW ADMIN APIs
│   │   │   ├── login/
│   │   │   │   └── route.ts                  ← Check password
│   │   │   └── doctors/
│   │   │       ├── pending/
│   │   │       │   └── route.ts              ← Get pending doctors
│   │   │       ├── verify/
│   │   │       │   └── route.ts              ← Approve/reject doctor
│   │   │       └── [doctorId]/
│   │   │           └── route.ts              ← Get one doctor details
│   │
│   └── ... (existing patient/doctor pages)
│
└── ... (existing files)
```

---

## 🔑 ENVIRONMENT VARIABLES TO ADD

In `.env.local`:

```
# Admin Configuration
ADMIN_PASSWORD=your_super_secret_admin_password_123
ADMIN_SESSION_SECRET=another_secret_key_for_admin_tokens
ADMIN_SESSION_EXPIRY_HOURS=24
```

---

## 🛡️ SECURITY CHECKLIST

- [ ] Admin password stored in `.env.local` (NOT in code)
- [ ] Admin session token is random and cannot be guessed
- [ ] Admin session expires after 24 hours
- [ ] Middleware checks admin session on every admin page
- [ ] Backend validates admin session on every API request
- [ ] Rejection reason is required when rejecting
- [ ] Doctor details are only shown to admins
- [ ] Non-admins cannot access /admin routes
- [ ] Admin token stored in httpOnly cookie (cannot be stolen by JavaScript)

---

## 📊 DATABASE UPDATES NEEDED

### Current DoctorProfile:
```prisma
model DoctorProfile {
  verificationStatus    String   @default("pending")  // Only "pending"
  rejectionReason      String?                        // Doesn't exist yet
  verifiedAt           DateTime?                      // Doesn't exist yet
  verifiedByAdmin      String?                        // Doesn't exist yet
}
```

### After Changes:
```prisma
model DoctorProfile {
  verificationStatus    String   @default("pending")  // "pending", "verified", "rejected"
  rejectionReason      String?                        // Reason if rejected
  verifiedAt           DateTime?                      // When was doctor verified?
  verifiedByAdmin      String?                        // Which admin verified? (email)
}
```

**You'll need to run a database migration:**
```bash
npx prisma migrate dev --name add_verification_fields
```

---

## 🎯 ADDITIONAL IDEAS (For Later)

1. **Admin Statistics Dashboard**
   ```
   Show:
   • Total doctors: 50
   • Pending verification: 12
   • Verified doctors: 35
   • Rejected doctors: 3
   ```

2. **Bulk Actions**
   ```
   Admin can:
   • Select multiple doctors
   • Approve all at once
   • Reject all at once
   ```

3. **Search & Filter**
   ```
   Admin can:
   • Search doctor by name
   • Filter by city
   • Filter by specialization
   • Filter by verification status
   ```

4. **Audit Log**
   ```
   Track:
   • Who verified which doctor
   • When was it verified
   • What was the reason for rejection
   • Can admin change a decision?
   ```

5. **Notification System**
   ```
   Doctor gets:
   • Email when approved
   • Email when rejected (with reason)
   • Email when verification is pending
   ```

---

## ✅ STEPS TO BUILD (IN ORDER)

1. **Update database schema** (add verification fields)
2. **Create admin login page** (password input)
3. **Create admin login API** (check password)
4. **Create pending doctors list API**
5. **Create admin dashboard page** (show pending doctors)
6. **Create doctor detail page** (show all info + document)
7. **Create verify doctor API** (approve/reject)
8. **Update middleware** (protect admin routes)
9. **Add admin session middleware**
10. **Test everything**

---

## 💡 KEY POINTS

- Admin panel is **COMPLETELY SEPARATE** from patient/doctor areas
- Only people who know the admin password can access it
- Admin can approve or reject doctors
- Once approved, doctor's status changes to "verified"
- Non-verified doctors CANNOT be seen by patients (filter them out)
- Admins can see rejection reason on dashboard
- Doctors can see rejection reason in their dashboard

---

## 🚀 READY TO BUILD?

Once you understand this plan, I can build:

1. All the admin pages
2. All the admin API routes
3. Database migration
4. Middleware protection
5. With FULL comments explaining everything

Just say: **"Build the admin panel"** and I'll create everything step by step with explanations!

---

## ❓ SECURITY QUESTIONS & ANSWERS

**Q: What if someone guesses the admin password?**
A: The password should be very long and random (at least 20 characters). Store it in .env.local, not in code. Change it regularly.

**Q: What if someone steals the admin session token?**
A: The token is stored in an httpOnly cookie, which JavaScript cannot access. It expires after 24 hours. Better security: use email + password login for admin.

**Q: What if an admin accidentally rejects a good doctor?**
A: The admin can approve them again. Or we can add "undo" functionality later.

**Q: Can a doctor appeal if rejected?**
A: Doctor can register again with new documents. Or admin can manually change status. We can add appeal system later.

**Q: Who can see the documents?**
A: Only the admin. Not even the patient can see doctor's certificate.

**Q: What if admin is offline?**
A: Doctor stays in "pending" status. No automatic approval. Manual review only.
