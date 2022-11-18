import { User } from "@prisma/client";
import { IoAddOutline, IoChevronBack } from "react-icons/io5";
import IconButton from "../../../components/IconButton/IconButton";
import { PLACEHOLDER_IMAGE, NEW_MESSAGE } from "../../../constants";
import { trpc } from "../../../utils/trpc";

interface Props {
  selectConversation: (
    currentConversationId: string,
    currentRecipient: Partial<User> | null
  ) => void;
}

const styles = {
  wrapper:
    "fixed top-0 bottom-0 left-0 right-0 flex flex-col space-y-5 bg-level1 p-5 md:bottom-[unset] md:left-[unset] md:top-[76px] md:right-4 md:h-[540px] md:w-96 md:rounded-xl md:shadow-sm",
};

export default function Conversations({ selectConversation }: Props) {
  const {
    data: conversations,
    isLoading,
    error,
  } = trpc.chat.conversations.useQuery();

  if (isLoading || error) {
    return (
      <div className={`${styles.wrapper} flex items-center justify-center`}>
        <p>{isLoading ? "Loading..." : "Error"}</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className="flex items-center justify-between">
        <IconButton className="md:hidden">
          <IoChevronBack />
        </IconButton>
        <p className="text-lg">Messages</p>
        <IconButton onClick={() => selectConversation(NEW_MESSAGE, null)}>
          <IoAddOutline />
        </IconButton>
      </div>
      <ul>
        {conversations.map((conversationInfo) => {
          const recipient =
            conversationInfo.conversation.conversationUsers[0]!.userId ===
            conversationInfo.userId
              ? conversationInfo.conversation.conversationUsers[1]?.user
              : conversationInfo.conversation.conversationUsers[0]?.user;

          return (
            <li
              className="rounded-lg hover:bg-level1Hover"
              key={conversationInfo.conversation.id}
            >
              <button
                className="mx-2 flex w-full items-center space-x-2 py-2 text-left"
                onClick={() =>
                  selectConversation(
                    conversationInfo.conversation.id,
                    recipient!
                  )
                }
              >
                <img
                  alt="avater image"
                  src={recipient!.image || PLACEHOLDER_IMAGE}
                  className="h-12 w-12 rounded-full"
                />
                <div className="flex flex-col space-y-2">
                  <p>{recipient!.name}</p>
                  <p className="text-sm text-tertiaryText">
                    {conversationInfo.conversation.lastMessage!.userId !==
                    recipient!.id
                      ? "You: "
                      : ""}
                    {conversationInfo.conversation.lastMessage?.messageText}
                  </p>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
