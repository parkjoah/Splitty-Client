export type chatListItem = {
  goodsId: number;
  name: string;
  lastMessage: string;
  updatedAt: string;
  currParticipants: number;
  imageName: string;
};

export type ChatUser = {
  id: number;
  username: string;
  profileImageUrl: string;
};

export type ChatMessage = {
  id: number;
  senderId: number;
  type: "TEXT" | "ENTER" | "LEAVE";
  message: string;
  createdAt: string;
};
