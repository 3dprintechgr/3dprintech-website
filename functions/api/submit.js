export async function onRequestPost({ request, env }) {
  const headers = { 'Content-Type': 'application/json; charset=utf-8' };
  const reply = (body, status = 200) => new Response(JSON.stringify(body), { status, headers });
  if (!env.RESEND_API_KEY || !env.ORDER_TO_EMAIL || !env.FROM_EMAIL) {
    return reply({ error: 'Email service is not configured yet.' }, 503);
  }
  const form = await request.formData();
  if (form.get('website')) return reply({ ok: true }); // honeypot
  const name = String(form.get('name') || '').trim();
  const email = String(form.get('email') || '').trim();
  const description = String(form.get('description') || '').trim();
  if (!name || !email || !description || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return reply({ error: 'Please complete the required fields.' }, 400);
  }
  const files = form.getAll('files').filter(f => f && typeof f.arrayBuffer === 'function' && f.size > 0);
  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  if (totalSize > 8 * 1024 * 1024) return reply({ error: 'Attachments exceed 8 MB.' }, 413);
  const attachments = [];
  for (const file of files) {
    const bytes = new Uint8Array(await file.arrayBuffer());
    let binary = '';
    for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    attachments.push({ filename: file.name.replace(/[^\w.\- ()]/g, '_'), content: btoa(binary) });
  }
  const isOrder = Boolean(form.get('quantity') || form.get('material') || form.get('dimensions') || files.length);
  const subject = `${isOrder ? 'Νέα custom παραγγελία' : 'Νέο μήνυμα'} — ${name}`;
  const lines = [
    `Τύπος αιτήματος: ${isOrder ? 'Custom παραγγελία' : 'Επικοινωνία'}`,
    `Όνομα: ${name}`, `Email: ${email}`, `Τηλέφωνο: ${form.get('phone') || '—'}`,
    `Ποσότητα: ${form.get('quantity') || '—'}`, `Υλικό: ${form.get('material') || '—'}`,
    `Χρώμα: ${form.get('color') || '—'}`, `Διαστάσεις: ${form.get('dimensions') || '—'}`,
    '', 'Περιγραφή:', description, '', `Συνημμένα: ${files.map(f => f.name).join(', ') || 'Κανένα'}`
  ];
  const payload = { from: env.FROM_EMAIL, to: [env.ORDER_TO_EMAIL], reply_to: email, subject, text: lines.join('\n') };
  if (attachments.length) payload.attachments = attachments;
  const sent = await fetch('https://api.resend.com/emails', {
    method: 'POST', headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
  });
  if (!sent.ok) return reply({ error: 'Email provider rejected the request.' }, 502);
  return reply({ ok: true });
}
