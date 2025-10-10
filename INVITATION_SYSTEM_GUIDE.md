# 🏏 Cricket Platform - Invitation System

## 📋 Overview

The Invitation System is a comprehensive module that allows users to send, receive, and manage various types of invitations within the Cricket Platform. It supports friend requests, team invitations, group invitations, and tournament invitations with a unified structure.

## 🏗️ System Architecture

### Backend Components

#### 1. **Database Entity**
- **File**: `backend/src/invitations/entities/invitation.entity.ts`
- **Table**: `invitations`
- **Key Features**:
  - Unified structure for all invitation types
  - Status tracking (PENDING, ACCEPTED, REJECTED, CANCELLED, EXPIRED)
  - Automatic expiration (7 days default)
  - Support for custom messages

#### 2. **Business Logic Service**
- **File**: `backend/src/invitations/invitations.service.ts`
- **Key Features**:
  - Comprehensive validation rules
  - Automatic friendship creation on acceptance
  - Team membership management
  - Duplicate invitation prevention
  - Capacity limits (teams: max 20 members, users: max 3 teams)

#### 3. **REST API Controller**
- **File**: `backend/src/invitations/invitations.controller.ts`
- **Endpoints**:
  - `POST /api/invitations` - Send invitation
  - `GET /api/invitations` - List all invitations
  - `PATCH /api/invitations/:id/accept` - Accept invitation
  - `PATCH /api/invitations/:id/reject` - Reject invitation
  - `PATCH /api/invitations/:id/cancel` - Cancel invitation

### Frontend Components

#### 1. **Context Management**
- **File**: `frontend/src/contexts/InvitationContext.js`
- **Features**:
  - Global invitation state management
  - Real-time invitation updates
  - Pending count tracking
  - Error handling

#### 2. **UI Components**
- **InvitationCard**: `frontend/src/components/Invitations/InvitationCard.js`
- **SendInvitationModal**: `frontend/src/components/Invitations/SendInvitationModal.js`
- **InvitePlayerButton**: `frontend/src/components/Invitations/InvitePlayerButton.js`

#### 3. **Pages**
- **Invitations Page**: `frontend/src/pages/Invitations/Invitations.js`
- **Integration**: Added to Players and Teams pages

## 🎯 Invitation Types

### 1. **Friend Requests (FRIEND)**
- **Purpose**: Connect players as friends
- **Rules**:
  - Cannot send to yourself
  - Cannot send if already friends
  - Cannot send if pending invitation exists
- **Acceptance**: Creates bidirectional friendship

### 2. **Team Invitations (TEAM)**
- **Purpose**: Invite friends to join your team
- **Rules**:
  - Only team captains can send invitations
  - Must be friends first
  - Team capacity limit (20 members)
  - User limit (max 3 teams per user)
- **Acceptance**: Adds user to team as member

### 3. **Group Invitations (GROUP)**
- **Purpose**: Invite friends to groups
- **Rules**:
  - Must be friends first
  - Group capacity limits apply
- **Acceptance**: Adds user to group

### 4. **Tournament Invitations (TOURNAMENT)**
- **Purpose**: Invite teams to tournaments
- **Rules**:
  - Only tournament organizers can send
  - Team must not already be in tournament
- **Acceptance**: Adds team to tournament

## 🔄 Invitation Lifecycle

```
CREATE → PENDING → ACCEPTED/REJECTED/CANCELLED/EXPIRED
```

### Status Flow:
1. **PENDING**: Invitation sent, waiting for response
2. **ACCEPTED**: Invitation accepted, relationship created
3. **REJECTED**: Invitation declined by receiver
4. **CANCELLED**: Invitation cancelled by sender
5. **EXPIRED**: Invitation expired after 7 days

## 🚀 Usage Examples

### Sending a Friend Request
```javascript
const { sendInvitation } = useInvitations();

await sendInvitation({
  receiverId: 123,
  type: 'FRIEND',
  message: 'Let\'s connect and play cricket together!'
});
```

### Accepting an Invitation
```javascript
const { acceptInvitation } = useInvitations();

await acceptInvitation(invitationId);
```

### Getting Pending Count
```javascript
const { getPendingReceivedCount } = useInvitations();
const pendingCount = getPendingReceivedCount();
```

## 🔧 Integration Points

### 1. **Players Page**
- Friend request buttons on player cards
- Quick invite functionality

### 2. **Teams Page**
- Team invitation buttons
- Captain-only invitation controls

### 3. **Navbar**
- Notification badge showing pending invitations
- Direct access to invitations page

### 4. **Sidebar Navigation**
- Invitations menu item with pending count

## 🛡️ Security & Validation

### Backend Validation:
- User authentication required
- Permission checks (team captains only)
- Duplicate prevention
- Capacity limits
- Friendship requirements

### Frontend Validation:
- Form validation
- Error handling
- Loading states
- Success feedback

## 📱 UI/UX Features

### Dark Mode Support:
- All components support dark/light themes
- Consistent color schemes
- Proper contrast ratios

### Responsive Design:
- Mobile-friendly layouts
- Touch-friendly buttons
- Optimized for all screen sizes

### Real-time Updates:
- Automatic invitation list refresh
- Live pending counts
- Instant status updates

## 🔮 Future Enhancements

### Planned Features:
1. **Push Notifications**: Real-time invitation alerts
2. **Email Notifications**: Optional email invitations
3. **Bulk Invitations**: Send multiple invitations at once
4. **Invitation Templates**: Pre-defined invitation messages
5. **Analytics**: Invitation acceptance rates
6. **Advanced Filters**: Filter invitations by type, status, date

### API Extensions:
1. **Webhook Support**: External system integration
2. **Batch Operations**: Multiple invitation management
3. **Search & Filter**: Advanced invitation queries
4. **Export Features**: Invitation history export

## 🐛 Troubleshooting

### Common Issues:

1. **"Cannot send invitation to yourself"**
   - Solution: Check if senderId === receiverId

2. **"Only team captains can send invitations"**
   - Solution: Verify user role in team

3. **"Must be friends to invite to team"**
   - Solution: Establish friendship first

4. **"Team is at maximum capacity"**
   - Solution: Check team member count (max 20)

5. **"User is already in maximum number of teams"**
   - Solution: Check user's team count (max 3)

## 📊 Database Schema

```sql
CREATE TABLE invitations (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER NOT NULL REFERENCES users(id),
  receiver_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(20) NOT NULL CHECK (type IN ('FRIEND', 'TEAM', 'GROUP', 'TOURNAMENT')),
  entity_id INTEGER REFERENCES teams(id),
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'ACCEPTED', 'REJECTED', 'CANCELLED', 'EXPIRED')),
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

## 🎉 Conclusion

The Invitation System provides a robust, scalable foundation for social interactions within the Cricket Platform. It supports multiple invitation types with comprehensive validation, real-time updates, and excellent user experience across all devices and themes.

The system is designed to be extensible, allowing for easy addition of new invitation types and features as the platform grows.
