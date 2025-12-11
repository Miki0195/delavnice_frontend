import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft, Send, Trash2 } from 'lucide-react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import {
  getConversations,
  getConversation,
  sendMessage,
  markConversationAsRead,
  type Conversation,
  type ConversationDetail,
} from '../../api/messages';
import Button from '../../components/ui/Button';

const Sporocila = () => {
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(null);
  const [messageText, setMessageText] = useState('');
  const queryClient = useQueryClient();

  // Fetch all conversations
  const { data: conversationsData, isLoading: conversationsLoading } = useQuery({
    queryKey: ['conversations'],
    queryFn: getConversations,
  });

  // Ensure conversations is always an array
  const conversations = Array.isArray(conversationsData) ? conversationsData : [];

  // Fetch selected conversation detail
  const { data: conversationDetail, isLoading: conversationLoading } = useQuery({
    queryKey: ['conversation', selectedConversationId],
    queryFn: () => getConversation(selectedConversationId!),
    enabled: !!selectedConversationId,
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: ({ conversationId, content }: { conversationId: number; content: string }) =>
      sendMessage(conversationId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversation', selectedConversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      setMessageText('');
    },
  });

  // Mark conversation as read when selected
  useEffect(() => {
    if (selectedConversationId && conversationDetail) {
      const selectedConv = conversations.find(c => c.id === selectedConversationId);
      if (selectedConv && selectedConv.unread_count > 0) {
        markConversationAsRead(selectedConversationId).then(() => {
          queryClient.invalidateQueries({ queryKey: ['conversations'] });
        });
      }
    }
  }, [selectedConversationId, conversationDetail, conversations, queryClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (messageText.trim() && selectedConversationId) {
      sendMessageMutation.mutate({
        conversationId: selectedConversationId,
        content: messageText,
      });
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('sl-SI', { hour: '2-digit', minute: '2-digit' });
    } else if (days === 1) {
      return '1 dan';
    } else if (days < 7) {
      return `${days} dni`;
    } else {
      const weeks = Math.floor(days / 7);
      return weeks === 1 ? '1 teden' : `${weeks} tedne`;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col h-[calc(100vh-120px)]">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Sporočila</h1>

        <div className="flex-1 flex bg-white rounded-lg shadow-md overflow-hidden">
          {/* Conversations List */}
          <div
            className={`${
              selectedConversationId ? 'hidden md:block' : 'block'
            } w-full md:w-96 border-r border-gray-200 overflow-y-auto`}
          >
            {conversationsLoading ? (
              <div className="p-4 text-center text-gray-500">Nalaganje...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">Nimate še sporočil</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {conversations.map((conversation) => {
                  const hasUnread = conversation.unread_count > 0;
                  return (
                    <button
                      key={conversation.id}
                      onClick={() => setSelectedConversationId(conversation.id)}
                      className={`w-full p-4 text-left transition-colors relative ${
                        selectedConversationId === conversation.id
                          ? 'bg-cyan-50'
                          : hasUnread
                          ? 'bg-green-50 hover:bg-green-100 border-l-4 border-green-500'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center">
                          <span className="text-gray-600 font-semibold">
                            {conversation.other_participant_name[0].toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className={`truncate ${hasUnread ? 'font-bold text-gray-900' : 'font-semibold text-gray-900'}`}>
                              {conversation.other_participant_name}
                            </h3>
                            {conversation.latest_message && (
                              <span className={`text-xs ml-2 flex-shrink-0 ${hasUnread ? 'font-semibold text-green-600' : 'text-gray-500'}`}>
                                {formatTime(conversation.latest_message.created_at)}
                              </span>
                            )}
                          </div>

                          {conversation.workshop_title && (
                            <p className="text-xs text-gray-500 mb-1">{conversation.workshop_title}</p>
                          )}

                          {conversation.latest_message && (
                            <p className={`text-sm truncate ${hasUnread ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                              {conversation.latest_message.content}
                            </p>
                          )}

                          {hasUnread && (
                            <div className="flex items-center gap-2 mt-2">
                              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                              <span className="text-xs font-semibold text-green-600">
                                Novo sporočilo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Conversation Detail */}
          {selectedConversationId && conversationDetail ? (
            <div className="flex-1 flex flex-col">
              {/* Header */}
              <div className="p-4 border-b border-gray-200 flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversationId(null)}
                  className="md:hidden text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="w-6 h-6" />
                </button>

                <div className="flex-1">
                  <h2 className="font-semibold text-gray-900">
                    {conversationDetail.other_participant_name}
                  </h2>
                  {conversationDetail.workshop_title && (
                    <p className="text-sm text-gray-500">{conversationDetail.workshop_title}</p>
                  )}
                </div>

                <button className="text-gray-400 hover:text-red-600 transition-colors">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {conversationLoading ? (
                  <div className="text-center text-gray-500">Nalaganje...</div>
                ) : (
                  conversationDetail.messages.map((message) => {
                    const isCurrentUser = message.sender === conversationDetail.participant_1 
                      || message.sender === conversationDetail.participant_2;
                    const isSender = message.sender_name !== conversationDetail.other_participant_name;

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isSender ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            isSender
                              ? 'bg-cyan-500 text-white'
                              : 'bg-gray-100 text-gray-900'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          <span className={`text-xs mt-1 block ${
                            isSender ? 'text-cyan-100' : 'text-gray-500'
                          }`}>
                            {new Date(message.created_at).toLocaleString('sl-SI', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
                <div className="flex gap-2">
                  <textarea
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Vaše sporočilo"
                    rows={2}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 resize-none"
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={sendMessageMutation.isPending || !messageText.trim()}
                    className="bg-cyan-500 hover:bg-cyan-600 px-6"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
              </form>
            </div>
          ) : (
            !selectedConversationId && (
              <div className="hidden md:flex flex-1 items-center justify-center text-gray-500">
                <p>Izberite pogovor za prikaz sporočil</p>
              </div>
            )
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Sporocila;
