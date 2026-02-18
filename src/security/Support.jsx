import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Support = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState([
    {
      question: "How do I track my order?",
      answer: "Go to 'My Orders', click 'Track Order', and see live updates.",
    },
    {
      question: "How can I cancel an order?",
      answer:
        "You can cancel an order within 24 hours from 'My Orders' page before it is shipped.",
    },
    {
      question: "How do I request a refund?",
      answer:
        "Go to your order, click 'Request Refund', and fill in the details.",
    },
    {
      question: "How do I update my account info?",
      answer:
        "Go to 'My Account' section to update your personal info and saved addresses.",
    },
  ]);

  const [tickets, setTickets] = useState(() => {
    return JSON.parse(localStorage.getItem("supportTickets")) || [];
  });
  const [ticketMessage, setTicketMessage] = useState("");

  const submitTicket = () => {
    if (!ticketMessage.trim()) return;
    const newTicket = {
      id: Date.now(),
      message: ticketMessage,
      status: "Open",
      createdAt: new Date().toISOString(),
    };
    const updatedTickets = [newTicket, ...tickets];
    setTickets(updatedTickets);
    localStorage.setItem("supportTickets", JSON.stringify(updatedTickets));
    setTicketMessage("");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold mb-6">Help & Support</h1>

        {/* FAQ SECTION */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b pb-2">
                <p className="font-medium">{faq.question}</p>
                <p className="text-gray-500 text-sm mt-1">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TICKET SECTION */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Submit a Support Request
          </h2>
          <textarea
            value={ticketMessage}
            onChange={(e) => setTicketMessage(e.target.value)}
            rows={4}
            placeholder="Describe your issue..."
            className="w-full border rounded-lg p-3 mb-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={submitTicket}
            className="bg-black text-white px-6 py-2 rounded-xl hover:opacity-90 transition"
          >
            Submit Ticket
          </button>

          {/* Ticket list */}
          {tickets.length > 0 && (
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Your Tickets</h3>
              <div className="space-y-2">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className="border p-3 rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <p className="text-gray-700 text-sm">{ticket.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Status:{" "}
                        <span
                          className={`font-semibold ${
                            ticket.status === "Open"
                              ? "text-green-600"
                              : "text-gray-500"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      {new Date(ticket.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* NAVIGATION */}
        <div className="text-center mt-4">
          <button
            onClick={() => navigate("/account")}
            className="bg-gray-200 px-6 py-2 rounded-xl hover:bg-gray-300 transition"
          >
            Back to Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Support;
