"use client";

import { Paperclip, Send } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { EmptyState } from "@/components/shared/EmptyState";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useMessageThreads, useMessages, useRealtimeMessages, useRealtimeMessageThreads, useSendMessage, type MessageRecord } from "@/hooks/useMessages";

export default function AdminMessagesPage() {
  const [selectedThread, setSelectedThread] = useState<MessageRecord | null>(null);
  const [text, setText] = useState("");
  const { data: threads = [], isLoading } = useMessageThreads();
  const activeThread = selectedThread ?? threads[0] ?? null;
  const { data: messages = [] } = useMessages({ threadId: activeThread?.threadId });
  const sendMessage = useSendMessage();
  useRealtimeMessageThreads();
  useRealtimeMessages({ threadId: activeThread?.threadId });

  const send = () => {
    if (!activeThread || !text.trim()) return;
    sendMessage.mutate(
      { threadId: activeThread.threadId, content: text },
      {
        onSuccess: () => {
          setText("");
          toast.success("Message sent");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-display font-bold text-green lg:text-2xl">Messages</h1>
        <p className="text-sm text-muted-foreground">Manage parent and staff conversations from one inbox.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-3 lg:h-[560px]">
        <Card className="flex h-[420px] flex-col overflow-hidden shadow-soft lg:h-full">
          <CardContent className="border-b p-3">
            <Input placeholder="Search conversations..." className="text-sm" />
          </CardContent>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <p className="p-4 text-sm text-muted-foreground">Loading inbox...</p>
            ) : threads.length === 0 ? (
              <EmptyState title="No conversations" description="Parent and staff threads will appear here." />
            ) : (
              threads.map((thread) => (
                <button
                  key={thread.threadId}
                  onClick={() => setSelectedThread(thread)}
                  className={`flex w-full items-start gap-3 p-3 text-left hover:bg-muted ${activeThread?.threadId === thread.threadId ? "bg-muted" : ""}`}
                >
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={thread.sender?.avatar ?? undefined} />
                    <AvatarFallback>{thread.sender?.name?.charAt(0) ?? "P"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`truncate text-sm ${thread.isRead ? "" : "font-semibold"}`}>{thread.sender?.name ?? "School user"}</p>
                      <span className="text-[10px] text-muted-foreground">{new Date(thread.createdAt).toLocaleTimeString("en-NG", { hour: "2-digit", minute: "2-digit" })}</span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{thread.content}</p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        <Card className="flex h-[560px] flex-col overflow-hidden shadow-soft lg:col-span-2 lg:h-full">
          {activeThread ? (
            <>
              <CardHeader className="border-b pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={activeThread.sender?.avatar ?? undefined} />
                    <AvatarFallback>{activeThread.sender?.name?.charAt(0) ?? "P"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{activeThread.sender?.name ?? "Conversation"}</p>
                    <p className="text-[10px] text-muted-foreground">Thread {activeThread.threadId.slice(-8)}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.map((message) => {
                  const fromSelectedSender = message.senderId === activeThread.senderId;
                  return (
                    <div key={message.id} className={`flex ${fromSelectedSender ? "justify-start" : "justify-end"}`}>
                      <div className={`max-w-[75%] rounded-xl px-4 py-2.5 ${fromSelectedSender ? "bg-muted" : "bg-green text-white"}`}>
                        <p className="text-sm">{message.content}</p>
                        <span className="mt-1 block text-[10px] opacity-70">{new Date(message.createdAt).toLocaleString("en-NG")}</span>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
              <div className="flex items-center gap-2 border-t p-3">
                <Button variant="ghost" size="sm"><Paperclip className="h-4 w-4" /></Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  onKeyDown={(event) => event.key === "Enter" && send()}
                />
                <Button size="sm" onClick={send} disabled={sendMessage.isPending}><Send className="h-4 w-4" /></Button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center">
              <EmptyState title="Select a conversation" description="Choose a thread to view messages and reply." />
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
