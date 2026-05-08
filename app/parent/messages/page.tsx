"use client";

import { Bell, Loader2, Paperclip, PenSquare, Send, X } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  useMessages,
  useMessageThreads,
  useRealtimeMessages,
  useRealtimeMessageThreads,
  useSendMessage,
} from "@/hooks/useMessages";
import { useMarkAllNotificationsRead, useNotifications } from "@/hooks/useNotifications";
import { useStaff } from "@/hooks/useStaff";

export default function Messages() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const [messageText, setMessageText] = useState("");

  // New chat dialog state
  const [showNewChat, setShowNewChat] = useState(false);
  const [newChatRecipientId, setNewChatRecipientId] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [staffSearch, setStaffSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], isLoading: threadsLoading } = useMessageThreads();
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const sendMessageMutation = useSendMessage();

  const selectedThread = useMemo(
    () => threads.find((t) => t.threadId === selectedThreadId) ?? threads[0],
    [threads, selectedThreadId],
  );

  const { data: messages = [], isLoading: messagesLoading } = useMessages({
    threadId: selectedThread?.threadId,
  });

  useRealtimeMessageThreads();
  useRealtimeMessages({ threadId: selectedThread?.threadId });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const filteredStaff = staff.filter(
    (s) =>
      s.isActive &&
      (staffSearch === "" ||
        s.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        s.role.toLowerCase().includes(staffSearch.toLowerCase())),
  );

  function sendMessage() {
    if (!messageText.trim() || !selectedThread) return;
    sendMessageMutation.mutate(
      { threadId: selectedThread.threadId, content: messageText },
      {
        onSuccess: () => {
          setMessageText("");
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  function startNewChat() {
    if (!newChatRecipientId || !newChatMessage.trim()) return;
    sendMessageMutation.mutate(
      { receiverId: newChatRecipientId, content: newChatMessage },
      {
        onSuccess: () => {
          toast.success("Conversation started!");
          setShowNewChat(false);
          setNewChatRecipientId("");
          setNewChatMessage("");
          setStaffSearch("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages & Notifications"
        description="Communicate with staff and view alerts"
        action={
          <Button
            size="sm"
            className="bg-green-500 text-white hover:bg-green-500-600 gap-1.5"
            onClick={() => setShowNewChat(true)}
          >
            <PenSquare className="h-4 w-4" />
            New Message
          </Button>
        }
      />

      {/* ── New Chat Dialog ── */}
      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-green-500">Start a New Conversation</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Recipient search */}
            <div className="space-y-2">
              <Label>Select Staff Member</Label>
              <Input
                placeholder="Search by name or role..."
                value={staffSearch}
                onChange={(e) => setStaffSearch(e.target.value)}
              />
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                {staffLoading ? (
                  <p className="p-3 text-sm text-muted-foreground">Loading staff...</p>
                ) : filteredStaff.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">No staff found.</p>
                ) : (
                  filteredStaff.map((member) => (
                    <button
                      key={member.id}
                      type="button"
                      onClick={() => {
                        setNewChatRecipientId(member.id);
                        setStaffSearch(member.name);
                      }}
                      className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                        newChatRecipientId === member.id ? "bg-green-500/10 font-semibold text-green-500" : ""
                      }`}
                    >
                      <Avatar className="h-8 w-8 shrink-0">
                        <AvatarImage src={member.photo ?? undefined} />
                        <AvatarFallback>{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{member.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{member.role}{member.class ? ` · ${member.class}` : ""}</p>
                      </div>
                      {newChatRecipientId === member.id && (
                        <Badge className="ml-auto shrink-0 bg-green-500 text-white text-[10px]">Selected</Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Write your message..."
                rows={3}
                value={newChatMessage}
                onChange={(e) => setNewChatMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) startNewChat();
                }}
              />
              <p className="text-[10px] text-muted-foreground">Press Ctrl+Enter to send</p>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowNewChat(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-500-600"
                disabled={!newChatRecipientId || !newChatMessage.trim() || sendMessageMutation.isPending}
                onClick={startNewChat}
              >
                {sendMessageMutation.isPending ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending…</>
                ) : (
                  <><Send className="h-4 w-4 mr-2" /> Send</>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 ? (
              <Badge className="ml-2 bg-destructive text-[10px] text-white">{unreadCount}</Badge>
            ) : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid gap-4 lg:h-[560px] lg:grid-cols-3">
            {/* Thread list */}
            <div className="flex h-[400px] flex-col overflow-hidden rounded-xl bg-card shadow-card lg:h-full">
              <div className="border-b border-border p-3">
                <Input placeholder="Search messages..." className="text-sm" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {threadsLoading ? (
                  <LoadingTable columns={1} rows={4} />
                ) : threads.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                    <EmptyState
                      title="No conversations yet"
                      description="Start a new message to connect with a staff member."
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-green-500 text-green-500"
                      onClick={() => setShowNewChat(true)}
                    >
                      <PenSquare className="h-4 w-4 mr-1" /> New Message
                    </Button>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <button
                      key={thread.threadId}
                      onClick={() => setSelectedThreadId(thread.threadId)}
                      className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted ${
                        selectedThread?.threadId === thread.threadId ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={thread.sender?.avatar ?? undefined} />
                        <AvatarFallback>{thread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold">
                            {thread.sender?.name ?? "School Staff"}
                          </p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(thread.createdAt).toLocaleDateString("en-NG")}
                          </span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{thread.content}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Message pane */}
            <div className="flex h-[500px] flex-col overflow-hidden rounded-xl bg-card shadow-card lg:col-span-2 lg:h-full">
              {selectedThread ? (
                <>
                  <div className="flex items-center gap-3 border-b border-border p-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedThread.sender?.avatar ?? undefined} />
                      <AvatarFallback>{selectedThread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {selectedThread.sender?.name ?? "School Staff"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">Conversation</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messagesLoading ? (
                      <LoadingTable columns={1} rows={4} />
                    ) : (
                      messages.map((message) => {
                        const isFromThem = message.senderId === selectedThread.senderId;
                        return (
                          <div
                            key={message.id}
                            className={`flex ${isFromThem ? "justify-start" : "justify-end"}`}
                          >
                            <div
                              className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                                isFromThem
                                  ? "rounded-tl-sm bg-muted text-foreground"
                                  : "rounded-tr-sm bg-green-500 text-white"
                              }`}
                            >
                              <p className="text-sm">{message.content}</p>
                              <span
                                className={`mt-1 block text-[10px] ${
                                  isFromThem ? "text-muted-foreground" : "text-white/60"
                                }`}
                              >
                                {new Date(message.createdAt).toLocaleTimeString("en-NG", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <div className="flex items-center gap-2 border-t border-border p-3">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <Button
                      size="sm"
                      className="bg-green-500 text-white"
                      disabled={sendMessageMutation.isPending}
                      onClick={sendMessage}
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4">
                  <EmptyState
                    title="Select a conversation"
                    description="Choose a thread to read and reply, or start a new one."
                  />
                  <Button
                    variant="outline"
                    className="border-green-500 text-green-500"
                    onClick={() => setShowNewChat(true)}
                  >
                    <PenSquare className="h-4 w-4 mr-2" /> New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="mb-3 flex justify-end">
            <Button
              variant="outline"
              size="sm"
              disabled={markAllRead.isPending || unreadCount === 0}
              onClick={() => markAllRead.mutate()}
            >
              Mark all read
            </Button>
          </div>
          {notificationsLoading ? (
            <LoadingTable columns={1} />
          ) : notifications.length === 0 ? (
            <EmptyState
              title="No notifications"
              description="System alerts and school updates will appear here."
            />
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex items-start gap-3 rounded-xl bg-card p-4 shadow-card"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                    <Bell className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {new Date(notification.createdAt).toLocaleString("en-NG")}
                    </p>
                  </div>
                  {!notification.isRead ? (
                    <span className="h-2.5 w-2.5 rounded-full bg-destructive shrink-0 mt-1" />
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
