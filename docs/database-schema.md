# Mashwara Database Schema

## Overview
Database schema for Mashwara - Teacher Rating Application for Karachi educational institutions.

## Core Entities

### 1. Institution
Educational institutions (universities, colleges, schools) in Karachi.

```sql
Institution {
  id: UUID (PK)
  name: String (unique)
  abbreviation: String (unique, nullable) -- e.g., "IBA", "NEDUET"
  type: Enum ['UNIVERSITY', 'COLLEGE', 'SCHOOL']
  location: String -- Area in Karachi
  website: String (nullable)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 2. Department
Departments within institutions.

```sql
Department {
  id: UUID (PK)
  name: String
  institutionId: UUID (FK -> Institution)
  createdAt: DateTime
  updatedAt: DateTime

  UNIQUE(institutionId, name) -- Same department name per institution
}
```

### 3. User
Students and administrators.

```sql
User {
  id: UUID (PK)
  email: String (unique)
  password: String (hashed)
  firstName: String
  lastName: String
  role: Enum ['STUDENT', 'ADMIN']
  institutionId: UUID (FK -> Institution, nullable)
  isVerified: Boolean (default: false)
  createdAt: DateTime
  updatedAt: DateTime
}
```

### 4. Teacher
Teachers/professors at institutions.

```sql
Teacher {
  id: UUID (PK)
  firstName: String
  lastName: String
  institutionId: UUID (FK -> Institution)
  departmentId: UUID (FK -> Department)

  -- Aggregated ratings (computed from approved reviews)
  averageRating: Decimal (nullable, 1-5 scale)
  totalReviews: Integer (default: 0)

  -- Additional info
  title: String (nullable) -- e.g., "Dr.", "Professor"
  isActive: Boolean (default: true)

  createdAt: DateTime
  updatedAt: DateTime

  UNIQUE(institutionId, firstName, lastName) -- Prevent duplicates
}
```

### 5. Review
Student reviews of teachers with moderation workflow.

```sql
Review {
  id: UUID (PK)
  userId: UUID (FK -> User) -- Student who wrote review
  teacherId: UUID (FK -> Teacher)

  -- Review content
  rating: Integer (1-5)
  comment: Text
  courseCode: String (nullable) -- e.g., "CS-101"
  courseName: String (nullable)
  semester: String (nullable) -- e.g., "Fall 2024"

  -- Moderation workflow
  status: Enum ['PENDING', 'APPROVED', 'REJECTED']
  moderatedBy: UUID (FK -> User, nullable) -- Admin who moderated
  moderatedAt: DateTime (nullable)
  moderationNotes: Text (nullable) -- Reason for rejection

  createdAt: DateTime
  updatedAt: DateTime

  UNIQUE(userId, teacherId) -- One review per student per teacher
  INDEX(status) -- Fast filtering by status
  INDEX(teacherId, status) -- Fast approved reviews per teacher
}
```

### 6. ReviewFlag
Allow users to flag inappropriate reviews.

```sql
ReviewFlag {
  id: UUID (PK)
  reviewId: UUID (FK -> Review)
  reportedBy: UUID (FK -> User)
  reason: Enum ['INAPPROPRIATE', 'SPAM', 'FAKE', 'OTHER']
  description: Text (nullable)
  status: Enum ['PENDING', 'RESOLVED', 'DISMISSED']
  resolvedBy: UUID (FK -> User, nullable)
  resolvedAt: DateTime (nullable)
  createdAt: DateTime
  updatedAt: DateTime
}
```

## Relationships

```
Institution (1) -> (Many) Department
Institution (1) -> (Many) Teacher
Institution (1) -> (Many) User

Department (1) -> (Many) Teacher

User (1) -> (Many) Review (as author)
User (1) -> (Many) Review (as moderator)
User (1) -> (Many) ReviewFlag

Teacher (1) -> (Many) Review

Review (1) -> (Many) ReviewFlag
```

## Key Constraints & Business Rules

1. **One Review Per Student Per Teacher**: `UNIQUE(userId, teacherId)` on Review table
2. **Only Approved Reviews Count**: Teacher ratings calculated only from `status = 'APPROVED'` reviews
3. **Moderation Required**: New reviews default to `status = 'PENDING'`
4. **Data Integrity**: Foreign keys with CASCADE on delete where appropriate
5. **Soft Deletes**: Consider adding `deletedAt` for soft deletes (future enhancement)

## Indexes for Performance

```sql
-- Review table
CREATE INDEX idx_reviews_teacher_status ON Review(teacherId, status);
CREATE INDEX idx_reviews_user ON Review(userId);
CREATE INDEX idx_reviews_status ON Review(status);

-- Teacher table
CREATE INDEX idx_teachers_institution ON Teacher(institutionId);
CREATE INDEX idx_teachers_department ON Teacher(departmentId);

-- User table
CREATE INDEX idx_users_email ON User(email);
CREATE INDEX idx_users_institution ON User(institutionId);
```

## Sample Data Requirements

Initial seed data should include:
- 2-3 Karachi institutions (IBA, NEDUET, Karachi University)
- 2-3 departments per institution
- 5-10 teachers per institution
- 1-2 admin users
- 3-5 student users
- 10-15 sample reviews (mix of pending/approved/rejected)
