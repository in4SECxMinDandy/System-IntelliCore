'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MessageSquare, Phone, Mail, Search, Filter, Send,
  User, Clock, CheckCircle, AlertCircle, ChevronRight, Star
} from 'lucide-react';

const tickets = [
  { id: 'TKT-001', subject: 'Cannot complete checkout', customer: 'John Doe', status: 'open', priority: 'high', created: '2 hours ago', messages: 5 },
  { id: 'TKT-002', subject: 'Refund request for order #1234', customer: 'Sarah Smith', status: 'in_progress', priority: 'medium', created: '5 hours ago', messages: 3 },
  { id: 'TKT-003', subject: 'Product arrived damaged', customer: 'Mike Johnson', status: 'open', priority: 'high', created: '1 day ago', messages: 2 },
  { id: 'TKT-004', subject: 'Question about warranty', customer: 'Emily Brown', status: 'resolved', priority: 'low', created: '2 days ago', messages: 8 },
  { id: 'TKT-005', subject: 'Account access issue', customer: 'David Wilson', status: 'in_progress', priority: 'medium', created: '3 days ago', messages: 4 },
];

const chatMessages = [
  { id: 1, role: 'customer', message: 'Hi, I need help with my order', time: '10:30 AM' },
  { id: 2, role: 'agent', message: 'Hello! I\'d be happy to help. Can you provide your order number?', time: '10:31 AM' },
  { id: 3, role: 'customer', message: 'It\'s #ORD-1234. The package shows delivered but I haven\'t received it.', time: '10:32 AM' },
  { id: 4, role: 'agent', message: 'I apologize for the inconvenience. Let me check the tracking information for you.', time: '10:33 AM' },
  { id: 5, role: 'agent', message: 'I can see the package was marked as delivered to your address. Would you like me to initiate a search with the carrier?', time: '10:35 AM' },
];

export default function SupportPage() {
  const [activeTab, setActiveTab] = useState('tickets');
  const [selectedTicket, setSelectedTicket] = useState(tickets[0]);

  return (
    <div className="min-h-screen bg-[#181411] text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A100A] border-r border-[#393028] flex flex-col">
        <div className="p-4 border-b border-[#393028]">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#f27f0d] flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">Support</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/staff" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Dashboard</span>
          </Link>
          <Link href="/staff/warehouse" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Warehouse</span>
          </Link>
          <Link href="/staff/logistics" className="flex items-center gap-3 px-4 py-3 rounded-xl text-[#baab9c] hover:text-white hover:bg-[#2D241B]">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Logistics</span>
          </Link>
          <Link href="/staff/support" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#f27f0d] text-white">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-medium">Support</span>
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Tickets List */}
        <div className="w-96 border-r border-[#393028] flex flex-col">
          <div className="p-4 border-b border-[#393028]">
            <h2 className="text-lg font-semibold text-white mb-4">Support Tickets</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#baab9c]" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full bg-[#221910] border border-[#393028] rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {tickets.map((ticket) => (
              <button
                key={ticket.id}
                onClick={() => setSelectedTicket(ticket)}
                className={`w-full p-4 text-left border-b border-[#393028] hover:bg-[#2D241B]/50 transition-colors ${
                  selectedTicket.id === ticket.id ? 'bg-[#2D241B]' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-xs text-[#baab9c]">{ticket.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    ticket.status === 'open' ? 'bg-red-500/20 text-red-400' :
                    ticket.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-green-500/20 text-green-400'
                  }`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-white font-medium text-sm mb-1">{ticket.subject}</p>
                <div className="flex items-center justify-between text-xs text-[#baab9c]">
                  <span>{ticket.customer}</span>
                  <span>{ticket.created}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-[#393028] flex items-center justify-between">
            <div>
              <h3 className="text-white font-semibold">{selectedTicket.subject}</h3>
              <p className="text-sm text-[#baab9c]">{selectedTicket.customer} • {selectedTicket.id}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
                <Phone className="w-5 h-5 text-[#baab9c]" />
              </button>
              <button className="p-2 rounded-lg hover:bg-[#2D241B] transition-colors">
                <Mail className="w-5 h-5 text-[#baab9c]" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'agent' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-3 ${
                  msg.role === 'agent' 
                    ? 'bg-[#f27f0d] text-white rounded-br-sm' 
                    : 'bg-[#221910] text-white rounded-bl-sm'
                }`}>
                  <p className="text-sm">{msg.message}</p>
                  <p className={`text-xs mt-1 ${msg.role === 'agent' ? 'text-white/60' : 'text-[#baab9c]'}`}>
                    {msg.time}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-[#393028]">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 bg-[#221910] border border-[#393028] rounded-xl px-4 py-3 text-white placeholder:text-[#baab9c] focus:outline-none focus:border-[#f27f0d]"
              />
              <button className="p-3 bg-[#f27f0d] text-white rounded-xl hover:bg-[#d16b08] transition-colors">
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
