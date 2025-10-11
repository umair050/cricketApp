import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { User, Shield, Users, Trophy, Clock, Check, X, Trash2 } from 'lucide-react';
import {
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  fetchInvitations,
} from '../../store/slices/invitationSlice';

const InvitationCard = ({ invitation, type = 'received' }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const getInvitationIcon = (invitationType) => {
    switch (invitationType) {
      case 'FRIEND':
        return <User className="w-5 h-5" />;
      case 'TEAM':
        return <Shield className="w-5 h-5" />;
      case 'GROUP':
        return <Users className="w-5 h-5" />;
      case 'TOURNAMENT':
        return <Trophy className="w-5 h-5" />;
      default:
        return <User className="w-5 h-5" />;
    }
  };

  const getInvitationTypeLabel = (invitationType) => {
    switch (invitationType) {
      case 'FRIEND':
        return 'Friend Request';
      case 'TEAM':
        return 'Team Invitation';
      case 'GROUP':
        return 'Group Invitation';
      case 'TOURNAMENT':
        return 'Tournament Invitation';
      default:
        return 'Invitation';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'ACCEPTED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'EXPIRED':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleAccept = async () => {
    setLoading(true);
    try {
      await dispatch(acceptInvitation(invitation.id)).unwrap();
      await dispatch(fetchInvitations());
    } catch (error) {
      console.error('Failed to accept invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    setLoading(true);
    try {
      await dispatch(rejectInvitation(invitation.id)).unwrap();
      await dispatch(fetchInvitations());
    } catch (error) {
      console.error('Failed to reject invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setLoading(true);
    try {
      await dispatch(cancelInvitation(invitation.id)).unwrap();
      await dispatch(fetchInvitations());
    } catch (error) {
      console.error('Failed to cancel invitation:', error);
    } finally {
      setLoading(false);
    }
  };

  const user = type === 'received' ? invitation.sender : invitation.receiver;
  const isPending = invitation.status === 'PENDING';
  const isExpired = invitation.status === 'EXPIRED';

  return (
    <div className="card-cricket hover:shadow-lg transition-shadow">
      <div className="flex items-start space-x-4">
        {/* User Avatar */}
        <div className="bg-green-600 dark:bg-green-500 w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
          <User className="w-6 h-6 text-white" />
        </div>

        {/* Invitation Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-2">
            {getInvitationIcon(invitation.type)}
            <span className="text-sm font-medium text-secondary">
              {getInvitationTypeLabel(invitation.type)}
            </span>
          </div>

          <h3 className="text-lg font-semibold text-primary mb-1">
            {user?.fullName || user?.email}
          </h3>

          {invitation.message && (
            <p className="text-sm text-secondary mb-3 line-clamp-2">
              "{invitation.message}"
            </p>
          )}

          {/* Entity Info (for team/group invitations) */}
          {invitation.team && (
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-4 h-4 text-muted" />
              <span className="text-sm text-secondary">
                Team: {invitation.team.name}
              </span>
            </div>
          )}

          {/* Status and Time */}
          <div className="flex items-center justify-between mb-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(invitation.status)}`}>
              {invitation.status}
            </span>
            <div className="flex items-center space-x-1 text-muted">
              <Clock className="w-3 h-3" />
              <span className="text-xs">{formatDate(invitation.createdAt)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          {isPending && !isExpired && (
            <div className="flex space-x-2">
              {type === 'received' ? (
                <>
                  <button
                    onClick={handleAccept}
                    disabled={loading}
                    className="flex-1 btn-cricket text-sm py-2 flex items-center justify-center space-x-1"
                  >
                    <Check className="w-4 h-4" />
                    <span>Accept</span>
                  </button>
                  <button
                    onClick={handleReject}
                    disabled={loading}
                    className="flex-1 btn-cricket-outline text-sm py-2 flex items-center justify-center space-x-1"
                  >
                    <X className="w-4 h-4" />
                    <span>Reject</span>
                  </button>
                </>
              ) : (
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="flex-1 btn-cricket-outline text-sm py-2 flex items-center justify-center space-x-1"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
              )}
            </div>
          )}

          {isExpired && (
            <div className="text-sm text-muted italic">
              This invitation has expired
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvitationCard;
