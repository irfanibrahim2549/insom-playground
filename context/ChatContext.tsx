"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Message {
  id: string;
  sender: "user" | "agent" | "system";
  text: string;
  time: string;
  authorName?: string;
}

export interface ChatItem {
  id: string;
  name: string;
  avatar: string;
  phone: string;
  company: string;
  time: string;
  lastMessage: string;
  status: "Unassigned" | "Assigned" | "Expired" | "Unreply" | "Resolved" | "Ignored" | "Flying";
  assignedTo: string | null;
  unreadCount?: number;
  channel: string;
  tags: string[];
  division: string;
  messages: Message[];
  created: string;
  lastSeen: string;
  isBlocked?: boolean;
}

interface ChatContextType {
  chats: ChatItem[];
  activeChatId: string | null;
  activeChat: ChatItem | undefined;
  activeTab: string; // 'all' | 'assigned' | 'mine' | 'resolved'
  searchQuery: string;
  filterTags: string[];
  filterDivision: string;
  unassignedCount: number;
  hasUnassignedNotification: boolean;
  latestUnassignedTime: string;
  autoTimerActive: boolean;
  isFilterModalOpen: boolean;
  sortOrder: "newest" | "oldest";
  
  // Actions
  setActiveChatId: (id: string) => void;
  setActiveTab: (tab: string) => void;
  setSearchQuery: (query: string) => void;
  setFilterTags: (tags: string[]) => void;
  setFilterDivision: (division: string) => void;
  setIsFilterModalOpen: (open: boolean) => void;
  toggleAutoTimer: () => void;
  toggleSortOrder: () => void;
  triggerNewUnassignedChat: () => void;
  handleGetNewChat: () => void;
  handleSendMessage: (text: string, senderRole?: "agent" | "spv") => void;
  handleResolveChat: (id: string) => void;
  handleBlockContact: (id: string) => void;
  handleAddTag: (id: string, tag: string) => void;
  handleRemoveTag: (id: string, tag: string) => void;
}

const INITIAL_CHATS: ChatItem[] = [
  {
    id: "chat-1",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    phone: "081234569871",
    company: "PT Pencari Cinta Sejati",
    time: "Today at 15:30",
    lastMessage: "Selamat siang, saya mengalami kendala dalam pembayaran dan registrasi produk...",
    status: "Unassigned",
    assignedTo: null,
    unreadCount: 9,
    channel: "WhatsApp",
    tags: ["Register", "Login", "Pembayaran"],
    division: "Customer Service",
    created: "21 Jun 2024 at 17:49",
    lastSeen: "21 Jun 2024 at 18:09",
    messages: [
      { id: "m1", sender: "user", text: "Selamat siang kak", time: "16:00" },
      { id: "m2", sender: "agent", text: "Selamat datang di InterActive. Perkenalkan saya Johnny apakah ada yang bisa saya bantu?", time: "16:01", authorName: "Johnny" },
      { id: "m3", sender: "user", text: "Selamat datang di InterActive. Perkenalkan saya Johnny apakah ada yang bisa saya bantu?", time: "16:02" },
      { id: "m4", sender: "system", text: "17:03 - Irul has been assigned to this conversation by ICHA.ai", time: "17:03" },
      { id: "m5", sender: "system", text: "17:03 - Irul has been assigned to this conversation by Johny", time: "17:03" },
      { id: "m6", sender: "system", text: "17:03 - Conversation has been resolved by Irul", time: "17:03" },
      { id: "m7", sender: "system", text: "17:03 - ICHA.ai has left the conversation", time: "17:03" },
      { id: "m8", sender: "system", text: "17:03 - Conversation has been auto resolved due to customer has no longer responded", time: "17:03" }
    ]
  },
  {
    id: "chat-2",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    phone: "081234569872",
    company: "PT Pencari Cinta Sejati",
    time: "Today at 15:30",
    lastMessage: "Selamat datang di InterActive. Perkenalkan s...",
    status: "Assigned",
    assignedTo: "Irul",
    channel: "WhatsApp",
    tags: ["Register", "Login", "Pembayaran"],
    division: "Technical Support",
    created: "21 Jun 2024 at 15:10",
    lastSeen: "21 Jun 2024 at 16:00",
    messages: [
      { id: "m2-1", sender: "user", text: "Halo admin, akun saya terkena kendala login.", time: "15:25" },
      { id: "m2-2", sender: "agent", text: "Baik kak, perkenalkan saya Irul. Boleh diinfokan email terdaftar?", time: "15:28", authorName: "Irul" }
    ]
  },
  {
    id: "chat-3",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    phone: "081234569873",
    company: "PT Pencari Cinta Sejati",
    time: "Today at 15:30",
    lastMessage: "Selamat siang, saya mengalami kendala dala...",
    status: "Assigned",
    assignedTo: "Fulan",
    unreadCount: 9,
    channel: "WhatsApp",
    tags: ["Login"],
    division: "Sales",
    created: "21 Jun 2024 at 14:00",
    lastSeen: "21 Jun 2024 at 15:30",
    messages: [
      { id: "m3-1", sender: "user", text: "Selamat siang, apakah produk masih ready?", time: "15:30" }
    ]
  },
  {
    id: "chat-4",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    phone: "081234569874",
    company: "PT Pencari Cinta Sejati",
    time: "Today at 15:30",
    lastMessage: "Terimakasiih",
    status: "Expired",
    assignedTo: "Johnny",
    channel: "WhatsApp",
    tags: ["Register", "Login", "Pembayaran"],
    division: "Customer Service",
    created: "20 Jun 2024 at 10:00",
    lastSeen: "20 Jun 2024 at 11:30",
    messages: [
      { id: "m4-1", sender: "user", text: "Terimakasiih atas bantuannya!", time: "11:29" }
    ]
  },
  {
    id: "chat-5",
    name: "John Doe",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    phone: "081234569875",
    company: "PT Pencari Cinta Sejati",
    time: "Today at 15:30",
    lastMessage: "Baik kak terimakasiih",
    status: "Unreply",
    assignedTo: "Fulan",
    channel: "WhatsApp",
    tags: ["Pembayaran"],
    division: "Billing",
    created: "21 Jun 2024 at 12:00",
    lastSeen: "21 Jun 2024 at 15:15",
    messages: [
      { id: "m5-1", sender: "user", text: "Baik kak terimakasiih", time: "15:15" }
    ]
  },
  {
    id: "chat-6",
    name: "Siti Rahma",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    phone: "081234569876",
    company: "PT Maju Bersama",
    time: "Today at 14:15",
    lastMessage: "Pesan ini diabaikan oleh agen...",
    status: "Ignored",
    assignedTo: "Johnny",
    channel: "WhatsApp",
    tags: ["Register"],
    division: "Customer Service",
    created: "21 Jun 2024 at 14:00",
    lastSeen: "21 Jun 2024 at 14:15",
    messages: [
      { id: "m6-1", sender: "user", text: "Halo, pesan saya diabaikan?", time: "14:15" }
    ]
  },
  {
    id: "chat-7",
    name: "Budi Santoso",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    phone: "081234569877",
    company: "CV Digital Solution",
    time: "Today at 15:45",
    lastMessage: "Sedang mentransfer percakapan...",
    status: "Flying",
    assignedTo: null,
    channel: "WhatsApp",
    tags: ["Pembayaran"],
    division: "Sales",
    created: "21 Jun 2024 at 15:40",
    lastSeen: "21 Jun 2024 at 15:45",
    messages: [
      { id: "m7-1", sender: "user", text: "Mohon ditransfer ke tim sales.", time: "15:45" }
    ]
  }
];

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [chats, setChats] = useState<ChatItem[]>(INITIAL_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>("chat-4");
  const [activeTab, setActiveTab] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterDivision, setFilterDivision] = useState<string>("All");
  const [hasUnassignedNotification, setHasUnassignedNotification] = useState<boolean>(true);
  const [latestUnassignedTime, setLatestUnassignedTime] = useState<string>("a few seconds ago");
  const [autoTimerActive, setAutoTimerActive] = useState<boolean>(true);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"));
  };

  // Derived unassigned count
  const unassignedCount = chats.filter((c) => c.status === "Unassigned").length;

  const triggerNewUnassignedChat = () => {
    const newId = `chat-sim-${Date.now()}`;
    const newNames = ["Budi Santoso", "Siti Rahma", "Ahmad Fauzi", "Dewi Lestari", "Rudi Hermawan"];
    const randomName = newNames[Math.floor(Math.random() * newNames.length)];
    const randomPhone = `08${Math.floor(1000000000 + Math.random() * 9000000000)}`;

    const newSimulatedChat: ChatItem = {
      id: newId,
      name: randomName,
      avatar: "",
      phone: randomPhone,
      company: "Customer Testing",
      time: "Just now",
      lastMessage: "Halo min, saya butuh bantuan cepat mengenai pesanan saya!",
      status: "Unassigned",
      assignedTo: null,
      unreadCount: 1,
      channel: "WhatsApp",
      tags: ["Register", "Pembayaran"],
      division: "Customer Service",
      created: "Just now",
      lastSeen: "Just now",
      messages: [
        { id: `m-${Date.now()}`, sender: "user", text: "Halo min, saya butuh bantuan cepat mengenai pesanan saya!", time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
      ]
    };

    setChats((prev) => [newSimulatedChat, ...prev]);
    setHasUnassignedNotification(true);
    setLatestUnassignedTime("a few seconds ago");
  };

  // Background Automatic Simulation Timer
  useEffect(() => {
    if (!autoTimerActive) return;

    const interval = setInterval(() => {
      triggerNewUnassignedChat();
    }, 15000); // Trigger every 15s

    return () => clearInterval(interval);
  }, [autoTimerActive]);

  // Handle "Get New Chat" button action - Assign ALL unassigned chats to Johnny
  const handleGetNewChat = () => {
    const unassignedChats = chats.filter((c) => c.status === "Unassigned");
    if (unassignedChats.length === 0) return;

    const currentTimeStr = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const targetChatId = unassignedChats[0].id;

    setChats((prev) =>
      prev.map((c) => {
        if (c.status === "Unassigned") {
          const newSystemLog: Message = {
            id: `sys-${Date.now()}-${c.id}`,
            sender: "system",
            text: `${currentTimeStr} - Conversation has been assigned to Johnny by Get New Chat button`,
            time: currentTimeStr
          };
          return {
            ...c,
            status: "Assigned",
            assignedTo: "Johnny",
            unreadCount: 0,
            messages: [...c.messages, newSystemLog]
          };
        }
        return c;
      })
    );

    setActiveChatId(targetChatId);
    setHasUnassignedNotification(false);
  };

  // Send message in active chat (Auto-assigns unassigned chat to sender)
  const handleSendMessage = (text: string, senderRole: "agent" | "spv" = "agent") => {
    if (!activeChatId || !text.trim()) return;
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    const author = senderRole === "spv" ? "Admin" : "Johnny";

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === activeChatId) {
          const isCurrentlyUnassigned = c.status === "Unassigned";
          const newStatus = isCurrentlyUnassigned ? "Assigned" : c.status;
          const newAssignedTo = isCurrentlyUnassigned ? author : c.assignedTo;

          const updatedMessages: Message[] = [
            ...c.messages,
            {
              id: `m-${Date.now()}`,
              sender: "agent",
              text: text.trim(),
              time: timeNow,
              authorName: author
            }
          ];

          if (isCurrentlyUnassigned) {
            updatedMessages.push({
              id: `sys-assigned-${Date.now()}`,
              sender: "system",
              text: `${timeNow} - ${author} has been assigned to this conversation by replying`,
              time: timeNow
            });
          }

          return {
            ...c,
            status: newStatus,
            assignedTo: newAssignedTo,
            lastMessage: text.trim(),
            time: `Today at ${timeNow}`,
            messages: updatedMessages
          };
        }
        return c;
      })
    );
  };

  // Resolve chat
  const handleResolveChat = (id: string) => {
    const timeNow = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    setChats((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return {
            ...c,
            status: "Resolved",
            messages: [
              ...c.messages,
              {
                id: `sys-${Date.now()}`,
                sender: "system",
                text: `${timeNow} - Conversation has been resolved by Johnny`,
                time: timeNow
              }
            ]
          };
        }
        return c;
      })
    );
  };

  // Block contact (SPV action)
  const handleBlockContact = (id: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, isBlocked: !c.isBlocked };
        }
        return c;
      })
    );
  };

  // Add tag
  const handleAddTag = (id: string, tag: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === id && !c.tags.includes(tag)) {
          return { ...c, tags: [...c.tags, tag] };
        }
        return c;
      })
    );
  };

  // Remove tag
  const handleRemoveTag = (id: string, tag: string) => {
    setChats((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          return { ...c, tags: c.tags.filter((t) => t !== tag) };
        }
        return c;
      })
    );
  };

  const toggleAutoTimer = () => setAutoTimerActive((prev) => !prev);

  const activeChat = chats.find((c) => c.id === activeChatId);

  return (
    <ChatContext.Provider
      value={{
        chats,
        activeChatId,
        activeChat,
        activeTab,
        searchQuery,
        filterTags,
        filterDivision,
        unassignedCount,
        hasUnassignedNotification,
        latestUnassignedTime,
        autoTimerActive,
        isFilterModalOpen,
        sortOrder,
        setActiveChatId,
        setActiveTab,
        setSearchQuery,
        setFilterTags,
        setFilterDivision,
        setIsFilterModalOpen,
        toggleAutoTimer,
        toggleSortOrder,
        triggerNewUnassignedChat,
        handleGetNewChat,
        handleSendMessage,
        handleResolveChat,
        handleBlockContact,
        handleAddTag,
        handleRemoveTag,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
