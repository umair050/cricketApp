import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuthContext } from "./AuthContext";
import { invitationAPI } from "../services/invitationAPI";

const InvitationContext = createContext();

export const useInvitations = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitations must be used within an InvitationProvider");
  }
  return context;
};

export const InvitationProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [invitations, setInvitations] = useState({
    sent: [],
    received: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchInvitations = async () => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const data = await invitationAPI.getInvitations();
      setInvitations(data);
    } catch (err) {
      setError(err.message);
      console.error("Failed to fetch invitations:", err);
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async (invitationData) => {
    if (!user) {
      const error = new Error("You must be logged in to send invitations");
      setError(error.message);
      throw error;
    }

    setLoading(true);
    setError(null);
    try {
      console.log("Sending invitation:", invitationData);
      const newInvitation = await invitationAPI.sendInvitation(invitationData);
      console.log("Invitation sent successfully:", newInvitation);
      await fetchInvitations(); // Refresh the list
      return newInvitation;
    } catch (err) {
      console.error("Failed to send invitation:", err);
      setError(err.message || err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async (invitationId) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedInvitation = await invitationAPI.acceptInvitation(
        invitationId
      );
      await fetchInvitations(); // Refresh the list
      return updatedInvitation;
    } catch (err) {
      setError(err.message);
      console.error("Failed to accept invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const rejectInvitation = async (invitationId) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedInvitation = await invitationAPI.rejectInvitation(
        invitationId
      );
      await fetchInvitations(); // Refresh the list
      return updatedInvitation;
    } catch (err) {
      setError(err.message);
      console.error("Failed to reject invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const cancelInvitation = async (invitationId) => {
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const updatedInvitation = await invitationAPI.cancelInvitation(
        invitationId
      );
      await fetchInvitations(); // Refresh the list
      return updatedInvitation;
    } catch (err) {
      setError(err.message);
      console.error("Failed to cancel invitation:", err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPendingReceivedCount = () => {
    return invitations.received.filter((inv) => inv.status === "PENDING")
      .length;
  };

  const getPendingSentCount = () => {
    return invitations.sent.filter((inv) => inv.status === "PENDING").length;
  };

  useEffect(() => {
    if (user) {
      fetchInvitations();
    }
  }, [user]);

  const value = {
    invitations,
    loading,
    error,
    fetchInvitations,
    sendInvitation,
    acceptInvitation,
    rejectInvitation,
    cancelInvitation,
    getPendingReceivedCount,
    getPendingSentCount,
  };

  return (
    <InvitationContext.Provider value={value}>
      {children}
    </InvitationContext.Provider>
  );
};
