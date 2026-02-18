import { useState, useEffect } from 'react';
import { Send } from 'lucide-react';
import { messagesService, storage } from '../services/storage';
import { formatTime } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Avatar from '../components/common/Avatar';

const Chat = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadMessages();
    }
  }, [selectedUser]);

  const loadConversations = () => {
    const convs = messagesService.getConversations(user.id);
    const allUsers = storage.get('users') || [];
    const otherUsers = allUsers.filter(u => u.id !== user.id).map(u => {
      const conv = convs.find(c => c.userId === u.id);
      return { userId: u.id, userName: u.name, lastMessage: conv?.lastMessage || 'No messages', timestamp: conv?.timestamp || new Date().toISOString(), unread: 0 };
    });
    setConversations(otherUsers);
    if (!selectedUser && otherUsers.length > 0) {
      setSelectedUser(otherUsers[0]);
    }
  };

  const loadMessages = () => {
    if (!selectedUser) return;
    const msgs = messagesService.getConversation(user.id, selectedUser.userId);
    setMessages(msgs);
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedUser) return;

    messagesService.send(user.id, selectedUser.userId, newMessage);
    setNewMessage('');
    loadMessages();
    loadConversations();
  };

  return (
    <div className="w-full h-[calc(100vh-64px)] lg:h-screen p-6 lg:p-10">
      <div className="h-full bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden flex">
        <div className="w-80 border-r border-secondary-200 flex flex-col">
          <div className="h-18 flex items-center justify-between border-b border-secondary-200 px-5 flex-shrink-0">
            <h3 className="text-lg font-bold">Messages</h3>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {conversations.map(conv => (
              <button key={conv.userId} onClick={() => setSelectedUser(conv)} className={`w-full h-20 flex items-center gap-3 px-5 border-b border-secondary-200 hover:bg-secondary-50 transition ${selectedUser?.userId === conv.userId ? 'bg-primary-50 border-l-4 border-l-primary-600' : ''}`}>
                <Avatar name={conv.userName} />
                <div className="flex-1 min-w-0 text-left">
                  <p className="font-semibold text-sm truncate">{conv.userName}</p>
                  <p className="text-xs text-secondary-500 truncate mt-1">{conv.lastMessage}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col">
          {selectedUser ? (
            <>
              <div className="h-20 flex items-center gap-4 border-b border-secondary-200 px-6 flex-shrink-0">
                <Avatar name={selectedUser.userName} size="lg" />
                <div>
                  <h3 className="text-lg font-bold">{selectedUser.userName}</h3>
                  <p className="text-sm text-secondary-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : ''}`}>
                    <div className={`max-w-[70%] rounded-2xl p-4 ${msg.senderId === user.id ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white' : 'bg-secondary-100'}`}>
                      <p className="text-sm">{msg.message}</p>
                      <p className="text-xs opacity-70 mt-2">{formatTime(msg.timestamp)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={sendMessage} className="h-20 border-t border-secondary-200 px-6 flex items-center gap-3 flex-shrink-0">
                <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type a message..." className="flex-1 h-12 bg-secondary-50 border-0 rounded-xl text-sm px-4 focus:outline-none focus:ring-2 focus:ring-primary-500/20" />
                <button type="submit" className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition"><Send size={20} /></button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-secondary-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
