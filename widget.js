(function() {
  const scriptTag = document.currentScript;
  const clientData = scriptTag ? scriptTag.getAttribute('data-client-code') : '';
  const n8nWebhookUrl = 'REPLACE_WITH_YOUR_N8N_CHAT_WEBHOOK_URL';

  if (!localStorage.getItem('uk_ai_session')) {
    localStorage.setItem('uk_ai_session', 'sess_' + Math.random().toString(36).substring(2, 10));
  }
  const sessionId = localStorage.getItem('uk_ai_session');

  // Create Floating Chat Button
  const chatBtn = document.createElement('div');
  chatBtn.innerHTML = '💬 Instant Quote / Chat';
  chatBtn.style.cssText = 'position:fixed;bottom:20px;right:20px;background:#1d4ed8;color:#ffffff;padding:14px 22px;border-radius:50px;cursor:pointer;font-family:system-ui,-apple-system,sans-serif;font-weight:600;font-size:15px;box-shadow:0 8px 20px rgba(29,78,216,0.35);z-index:999999;';
  document.body.appendChild(chatBtn);

  // Create Chat Box
  const chatBox = document.createElement('div');
  chatBox.style.cssText = 'display:none;position:fixed;bottom:85px;right:20px;width:350px;height:480px;background:#ffffff;border-radius:16px;box-shadow:0 12px 32px rgba(0,0,0,0.22);z-index:999999;flex-direction:column;overflow:hidden;font-family:system-ui,-apple-system,sans-serif;border:1px solid #e5e7eb;';
  chatBox.innerHTML = `
    <div style="background:#1d4ed8;color:#ffffff;padding:16px;font-weight:700;display:flex;justify-content:space-between;align-items:center;">
      <span>🇬🇧 24/7 Virtual Receptionist</span>
      <span id="uk-ai-close" style="cursor:pointer;font-size:18px;">✕</span>
    </div>
    <div id="uk-ai-messages" style="flex:1;padding:16px;overflow-y:auto;font-size:14px;background:#f8fafc;line-height:1.4;">
      <div style="background:#e2e8f0;color:#0f172a;padding:10px 14px;border-radius:12px 12px 12px 2px;margin-bottom:12px;max-width:85%;">
        Hello! 👋 Looking for a quote or availability? Tell me what you need and leave your Name, Postcode, and Mobile Number—I'll pass it straight to our team!
      </div>
    </div>
    <div style="display:flex;border-top:1px solid #e2e8f0;padding:10px;background:#ffffff;">
      <input id="uk-ai-input" type="text" placeholder="Type your enquiry..." style="flex:1;border:1px solid #cbd5e1;padding:10px;border-radius:8px;outline:none;font-size:14px;color:#000;" />
      <button id="uk-ai-send" style="background:#1d4ed8;color:#ffffff;border:none;padding:0 16px;margin-left:8px;border-radius:8px;cursor:pointer;font-weight:600;">Send</button>
    </div>
  `;
  document.body.appendChild(chatBox);

  chatBtn.onclick = () => chatBox.style.display = 'flex';
  chatBox.querySelector('#uk-ai-close').onclick = () => chatBox.style.display = 'none';

  const sendMessage = async () => {
    const input = chatBox.querySelector('#uk-ai-input');
    const msgContainer = chatBox.querySelector('#uk-ai-messages');
    const text = input.value.trim();
    if (!text) return;

    msgContainer.innerHTML += `<div style="text-align:right;margin-bottom:12px;"><span style="background:#1d4ed8;color:#ffffff;padding:10px 14px;border-radius:12px 12px 2px 12px;display:inline-block;max-width:85%;text-align:left;">${text}</span></div>`;
    input.value = '';
    msgContainer.scrollTop = msgContainer.scrollHeight;

    try {
      const response = await fetch(n8nWebhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clientCode: clientData, message: text, sessionId, pageUrl: window.location.hostname })
      });
      const data = await response.json();
      msgContainer.innerHTML += `<div style="margin-bottom:12px;"><span style="background:#e2e8f0;color:#0f172a;padding:10px 14px;border-radius:12px 12px 12px 2px;display:inline-block;max-width:85%;">${data.reply || 'Thanks! Our team will ring you shortly.'}</span></div>`;
    } catch (err) {
      msgContainer.innerHTML += `<div style="margin-bottom:12px;"><span style="background:#fee2e2;color:#991b1b;padding:10px 14px;border-radius:12px;display:inline-block;">Connection error. Please call us directly.</span></div>`;
    }
    msgContainer.scrollTop = msgContainer.scrollHeight;
  };

  chatBox.querySelector('#uk-ai-send').onclick = sendMessage;
  chatBox.querySelector('#uk-ai-input').addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
})();
