"use client";

import { Loader2, Paperclip, PenSquare, Send, Users } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  type MessageRecord,
} from "@/hooks/useMessages";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useParents } from "@/hooks/useParents";
import { useStaff } from "@/hooks/useStaff";

type RecipientTab = "parents" | "staff";

export default function AdminMessagesPage() {
  const [selectedThread, setSelectedThread] = useState<MessageRecord | null>(null);
  const [text, setText] = useState("");

  // New chat dialog
  const [showNewChat, setShowNewChat] = useState(false);
  const [recipientTab, setRecipientTab] = useState<RecipientTab>("parents");
  const [newChatRecipientId, setNewChatRecipientId] = useState("");
  const [newChatRecipientName, setNewChatRecipientName] = useState("");
  const [newChatMessage, setNewChatMessage] = useState("");
  const [recipientSearch, setRecipientSearch] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: threads = [], isLoading } = useMessageThreads();
  const { data: parents = [], isLoading: parentsLoading } = useParents({ allRoles: false });
  const { data: staff = [], isLoading: staffLoading } = useStaff();
  const { data: currentUser } = useCurrentUser();
  const sendMessageMutation = useSendMessage();

  const activeThread = selectedThread ?? threads[0] ?? null;
  const { data: messages = [], isLoading: messagesLoading } = useMessages({
    threadId: activeThread?.threadId,
  });

  useRealtimeMessageThreads();
  useRealtimeMessages({ threadId: activeThread?.threadId });

  const filteredParents = useMemo(
    () =>
      parents.filter(
        (p) =>
          p.id !== currentUser?.id && // exclude self
          (recipientSearch === "" ||
            p.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
            p.email.toLowerCase().includes(recipientSearch.toLowerCase())),
      ),
    [parents, recipientSearch, currentUser?.id],
  );

  const filteredStaff = useMemo(
    () =>
      staff.filter(
        (s) =>
          s.id !== currentUser?.id && // exclude self
          s.isActive &&
          (recipientSearch === "" ||
            s.name.toLowerCase().includes(recipientSearch.toLowerCase()) ||
            s.role.toLowerCase().includes(recipientSearch.toLowerCase())),
      ),
    [staff, recipientSearch, currentUser?.id],
  );

  const send = () => {
    if (!activeThread || !text.trim()) return;
    sendMessageMutation.mutate(
      { threadId: activeThread.threadId, content: text },
      {
        onSuccess: () => {
          setText("");
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
        },
        onError: (error) => toast.error(error.message),
      },
    );
  };

  function selectRecipient(id: string, name: string) {
    setNewChatRecipientId(id);
    setNewChatRecipientName(name);
    setRecipientSearch(name);
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
          setNewChatRecipientName("");
          setNewChatMessage("");
          setRecipientSearch("");
        },
        onError: (error) => toast.error(error.message),
      },
    );
  }

  const recipients = recipientTab === "parents" ? filteredParents : filteredStaff;
  const recipientsLoading = recipientTab === "parents" ? parentsLoading : staffLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Messages"
        description="Manage parent and staff conversations from one inbox."
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
            {/* Parent / Staff tabs */}
            <Tabs
              value={recipientTab}
              onValueChange={(v) => {
                setRecipientTab(v as RecipientTab);
                setNewChatRecipientId("");
                setNewChatRecipientName("");
                setRecipientSearch("");
              }}
            >
              <TabsList className="w-full">
                <TabsTrigger value="parents" className="flex-1">Parents</TabsTrigger>
                <TabsTrigger value="staff" className="flex-1">Staff</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Search */}
            <div className="space-y-2">
              <Label>Select Recipient</Label>
              <Input
                placeholder={`Search ${recipientTab}...`}
                value={recipientSearch}
                onChange={(e) => {
                  setRecipientSearch(e.target.value);
                  if (e.target.value !== newChatRecipientName) setNewChatRecipientId("");
                }}
              />
              <div className="max-h-48 overflow-y-auto rounded-lg border border-border">
                {recipientsLoading ? (
                  <p className="p-3 text-sm text-muted-foreground">Loading…</p>
                ) : recipients.length === 0 ? (
                  <p className="p-3 text-sm text-muted-foreground">No results found.</p>
                ) : (
                  recipients.map((r) => {
                    const id = r.id;
                    const name = r.name;
                    const sub = recipientTab === "parents"
                      ? (r as typeof parents[0]).email
                      : `${(r as typeof staff[0]).role}${(r as typeof staff[0]).class ? ` · ${(r as typeof staff[0]).class}` : ""}`;
                    const photo = recipientTab === "parents"
                      ? (r as typeof parents[0]).avatar
                      : (r as typeof staff[0]).photo;

                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => selectRecipient(id, name)}
                        className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted ${
                          newChatRecipientId === id ? "bg-green-500/10 text-green-500" : ""
                        }`}
                      >
                        <Avatar className="h-8 w-8 shrink-0">
                          <AvatarImage src={photo ?? undefined} />
                          <AvatarFallback>{name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">{name}</p>
                          <p className="truncate text-xs text-muted-foreground">{sub}</p>
                        </div>
                        {newChatRecipientId === id && (
                          <Badge className="ml-auto shrink-0 bg-green-500 text-white text-[10px]">
                            Selected
                          </Badge>
                        )}
                      </button>
                    );
                  })
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

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowNewChat(false)}>
                Cancel
              </Button>
              <Button
                className="bg-green-500 text-white hover:bg-green-500-600"
                disabled={
                  !newChatRecipientId ||
                  !newChatMessage.trim() ||
                  sendMessageMutation.isPending
                }
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

      {/* ── Main inbox ── */}
      <div className="grid gap-4 lg:grid-cols-3 lg:h-[560px]">
        {/* Thread list */}
        <Card className="flex h-[420px] flex-col overflow-hidden shadow-soft lg:h-full">
          <CardContent className="border-b p-3">
            <Input placeholder="Search conversations..." className="text-sm" />
          </CardContent>
          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <LoadingTable columns={1} rows={5} />
            ) : threads.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 p-4">
                <EmptyState
                  title="No conversations"
                  description="Start a message to a parent or staff member."
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
                  onClick={() => setSelectedThread(thread)}
                  className={`flex w-full items-start gap-3 p-3 text-left hover:bg-muted transition-colors ${
                    activeThread?.threadId === thread.threadId ? "bg-muted" : ""
                  }`}
                >
                  <Avatar className="h-9 w-9 shrink-0">
                    <AvatarImage src={thread.sender?.avatar ?? undefined} />
                    <AvatarFallback>{thread.sender?.name?.charAt(0) ?? "P"}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`truncate text-sm ${thread.isRead ? "" : "font-semibold"}`}>
                        {thread.sender?.name ?? "School user"}
                      </p>
                      <span className="text-[10px] text-muted-foreground shrink-0">
                        {new Date(thread.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">{thread.content}</p>
                  </div>
                  {!thread.isRead && (
                    <span className="h-2 w-2 rounded-full bg-destructive shrink-0 mt-2" />
                  )}
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Message pane */}
        <Card className="flex h-[560px] flex-col overflow-hidden shadow-soft lg:col-span-2 lg:h-full">
          {activeThread ? (
            <>
              <CardHeader className="border-b pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={activeThread.sender?.avatar ?? undefined} />
                      <AvatarFallback>{activeThread.sender?.name?.charAt(0) ?? "P"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {activeThread.sender?.name ?? "Conversation"}
                      </p>
                      <p className="text-[10px] text-muted-foreground">
                        Thread {activeThread.threadId.slice(-8)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex-1 space-y-3 overflow-y-auto p-4">
                {messagesLoading ? (
                  <LoadingTable columns={1} rows={4} />
                ) : (
                  messages.map((message) => {
                    const fromThem = message.senderId === activeThread.senderId;
                    return (
                      <div key={message.id} className={`flex ${fromThem ? "justify-start" : "justify-end"}`}>
                        <div
                          className={`max-w-[75%] rounded-xl px-4 py-2.5 ${
                            fromThem ? "bg-muted" : "bg-green-500 text-white"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <span className="mt-1 block text-[10px] opacity-70">
                            {new Date(message.createdAt).toLocaleString("en-NG")}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </CardContent>

              <div className="flex items-center gap-2 border-t p-3">
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Input
                  placeholder="Type a message..."
                  className="flex-1 text-sm"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && send()}
                />
                <Button size="sm" onClick={send} disabled={sendMessageMutation.isPending}>
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
                description="Choose a thread to view messages and reply."
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
        </Card>
      </div>
    </div>
  );
}
