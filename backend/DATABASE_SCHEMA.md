# 🗄️ Velion DKN Database Schema Documentation

## Database Type
**SQLite** - Lightweight, file-based relational database (`dkn.db`)

---

## 📋 Table of Contents
1. [Users](#users-table)
2. [Consultants](#consultants-table)
3. [Knowledge Assets](#knowledge-assets-table)
4. [Trainings](#trainings-table)
5. [Leaderboard](#leaderboard-table)
6. [Audit Entries](#audit-entries-table)
7. [AI Recommendations](#ai-recommendations-table)
8. [Repository](#repository-table)
9. [Metadata](#metadata-table)
10. [Initialization Process](#initialization-process)

---

## Tables

### 1. Users Table
**Purpose**: Authentication and user management

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique user identifier |
| `email` | TEXT | UNIQUE, NOT NULL | User email (login credential) |
| `password` | TEXT | NOT NULL | Bcrypt hashed password |
| `name` | TEXT | NOT NULL | Full name of user |
| `role` | TEXT | NOT NULL | User role (Admin, Consultant, etc.) |
| `isActive` | INTEGER | DEFAULT 1 | Account status (1=active, 0=inactive) |
| `lastLogin` | TEXT | | ISO timestamp of last login |
| `createdAt` | TEXT | | ISO timestamp of account creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`
- Unique: `email`

**Default Data**:
- Admin User (ID: `admin-001`)
  - Email: `admin@veliondynamics.com`
  - Password: `admin123` (hashed)

---

### 2. Consultants Table
**Purpose**: Consultant profiles and expertise tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique consultant identifier |
| `name` | TEXT | NOT NULL | Full name |
| `email` | TEXT | UNIQUE, NOT NULL | Email address |
| `password` | TEXT | NOT NULL | Bcrypt hashed password |
| `role` | TEXT | NOT NULL | Consultant role/title |
| `department` | TEXT | | Department name |
| `yearsOfExperience` | INTEGER | | Years of professional experience |
| `points` | INTEGER | DEFAULT 0 | Gamification points earned |
| `contributions` | INTEGER | DEFAULT 0 | Number of contributions made |
| `certifications` | TEXT | | JSON string of certifications |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`
- Unique: `email`

---

### 3. Knowledge Assets Table
**Purpose**: Storage and management of knowledge documents/resources

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique asset identifier |
| `title` | TEXT | NOT NULL | Asset title |
| `description` | TEXT | | Detailed description |
| `category` | TEXT | | Category/classification |
| `content` | TEXT | | Main content/body |
| `author` | TEXT | | Author name |
| `authorId` | TEXT | | Reference to user/consultant ID |
| `status` | TEXT | DEFAULT 'pending' | Review status (pending, approved, rejected) |
| `reviewStatus` | TEXT | DEFAULT 'pending' | Admin review status |
| `reviewedBy` | TEXT | | ID of reviewer |
| `reviewComments` | TEXT | | Reviewer's feedback |
| `tags` | TEXT | | JSON array of tags |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`

**Status Values**:
- `pending`: Awaiting review
- `approved`: Reviewed and approved
- `rejected`: Rejected with comments

---

### 4. Trainings Table
**Purpose**: Training modules and courses

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique training identifier |
| `title` | TEXT | NOT NULL | Training title |
| `description` | TEXT | | Course description |
| `content` | TEXT | | Training content/curriculum |
| `instructor` | TEXT | | Instructor name |
| `duration` | INTEGER | | Duration in minutes |
| `level` | TEXT | | Difficulty level (Beginner, Intermediate, Advanced) |
| `status` | TEXT | DEFAULT 'published' | Publication status |
| `tags` | TEXT | | JSON array of tags |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`

**Default Training Modules**:
1. Introduction to Cloud Migration (45 mins)
2. Agile Project Management Essentials (60 mins)
3. Data Security & Compliance (90 mins)
4. Digital Transformation Strategy (75 mins)
5. API Design & Microservices (120 mins)

---

### 5. Leaderboard Table
**Purpose**: Gamification and performance tracking

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique entry identifier |
| `userId` | TEXT | UNIQUE, NOT NULL | Reference to user ID |
| `name` | TEXT | NOT NULL | User display name |
| `role` | TEXT | | User role |
| `points` | INTEGER | DEFAULT 0 | Total points earned |
| `submissions` | INTEGER | DEFAULT 0 | Number of asset submissions |
| `reviews` | INTEGER | DEFAULT 0 | Number of reviews completed |
| `rank` | INTEGER | | Current rank position |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`
- Unique: `userId`

**Ranking Logic**: Sorted by `points` descending

---

### 6. Audit Entries Table
**Purpose**: System activity logging and compliance

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique audit entry identifier |
| `action` | TEXT | NOT NULL | Action performed |
| `userId` | TEXT | | ID of user who performed action |
| `userName` | TEXT | | Name of user |
| `targetType` | TEXT | | Type of target entity (asset, user, etc.) |
| `targetId` | TEXT | | ID of target entity |
| `changes` | TEXT | | JSON object of changes made |
| `timestamp` | TEXT | | ISO timestamp of action |

**Indexes**: 
- Primary: `id`

**Common Actions**:
- User Login
- Asset Created
- Asset Updated
- Asset Approved
- Asset Rejected
- Training Completed

---

### 7. AI Recommendations Table
**Purpose**: AI-generated recommendations for users

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique recommendation identifier |
| `consultantId` | TEXT | NOT NULL | Target consultant ID |
| `title` | TEXT | | Recommendation title |
| `description` | TEXT | | Detailed description |
| `type` | TEXT | | Type (asset, training, expert, etc.) |
| `priority` | TEXT | | Priority level (high, medium, low) |
| `status` | TEXT | DEFAULT 'pending' | Status (pending, viewed, dismissed) |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`

---

### 8. Repository Table
**Purpose**: Knowledge asset repository index

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique repository entry identifier |
| `assetId` | TEXT | UNIQUE | Reference to knowledge asset ID |
| `title` | TEXT | | Asset title (cached) |
| `category` | TEXT | | Asset category (cached) |
| `status` | TEXT | | Asset status (cached) |
| `createdAt` | TEXT | | ISO timestamp of creation |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`
- Unique: `assetId`

---

### 9. Metadata Table
**Purpose**: System configuration and key-value storage

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique metadata identifier |
| `key` | TEXT | UNIQUE, NOT NULL | Configuration key |
| `value` | TEXT | | Configuration value (can be JSON) |
| `updatedAt` | TEXT | | ISO timestamp of last update |

**Indexes**: 
- Primary: `id`
- Unique: `key`

**Example Keys**:
- `system.version`
- `database.schema_version`
- `ai.recommendations_enabled`

---

## Initialization Process

### Automated Initialization
The database is automatically initialized when the server starts via `database.js`:

```javascript
const db = new SQLiteDatabase('./dkn.db');
```

This creates all tables if they don't exist.

### Manual Initialization
Run the initialization script to add default data:

```bash
cd backend
node init-db.js
```

**What it does**:
- ✅ Creates all database tables (if not exist)
- ✅ Adds default admin user (if not exists)
- ✅ Adds default training modules (if not exist)
- ✅ **PRESERVES** all existing data (never deletes)
- ✅ Safe to run multiple times

### Safety Features
- **Non-destructive**: Never deletes existing data
- **Idempotent**: Can be run multiple times safely
- **Preserves Users**: All user accounts are kept intact
- **Preserves Assets**: All knowledge assets remain unchanged

---

## Relationships

```
┌─────────────┐
│   Users     │──────┐
│  (Auth)     │      │
└─────────────┘      │
                     │
┌─────────────┐      │    ┌──────────────────┐
│ Consultants │──────┼───▶│ Knowledge Assets │
│             │      │    │                  │
└─────────────┘      │    └──────────────────┘
       │             │              │
       │             │              │
       ▼             │              ▼
┌─────────────┐      │    ┌──────────────────┐
│ Leaderboard │      │    │   Repository     │
└─────────────┘      │    └──────────────────┘
                     │
       ┌─────────────┘
       │
       ▼
┌──────────────────┐
│  Audit Entries   │
└──────────────────┘

┌─────────────┐
│  Trainings  │
└─────────────┘

┌────────────────────┐
│ AI Recommendations │
└────────────────────┘

┌─────────────┐
│  Metadata   │
└─────────────┘
```

---

## Common Queries

### Get All Approved Assets
```javascript
const assets = await db.findMany('knowledgeAssets', { status: 'approved' });
```

### Get User's Leaderboard Position
```javascript
const entry = await db.findMany('leaderboard', { userId: 'user-123' });
```

### Create Audit Log
```javascript
await db.insert('auditEntries', {
  action: 'Asset Approved',
  userId: 'admin-001',
  userName: 'Admin User',
  targetType: 'knowledgeAsset',
  targetId: 'asset-456',
  timestamp: new Date().toISOString()
});
```

### Get Training Modules
```javascript
const trainings = await db.findAll('trainings');
```

---

## Backup & Restore

### Backup
```bash
# Copy the SQLite database file
cp backend/dkn.db backend/backups/dkn-backup-$(date +%Y%m%d).db
```

### Restore
```bash
# Replace with backup
cp backend/backups/dkn-backup-20260121.db backend/dkn.db
```

---

## Database Tools

### View Database Contents
```bash
# Open SQLite CLI
sqlite3 backend/dkn.db

# List tables
.tables

# View schema
.schema users

# Query data
SELECT * FROM users;

# Exit
.quit
```

### Check Database Size
```bash
ls -lh backend/dkn.db
```

---

## Migration Notes

- Database uses **SQLite3** (embedded database)
- No external database server required
- Database file: `backend/dkn.db`
- Schema auto-created on first run
- All timestamps use ISO 8601 format
- JSON data stored as TEXT (JSON strings)

---

## Security Considerations

1. **Password Storage**: All passwords hashed with `bcryptjs`
2. **SQL Injection**: Uses parameterized queries
3. **File Permissions**: Ensure `dkn.db` has appropriate permissions
4. **Backup Strategy**: Regular backups recommended
5. **Audit Trail**: All sensitive actions logged in `auditEntries`

---

## Performance Notes

- **Indexes**: Created on primary keys and unique fields
- **Busy Timeout**: Set to 10 seconds to handle concurrent access
- **Connection Pooling**: Single connection per server instance
- **Query Optimization**: Uses prepared statements

---

*Last Updated: January 21, 2026*
*Database Schema Version: 1.0.0*
