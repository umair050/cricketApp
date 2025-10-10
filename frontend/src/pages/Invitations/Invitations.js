import React, { useState } from 'react';
import { Mail, Send, UserPlus, Shield, Users, Trophy, Plus } from 'lucide-react';
import { useInvitations } from '../../contexts/InvitationContext';
import InvitationCard from '../../components/Invitations/InvitationCard';
import SendInvitationModal from '../../components/Invitations/SendInvitationModal';

const Invitations = () => {
  const { invitations, loading, getPendingReceivedCount, getPendingSentCount } = useInvitations();
  const [activeTab, setActiveTab] = useState('received');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('FRIEND');

  const getInvitationTypeIcon = (type) => {
    switch (type) {
      case 'FRIEND':
        return <UserPlus className="w-4 h-4" />;
      case 'TEAM':
        return <Shield className="w-4 h-4" />;
      case 'GROUP':
        return <Users className="w-4 h-4" />;
      case 'TOURNAMENT':
        return <Trophy className="w-4 h-4" />;
      default:
        return <Mail className="w-4 h-4" />;
    }
  };

  const getInvitationTypeLabel = (type) => {
    switch (type) {
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

  const getStatusCounts = (invitationList) => {
    return {
      pending: invitationList.filter(inv => inv.status === 'PENDING').length,
      accepted: invitationList.filter(inv => inv.status === 'ACCEPTED').length,
      rejected: invitationList.filter(inv => inv.status === 'REJECTED').length,
      cancelled: invitationList.filter(inv => inv.status === 'CANCELLED').length,
      expired: invitationList.filter(inv => inv.status === 'EXPIRED').length,
    };
  };

  const receivedCounts = getStatusCounts(invitations.received);
  const sentCounts = getStatusCounts(invitations.sent);

  const handleSendInvitation = (type) => {
    setModalType(type);
    setShowModal(true);
  };

  const tabs = [
    {
      id: 'received',
      label: 'Received',
      count: getPendingReceivedCount(),
      icon: <Mail className="w-4 h-4" />,
    },
    {
      id: 'sent',
      label: 'Sent',
      count: getPendingSentCount(),
      icon: <Send className="w-4 h-4" />,
    },
  ];

  const invitationTypes = [
    { type: 'FRIEND', label: 'Friend Request', icon: <UserPlus className="w-4 h-4" /> },
    { type: 'TEAM', label: 'Team Invitation', icon: <Shield className="w-4 h-4" /> },
    { type: 'GROUP', label: 'Group Invitation', icon: <Users className="w-4 h-4" /> },
    { type: 'TOURNAMENT', label: 'Tournament Invitation', icon: <Trophy className="w-4 h-4" /> },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary">Invitations</h1>
          <p className="text-secondary mt-1">
            Manage your friend requests, team invitations, and more
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="btn-cricket flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Send Invitation</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card-cricket text-center">
          <div className="bg-yellow-100 dark:bg-yellow-900/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Mail className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-primary">{receivedCounts.pending}</p>
          <p className="text-sm text-secondary">Pending Received</p>
        </div>
        <div className="card-cricket text-center">
          <div className="bg-blue-100 dark:bg-blue-900/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Send className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-primary">{sentCounts.pending}</p>
          <p className="text-sm text-secondary">Pending Sent</p>
        </div>
        <div className="card-cricket text-center">
          <div className="bg-green-100 dark:bg-green-900/20 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <UserPlus className="w-6 h-6 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-2xl font-bold text-primary">{receivedCounts.accepted}</p>
          <p className="text-sm text-secondary">Accepted</p>
        </div>
        <div className="card-cricket text-center">
          <div className="bg-gray-100 dark:bg-gray-700 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Users className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-primary">{invitations.received.length + invitations.sent.length}</p>
          <p className="text-sm text-secondary">Total Invitations</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="card-cricket">
        <div className="flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors flex items-center justify-center space-x-2 ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-sm'
                  : 'text-secondary hover:text-primary'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {tab.count > 0 && (
                <span className="bg-green-600 dark:bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Invitations List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
            <p className="text-secondary mt-2">Loading invitations...</p>
          </div>
        ) : (
          <>
            {activeTab === 'received' && (
              <>
                {invitations.received.length === 0 ? (
                  <div className="card-cricket text-center py-8">
                    <Mail className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No Invitations</h3>
                    <p className="text-secondary">You don't have any invitations yet.</p>
                  </div>
                ) : (
                  invitations.received.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      type="received"
                    />
                  ))
                )}
              </>
            )}

            {activeTab === 'sent' && (
              <>
                {invitations.sent.length === 0 ? (
                  <div className="card-cricket text-center py-8">
                    <Send className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-primary mb-2">No Sent Invitations</h3>
                    <p className="text-secondary">You haven't sent any invitations yet.</p>
                  </div>
                ) : (
                  invitations.sent.map((invitation) => (
                    <InvitationCard
                      key={invitation.id}
                      invitation={invitation}
                      type="sent"
                    />
                  ))
                )}
              </>
            )}
          </>
        )}
      </div>

      {/* Send Invitation Modal */}
      <SendInvitationModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        invitationType={modalType}
      />

      {/* Quick Send Options */}
      <div className="card-cricket">
        <h3 className="text-lg font-semibold text-primary mb-4">Quick Send Invitations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {invitationTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => handleSendInvitation(type)}
              className="flex flex-col items-center p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:border-green-500 dark:hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors"
            >
              {icon}
              <span className="text-sm font-medium text-primary mt-2">{label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Invitations;
