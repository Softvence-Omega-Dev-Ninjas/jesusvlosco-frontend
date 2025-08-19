import { baseApi } from "../baseApi";

const privateChatApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getPrivateChat: build.query({
      query: () => ({
        url: `/private-chat`,
        method: "GET",
      }),
      providesTags: ['PRIVATE_CHAT'],
    }),

    getChatById: build.query({
      query: (chatId) => {
        // console.log(chatId, "chatId in getChatById");
        return {
          url: `/private-chat/${chatId}`,
          method: "GET",
        };
      },
      providesTags: (_result, _error, chatId) => [
        { type: 'PRIVATE_CHAT', id: chatId },
        'PRIVATE_CHAT'
      ],
    }),
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
      invalidatesTags: ['PRIVATE_CHAT'],
    }),
  }),
});

export const {
  useGetPrivateChatQuery,
  useGetChatByIdQuery,
  useSendPrivateMessageMutation,
} = privateChatApi;
