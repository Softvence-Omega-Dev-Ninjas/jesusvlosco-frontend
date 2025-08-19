// import { sendPrivateMessage } from "@/utils/socket";
import { baseApi } from "../../baseApi";

const teamChatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getTeamChat: build.query({
      query: () => ({
        url: `/teams`,
        method: "GET",
      }),
      providesTags: ['TEAM_CHAT'],
    }),
  
    sendTeamMessage: build.mutation({
      query: ({ teamId, messageInput, file }) => {
        const formData = new FormData();
        formData.append("content", messageInput);
        formData.append("teamId ", teamId );

        if (file) {
          formData.append("file", file);
        }

        return {
          url: `/teams/${teamId}/messages`,
          method: "POST",
          body: formData,
        };
      },
      invalidatesTags: ['TEAM_CHAT'],
      async onQueryStarted(
        // { recipientId, messageInput, userId, file },
        // {
        //    dispatch,
        //    queryFulfilled 
        //   }
      ) {
        try {
          // const { data: savedMessage } = await queryFulfilled;

          // Emit over socket for recipient real-time update
          // sendPrivateMessage(
          //   recipientId,
          //   { content: messageInput },
          //   userId,
          //   file
          // );
        } catch (error) {
          console.error("Failed to send group message:", error);
        }
      },
    }),
  }),
});

export const {
    useGetTeamChatQuery,
    useSendTeamMessageMutation,
} = teamChatApi;
