import { useState } from 'react';
import {
  Video,
  Phone,
  Search,
  MoreVertical,
  Mic,
  MicOff,
  VideoOff,
  PhoneOff,
  ScreenShare
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  avatar: string;
  relation: string;
  lastCall: string;
  isOnline: boolean;
}

const mockContacts: Contact[] = [
  { id: '1', name: '妈妈', avatar: '妈', relation: '母亲', lastCall: '2小时前', isOnline: true },
  { id: '2', name: '爸爸', avatar: '爸', relation: '父亲', lastCall: '昨天', isOnline: false },
  { id: '3', name: '姐姐', avatar: '姐', relation: '姐姐', lastCall: '3天前', isOnline: true },
  { id: '4', name: '护工小王', avatar: '王', relation: '护工', lastCall: '1小时前', isOnline: true },
];

export default function VideoChatPage() {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(mockContacts[0]);
  const [isCallActive, setIsCallActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-6">
      {/* Contact List */}
      <div className="w-80 rounded-xl border bg-white shadow-sm">
        <div className="border-b p-4">
          <h3 className="font-semibold text-stone-900">联系人</h3>
          <div className="relative mt-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="搜索联系人..."
              className="w-full rounded-lg border border-stone-200 pl-10 pr-4 py-2 text-sm focus:border-orange-300 focus:outline-none"
            />
          </div>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100% - 100px)' }}>
          {mockContacts.map((contact) => (
            <div
              key={contact.id}
              onClick={() => setSelectedContact(contact)}
              className={`flex cursor-pointer items-center space-x-3 border-b p-4 transition-colors ${
                selectedContact?.id === contact.id ? 'bg-orange-50' : 'hover:bg-stone-50'
              }`}
            >
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <span className="text-lg font-medium text-orange-600">{contact.avatar}</span>
                </div>
                {contact.isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-500" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium text-stone-900">{contact.name}</p>
                <p className="text-sm text-stone-500">{contact.relation}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-stone-400">{contact.lastCall}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Area */}
      <div className="flex-1 rounded-xl border bg-white shadow-sm overflow-hidden">
        {selectedContact ? (
          <div className="flex flex-col h-full">
            {/* Video Display */}
            <div className="flex-1 relative bg-stone-900">
              {isCallActive ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-white">
                    <div className="h-32 w-32 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                      <span className="text-5xl font-bold text-orange-400">{selectedContact.avatar}</span>
                    </div>
                    <p className="text-xl font-medium">{selectedContact.name}</p>
                    <p className="text-stone-400">通话中...</p>
                  </div>
                  {/* Self video preview */}
                  <div className="absolute bottom-4 right-4 w-48 h-36 rounded-lg bg-stone-800 border border-stone-700">
                    <div className="flex items-center justify-center h-full">
                      <span className="text-stone-500 text-sm">我的画面</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center text-stone-400">
                    <Video className="h-16 w-16 mx-auto mb-4" />
                    <p className="text-lg">选择联系人开始视频通话</p>
                  </div>
                </div>
              )}
            </div>

            {/* Controls */}
            <div className="border-t bg-white p-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={`rounded-full p-3 ${isMuted ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600'}`}
                >
                  {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsVideoOff(!isVideoOff)}
                  className={`rounded-full p-3 ${isVideoOff ? 'bg-red-100 text-red-600' : 'bg-stone-100 text-stone-600'}`}
                >
                  {isVideoOff ? <VideoOff className="h-5 w-5" /> : <Video className="h-5 w-5" />}
                </button>
                <button
                  onClick={() => setIsCallActive(!isCallActive)}
                  className={`rounded-full p-4 ${isCallActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white`}
                >
                  {isCallActive ? <PhoneOff className="h-6 w-6" /> : <Phone className="h-6 w-6" />}
                </button>
                <button className="rounded-full p-3 bg-stone-100 text-stone-600">
                  <ScreenShare className="h-5 w-5" />
                </button>
                <button className="rounded-full p-3 bg-stone-100 text-stone-600">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-stone-400">
            <p>请选择联系人</p>
          </div>
        )}
      </div>

      {/* Chat Sidebar */}
      <div className="w-80 rounded-xl border bg-white shadow-sm flex flex-col">
        <div className="border-b p-4">
          <h3 className="font-semibold text-stone-900">聊天记录</h3>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {[
            { sender: '我', text: '妈，今天感觉怎么样？', time: '14:30' },
            { sender: '妈妈', text: '挺好的，今天去公园散步了', time: '14:31' },
            { sender: '我', text: '那就好，记得按时吃药', time: '14:32' },
            { sender: '妈妈', text: '好的，知道了', time: '14:33' },
          ].map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === '我' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg px-4 py-2 ${
                msg.sender === '我' ? 'bg-orange-500 text-white' : 'bg-stone-100 text-stone-900'
              }`}>
                <p className="text-sm">{msg.text}</p>
                <p className={`text-xs mt-1 ${msg.sender === '我' ? 'text-orange-100' : 'text-stone-400'}`}>{msg.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="border-t p-4">
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="输入消息..."
              className="flex-1 rounded-lg border border-stone-200 px-4 py-2 text-sm focus:border-orange-300 focus:outline-none"
            />
            <button className="rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600">
              发送
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
