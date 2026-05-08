"use client";

import { Bell, Loader2, MessageSquare, Paperclip, PenSquare, Send } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  useMessageThreads,
  useMessages,
  useRealtimeMessageThreads,
  useRealtimeMessages,
  useSendMessage,
} from "@/hooks/useMessages";
import { useMarkAllNotificationsRead, useNotifications } from "@/hooks/useNotifications";
import { useStaff } from "@/hooks/useStaff";

export default function Messages() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const [messageText, setMessageText] = useState("");
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
    () => threads.find((thread) => thread.threadId === selectedThreadId) ?? threads[0],
    [threads, selectedThreadId],
  );

  const { data: messages = [], isLoading: messagesLoading } = useMessages({
    threadId: selectedThread?.threadId,
  });

  useRealtimeMessageThreads();
  useRealtimeMessages({ threadId: selectedThread?.threadId });

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;
  const unreadThreads = threads.filter((thread) => !thread.isRead).length;

  const filteredStaff = staff.filter(
    (member) =>
      member.isActive &&
      (staffSearch === "" ||
        member.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
        member.role.toLowerCase().includes(staffSearch.toLowerCase())),
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
          toast.success("Conversation started");
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
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card">
        <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="p-6 sm:p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-50 text-accent">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h1 className="font-display text-3xl font-bold text-primary sm:text-4xl">Messages & Notifications</h1>
            <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground">
              Communicate with staff, follow school alerts, and keep conversations organized.
            </p>
          </div>
          <div className="border-t border-primary/10 bg-secondary-50 p-6 sm:p-8 lg:border-l lg:border-t-0">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-muted-foreground">Unread</p>
            <p className="mt-3 font-display text-4xl font-bold text-primary">{unreadCount + unreadThreads}</p>
            <Button className="mt-5 bg-accent text-white hover:bg-accent-400" onClick={() => setShowNewChat(true)}>
              <PenSquare className="h-4 w-4" />
              New Message
            </Button>
          </div>
        </div>
      </section>

      <Dialog open={showNewChat} onOpenChange={setShowNewChat}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-display text-primary">Start a New Conversation</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Select Staff Member</Label>
              <Input placeholder="Search by name or role..." value={staffSearch} onChange={(event) => setStaffSearch(event.target.value)} />
              <div className="max-h-56 overflow-y-auto rounded-2xl border border-primary/10">
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
                      className={`flex w-full items-center gap-3 px-3 py-3 text-left text-sm transition-colors hover:bg-secondary-50 ${
                        newChatRecipientId === member.id ? "bg-accent-50 font-semibold text-primary" : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9 shrink-0">
                        <AvatarImage src={member.photo ?? undefined} />
                        <AvatarFallback className="bg-secondary-100 font-bold text-primary">{member.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="truncate font-bold text-primary">{member.name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {member.role}
                          {member.class ? ` · ${member.class}` : ""}
                        </p>
                      </div>
                      {newChatRecipientId === member.id ? <Badge className="ml-auto shrink-0 bg-accent text-[10px] text-white">Selected</Badge> : null}
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                placeholder="Write your message..."
                rows={3}
                value={newChatMessage}
                onChange={(event) => setNewChatMessage(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && event.ctrlKey) startNewChat();
                }}
              />
              <p className="text-[10px] text-muted-foreground">Press Ctrl+Enter to send</p>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewChat(false)}>
                Cancel
              </Button>
              <Button
                className="bg-accent text-white hover:bg-accent-400"
                disabled={!newChatRecipientId || !newChatMessage.trim() || sendMessageMutation.isPending}
                onClick={startNewChat}
              >
                {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="h-auto flex-wrap rounded-2xl bg-secondary-50 p-1">
          <TabsTrigger value="messages" className="rounded-xl">Messages</TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl">
            Notifications
            {unreadCount > 0 ? <Badge className="ml-2 bg-accent text-[10px] text-white">{unreadCount}</Badge> : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid gap-4 lg:h-[640px] lg:grid-cols-[0.85fr_1.35fr]">
            <div className="flex h-[430px] flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card lg:h-full">
              <div className="border-b border-primary/10 p-4">
                <Input placeholder="Search messages..." className="rounded-2xl bg-[#FFF9F0]" />
              </div>
              <div className="flex-1 overflow-y-auto p-2">
                {threadsLoading ? (
                  <LoadingTable columns={1} rows={4} />
                ) : threads.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 p-4">
                    <EmptyState title="No conversations yet" description="Start a new message to connect with a staff member." />
                    <Button variant="outline" className="bg-white" onClick={() => setShowNewChat(true)}>
                      <PenSquare className="h-4 w-4" /> New Message
                    </Button>
                  </div>
                ) : (
                  threads.map((thread) => (
                    <button
                      key={thread.threadId}
                      onClick={() => setSelectedThreadId(thread.threadId)}
                      className={`flex w-full items-start gap-3 rounded-3xl p-3 text-left transition-colors hover:bg-secondary-50 ${
                        selectedThread?.threadId === thread.threadId ? "bg-accent-50" : ""
                      }`}
                    >
                      <Avatar className="h-10 w-10 shrink-0">
                        <AvatarImage src={thread.sender?.avatar ?? undefined} />
                        <AvatarFallback className="bg-secondary-100 font-bold text-primary">{thread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="truncate font-bold text-primary">{thread.sender?.name ?? "School Staff"}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">
                            {new Date(thread.createdAt).toLocaleDateString("en-NG")}
                          </span>
                        </div>
                        <p className="truncate text-sm text-muted-foreground">{thread.content}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex h-[560px] flex-col overflow-hidden rounded-[2rem] border border-primary/10 bg-white shadow-card lg:h-full">
              {selectedThread ? (
                <>
                  <div className="flex items-center gap-3 border-b border-primary/10 bg-secondary-50 p-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={selectedThread.sender?.avatar ?? undefined} />
                      <AvatarFallback className="bg-white font-bold text-primary">{selectedThread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-primary">{selectedThread.sender?.name ?? "School Staff"}</p>
                      <p className="text-xs text-muted-foreground">Conversation</p>
                    </div>
                  </div>

                  <div className="flex-1 space-y-3 overflow-y-auto bg-[#FFF9F0] p-4">
                    {messagesLoading ? (
                      <LoadingTable columns={1} rows={4} />
                    ) : (
                      messages.map((message) => {
                        const isFromThem = message.senderId === selectedThread.senderId;
                        return (
                          <div key={message.id} className={`flex ${isFromThem ? "justify-start" : "justify-end"}`}>
                            <div
                              className={`max-w-[82%] rounded-3xl px-4 py-3 shadow-xs ${
                                isFromThem ? "rounded-tl-md bg-white text-primary" : "rounded-tr-md bg-accent text-white"
                              }`}
                            >
                              <p className="text-sm leading-6">{message.content}</p>
                              <span className={`mt-1 block text-[10px] ${isFromThem ? "text-muted-foreground" : "text-white/70"}`}>
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

                  <div className="flex items-center gap-2 border-t border-primary/10 p-3">
                    <button className="rounded-xl p-2 text-muted-foreground hover:bg-secondary-50" aria-label="Attach file">
                      <Paperclip className="h-4 w-4" />
                    </button>
                    <Input
                      placeholder="Type a message..."
                      value={messageText}
                      onChange={(event) => setMessageText(event.target.value)}
                      onKeyDown={(event) => event.key === "Enter" && sendMessage()}
                      className="rounded-2xl"
                    />
                    <Button size="sm" className="bg-accent text-white hover:bg-accent-400" disabled={sendMessageMutation.isPending} onClick={sendMessage}>
                      {sendMessageMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
                  <EmptyState title="Select a conversation" description="Choose a thread to read and reply, or start a new one." />
                  <Button variant="outline" className="bg-white" onClick={() => setShowNewChat(true)}>
                    <PenSquare className="h-4 w-4" /> New Message
                  </Button>
                </div>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="mb-3 flex justify-end">
            <Button variant="outline" size="sm" className="bg-white" disabled={markAllRead.isPending || unreadCount === 0} onClick={() => markAllRead.mutate(undefined)}>
              Mark all read
            </Button>
          </div>
          {notificationsLoading ? (
            <LoadingTable columns={1} />
          ) : notifications.length === 0 ? (
            <EmptyState title="No notifications" description="System alerts and school updates will appear here." />
          ) : (
            <div className="grid gap-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 rounded-3xl border border-primary/10 bg-white p-4 shadow-soft">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-50">
                    <Bell className="h-5 w-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-primary">{notification.title}</p>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleString("en-NG")}</p>
                  </div>
                  {!notification.isRead ? <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" /> : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
