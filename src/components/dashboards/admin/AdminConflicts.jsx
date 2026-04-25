import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';

const AdminConflicts = () => {
  // Use context if available, otherwise fallback to our mock data array
  const { allTickets, resolveTicket } = useAdmin();
  
  const [filter, setFilter] = useState('open'); // 'all', 'open', 'resolved'
  const [searchQuery, setSearchQuery] = useState('');

  // Fallback data reflecting the tickets in your mockData.js
  const defaultTickets = [
    { id: "ticket_001", type: "conflict", status: "open", dateOpened: "Apr 05, 2026", reporterId: "student_123", reportedPartyId: "comp_djezzy", subject: "Company not responding after acceptance", description: "I was accepted for the UI/UX internship 3 weeks ago, but the HR department is ignoring my emails regarding the internship convention." },
    { id: "ticket_003", type: "conflict", status: "open", dateOpened: "Apr 07, 2026", reporterId: "std_002", reportedPartyId: "comp_scam", subject: "Suspicious Interview Request", description: "This company asked me to pay a 'training fee' of 5000 DZD before starting the internship. Is this normal?" },
    { id: "ticket_002", type: "support", status: "resolved", dateOpened: "Mar 28, 2026", reporterId: "comp_yassir", reportedPartyId: null, subject: "Cannot update company logo", description: "I am trying to upload a new PNG logo but the platform keeps throwing a 500 error." }
  ];

  const ticketsList = allTickets?.length > 0 ? allTickets : defaultTickets;

  // Filter based on status and search query
  const filteredTickets = ticketsList.filter(ticket => {
    const matchesFilter = filter === 'all' || ticket.status === filter;
    const searchString = `${ticket.subject} ${ticket.description} ${ticket.id}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleResolve = (id) => {
    if (window.confirm("Mark this ticket as resolved?")) {
      if (resolveTicket) resolveTicket(id);
      else console.log(`Resolved ticket ${id}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans pb-8">
      
      {/* ================= HEADER & SEARCH ================= */}
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6 transition-colors duration-300">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">
            Conflicts & Support
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Manage user reports, mediate disputes, and resolve technical issues.</p>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
          />
        </div>
      </div>

      {/* ================= TABS ================= */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-700 pb-px overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter('open')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            filter === 'open' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Open Tickets
          {ticketsList.filter(t => t.status === 'open').length > 0 && (
            <span className="bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400 py-0.5 px-2 rounded-full text-xs">
              {ticketsList.filter(t => t.status === 'open').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setFilter('resolved')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'resolved' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          Resolved
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${
            filter === 'all' ? 'border-[#2563EB] dark:border-blue-500 text-[#2563EB] dark:text-blue-400' : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
          }`}
        >
          All History
        </button>
      </div>

      {/* ================= TICKET LIST ================= */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <div key={ticket.id} className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col gap-4 hover:border-slate-200 dark:hover:border-slate-600 transition-all duration-300">
              
              {/* Ticket Header */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-700/50 pb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide
                    ${ticket.type === 'conflict' ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400' : 'bg-blue-50 dark:bg-blue-500/10 text-[#2563EB] dark:text-blue-400'}
                  `}>
                    {ticket.type}
                  </span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">{ticket.subject}</span>
                  <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">#{ticket.id}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{ticket.dateOpened}</span>
                  <span className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-amber-500 dark:bg-amber-400' : 'bg-emerald-500 dark:bg-emerald-400'}`}></span>
                </div>
              </div>

              {/* Ticket Body */}
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-3">
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-700/50 p-4 rounded-xl border border-slate-100 dark:border-slate-600">
                    "{ticket.description}"
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <svg className="w-4 h-4 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      <span>Reporter: <strong className="text-slate-700 dark:text-slate-300">{ticket.reporterId}</strong></span>
                    </div>
                    {ticket.reportedPartyId && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">|</span>
                        <div className="flex items-center gap-1.5">
                          <svg className="w-4 h-4 text-red-400 dark:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                          <span>Reported: <strong className="text-slate-700 dark:text-slate-300">{ticket.reportedPartyId}</strong></span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row md:flex-col items-center md:items-end justify-center md:w-48 gap-3 shrink-0 border-t md:border-t-0 md:border-l border-slate-50 dark:border-slate-700/50 pt-4 md:pt-0 md:pl-4">
                  {ticket.status === 'open' ? (
                    <>
                      <button className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-[#2563EB] dark:hover:text-blue-400 text-sm font-bold rounded-lg transition-colors">
                        Message Parties
                      </button>
                      <button 
                        onClick={() => handleResolve(ticket.id)}
                        className="w-full px-4 py-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 text-sm font-bold rounded-lg transition-colors"
                      >
                        Mark Resolved
                      </button>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-4 py-2 rounded-lg w-full justify-center">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
                      <span className="text-sm font-bold">Resolved</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-800 p-12 rounded-2xl border border-slate-100 dark:border-slate-700 flex flex-col items-center justify-center text-center transition-colors duration-300">
            <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">No tickets found</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm">There are no {filter} tickets requiring your attention.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminConflicts;