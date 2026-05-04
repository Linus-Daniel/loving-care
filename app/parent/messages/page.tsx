"use client";

import { Bell, Paperclip, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingTable } from "@/components/shared/LoadingTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { useMessages, useMessageThreads, useRealtimeMessages, useRealtimeMessageThreads, useSendMessage } from "@/hooks/useMessages";
import { useMarkAllNotificationsRead, useNotifications } from "@/hooks/useNotifications";

export default function Messages() {
  const [activeTab, setActiveTab] = useState("messages");
  const [selectedThreadId, setSelectedThreadId] = useState<string | undefined>();
  const [messageText, setMessageText] = useState("");
  const { data: threads = [], isLoading: threadsLoading } = useMessageThreads();
  const selectedThread = useMemo(() => threads.find((thread) => thread.threadId === selectedThreadId) ?? threads[0], [threads, selectedThreadId]);
  const { data: messages = [], isLoading: messagesLoading } = useMessages({ threadId: selectedThread?.threadId });
  const { data: notifications = [], isLoading: notificationsLoading } = useNotifications();
  const markAllRead = useMarkAllNotificationsRead();
  const sendMessageMutation = useSendMessage();
  useRealtimeMessageThreads();
  useRealtimeMessages({ threadId: selectedThread?.threadId });

  function sendMessage() {
    if (!messageText.trim() || !selectedThread) return;
    sendMessageMutation.mutate(
      { threadId: selectedThread.threadId, content: messageText },
      {
        onSuccess: () => {
          toast.success("Message sent");
          setMessageText("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  const unreadCount = notifications.filter((notification) => !notification.isRead).length;

  return (
    <div className="space-y-6">
      <PageHeader title="Messages & Notifications" description="Communicate with staff and view alerts" />

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-muted">
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
            {unreadCount > 0 ? <Badge className="ml-2 bg-destructive text-[10px] text-white">{unreadCount}</Badge> : null}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="messages">
          <div className="grid gap-4 lg:h-[500px] lg:grid-cols-3">
            <div className="flex h-[400px] flex-col overflow-hidden rounded-xl yellow-50 shadow-card lg:h-full">
              <div className="border-b border-border p-3">
                <Input placeholder="Search messages..." className="text-sm" />
              </div>
              <div className="flex-1 overflow-y-auto">
                {threadsLoading ? (
                  <LoadingTable columns={1} rows={4} />
                ) : threads.length === 0 ? (
                  <EmptyState title="No message threads" description="Conversations with staff will appear here." />
                ) : (
                  threads.map((thread) => (
                    <button
                      key={thread.threadId}
                      onClick={() => setSelectedThreadId(thread.threadId)}
                      className={`flex w-full items-start gap-3 p-3 text-left transition-colors hover:bg-muted ${
                        selectedThread?.threadId === thread.threadId ? "bg-muted" : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={thread.sender?.avatar ?? undefined} />
                        <AvatarFallback>{thread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-semibold">{thread.sender?.name ?? "School Staff"}</p>
                          <span className="shrink-0 text-[10px] text-muted-foreground">{new Date(thread.createdAt).toLocaleDateString("en-NG")}</span>
                        </div>
                        <p className="truncate text-xs text-muted-foreground">{thread.content}</p>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            <div className="flex h-[500px] flex-col overflow-hidden rounded-xl yellow-50 shadow-card lg:col-span-2 lg:h-full">
              {selectedThread ? (
                <>
                  <div className="flex items-center gap-3 border-b border-border p-4">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={selectedThread.sender?.avatar ?? undefined} />
                      <AvatarFallback>{selectedThread.sender?.name?.[0] ?? "S"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{selectedThread.sender?.name ?? "School Staff"}</p>
                      <p className="text-[10px] text-muted-foreground">Conversation</p>
                    </div>
                  </div>
                  <div className="flex-1 space-y-3 overflow-y-auto p-4">
                    {messagesLoading ? (
                      <LoadingTable columns={1} rows={4} />
                    ) : (
                      messages.map((message) => {
                        const fromSelectedSender = message.senderId === selectedThread.senderId;
                        return (
                          <div key={message.id} className={`flex ${fromSelectedSender ? "justify-start" : "justify-end"}`}>
                            <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${fromSelectedSender ? "rounded-tl-sm bg-teal/10 text-foreground" : "rounded-tr-sm bg-green text-white"}`}>
                              <p className="text-sm">{message.content}</p>
                              <span className={`mt-1 block text-[10px] ${fromSelectedSender ? "text-muted-foreground" : "text-white/60"}`}>
                                {new Date(message.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                  <div className="flex items-center gap-2 border-t border-border p-3">
                    <button className="rounded-lg p-2 text-muted-foreground hover:bg-muted"><Paperclip className="h-4 w-4" /></button>
                    <Input placeholder="Type a message..." value={messageText} onChange={(event) => setMessageText(event.target.value)} onKeyDown={(event) => event.key === "Enter" && sendMessage()} />
                    <Button size="sm" className="bg-green text-white" disabled={sendMessageMutation.isPending} onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <EmptyState title="Select a conversation" description="Choose a thread to read and reply." />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <div className="mb-3 flex justify-end">
            <Button variant="outline" size="sm" disabled={markAllRead.isPending || unreadCount === 0} onClick={() => markAllRead.mutate()}>
              Mark all read
            </Button>
          </div>
          {notificationsLoading ? (
            <LoadingTable columns={1} />
          ) : notifications.length === 0 ? (
            <EmptyState title="No notifications" description="System alerts and school updates will appear here." />
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start gap-3 rounded-xl yellow-50 p-4 shadow-card">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green/10">
                    <Bell className="h-5 w-5 text-green" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{notification.title}</p>
                    <p className="text-xs text-muted-foreground">{notification.message}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">{new Date(notification.createdAt).toLocaleString("en-NG")}</p>
                  </div>
                  {!notification.isRead ? <span className="h-2.5 w-2.5 rounded-full bg-destructive" /> : null}
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
