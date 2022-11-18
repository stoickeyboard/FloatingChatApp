import { User } from "@prisma/client";
import { useEffect } from "react";
import { NEW_MESSAGE } from "../../../constants";
import { trpc } from "../../../utils/trpc";
import { ChatState } from "../Chat";
import MessagesSection from "./MessagesSection/MessagesSection";
import MessagesTextArea from "./MessagesTextArea/MessagesTextArea";
import NewConversationUserInput from "./NewConversationUserInput/NewConversationUserInput";
import MessagesHeader from "./MessagesHeader/MessagesHeader";

export interface MessagesState {
  addToConvoQueue: (conversationId: string, recipient: Partial<User>) => void;
  closeMessages: () => void;
}

type Props = ChatState &
  MessagesState & {
    queueLength: number;
  };

export default function Messages({
  currentRecipient,
  currentConversationId,
  setCurrentRecipient,
  queueLength,
  addToConvoQueue,
  closeMessages,
  setCurrentConversationId,
}: Props) {
  const { data: conversationIdFound, refetch } =
    trpc.chat.findConversation.useQuery(
      {
        userId: currentRecipient?.id || "",
      },
      { enabled: false }
    );

  useEffect(() => {
    if (currentConversationId === NEW_MESSAGE) {
      refetch();
    }
  }, [currentRecipient]);

  useEffect(() => {
    if (conversationIdFound) {
      setCurrentConversationId(conversationIdFound);
    }
  }, [conversationIdFound]);

  return (
    <div
      className={`fixed bottom-0 right-0 flex flex-col space-y-5 rounded-xl bg-level1 p-5 shadow-sm max-md:top-0 max-md:left-0 md:right-4 md:bottom-4 md:h-[540px] md:w-96 ${
        queueLength ? "md:right-[76px]" : ""
      } `}
    >
      <MessagesHeader
        currentConversationId={currentConversationId}
        currentRecipient={currentRecipient}
        addToConvoQueue={addToConvoQueue}
        closeMessages={closeMessages}
      />
      {currentRecipient === null && (
        <NewConversationUserInput setCurrentRecipient={setCurrentRecipient} />
      )}
      <MessagesSection
        currentRecipient={currentRecipient}
        currentConversationId={currentConversationId}
      />
      {currentRecipient !== null && (
        <MessagesTextArea
          currentRecipient={currentRecipient}
          setCurrentConversationId={setCurrentConversationId}
          currentConversationId={currentConversationId}
        />
      )}
    </div>
  );
}
