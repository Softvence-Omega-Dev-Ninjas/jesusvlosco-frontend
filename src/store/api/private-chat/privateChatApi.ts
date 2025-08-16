
import { baseApi } from "../baseApi";

const privateChatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrivateChat: build.query({
      query: () => ({
        url: `/private-chat`,
        method: "GET",
      }),
    }),

    getChatById: build.query({
      query: (chatId) => {
        // console.log(chatId, "chatId in getChatById");
        return {
          url: `/private-chat/${chatId}`,
          method: "GET",
        };
      },
    }),
    // recipientId: selectedPrivateChatInfo.participant.id,
    //       messageInput,
    //       userId,
    sendPrivateMessage: build.mutation({
      query: ({ recipientId, messageInput, userId, file }) => {
        const formData = new FormData();
        formData.append("content", messageInput);
        formData.append("userId", userId);

        if (file) {
          formData.append("file", file);
        }

        return {
          url: `/private-chat/send-message/${recipientId}`,
          method: "POST",
          body: formData,
        };
      },
      async onQueryStarted(
        // { recipientId, messageInput, userId, file },
        {  queryFulfilled }
      ) {
        try {
          const { data: savedMessage } = await queryFulfilled;
console.log({savedMessage})
          // Emit over socket for recipient real-time update
          // sendPrivateMessage(
          //   recipientId,
          //   { content: messageInput },
          //   userId,
          //   file
          // );
        } catch (error) {
          console.error("Failed to send private message:", error);
        }
      },
    }),
  }),
});

export const {
  useGetPrivateChatQuery,
  useGetChatByIdQuery,
  useSendPrivateMessageMutation,
} = privateChatApi;
