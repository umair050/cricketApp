import React, { useState } from 'react';
import { UserPlus, Shield, Users } from 'lucide-react';
import { useInvitations } from '../../contexts/InvitationContext';
import SendInvitationModal from './SendInvitationModal';

const InvitePlayerButton = ({ player, type = 'FRIEND', entityId = null }) => {
  const { sendInvitation } = useInvitations();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const getButtonInfo = (inviteType) => {
    switch (inviteType) {
      case 'FRIEND':
        return {
          icon: <UserPlus className="w-4 h-4" />,
          label: 'Send Friend Request',
          className: 'btn-cricket-outline text-sm py-2 flex items-center justify-center space-x-1',
        };
      case 'TEAM':
        return {
          icon: <Shield className="w-4 h-4" />,
          label: 'Invite to Team',
          className: 'btn-cricket text-sm py-2 flex items-center justify-center space-x-1',
        };
      case 'GROUP':
        return {
          icon: <Users className="w-4 h-4" />,
          label: 'Invite to Group',
          className: 'btn-cricket-outline text-sm py-2 flex items-center justify-center space-x-1',
        };
      default:
        return {
          icon: <UserPlus className="w-4 h-4" />,
          label: 'Send Invitation',
          className: 'btn-cricket-outline text-sm py-2 flex items-center justify-center space-x-1',
        };
    }
  };

  const buttonInfo = getButtonInfo(type);

  const handleQuickInvite = async () => {
    setLoading(true);
    try {
      await sendInvitation({
        receiverId: player.id,
        type: type,
        entityId: entityId,
      });
    } catch (error) {
      console.error('Failed to send invitation:', error);
      // If quick invite fails, show modal for manual entry
      setShowModal(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleQuickInvite}
        disabled={loading}
        className={buttonInfo.className}
      >
        {buttonInfo.icon}
        <span>{loading ? 'Sending...' : buttonInfo.label}</span>
      </button>

      <SendInvitationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        invitationType={type}
        entityId={entityId}
        preselectedUser={player}
      />
    </>
  );
};

export default InvitePlayerButton;
