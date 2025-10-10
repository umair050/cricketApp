import api from "./api";

export const invitationAPI = {
  async getInvitations() {
    const response = await api.get("/invitations");
    return response.data;
  },

  async sendInvitation(invitationData) {
    const response = await api.post("/invitations", invitationData);
    return response.data;
  },

  async acceptInvitation(invitationId) {
    const response = await api.patch(`/invitations/${invitationId}/accept`);
    return response.data;
  },

  async rejectInvitation(invitationId) {
    const response = await api.patch(`/invitations/${invitationId}/reject`);
    return response.data;
  },

  async cancelInvitation(invitationId) {
    const response = await api.patch(`/invitations/${invitationId}/cancel`);
    return response.data;
  },

  async updateInvitation(invitationId, updateData) {
    const response = await api.patch(
      `/invitations/${invitationId}`,
      updateData
    );
    return response.data;
  },
};
