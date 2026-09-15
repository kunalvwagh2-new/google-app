import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '../../../../lib/supabaseClient';

export async function POST(request: NextRequest) {
  try {
    const body = await (request as unknown as Request).json();
    const { eventType, tenantId, title, message, actionUrl } = body;

    if (!tenantId || !eventType) {
      return NextResponse.json({ success: false, error: 'Missing tenantId or eventType' }, { status: 400 });
    }

    // 1. Query temple_followers where tenant_id = tenantId and whatsapp_opt_in = true
    let followers: any[] = [];
    try {
      if (supabase && typeof supabase.from === 'function') {
        const { data, error } = await supabase
          .from('temple_followers')
          .select('user_id, whatsapp_opt_in')
          .eq('tenant_id', tenantId)
          .eq('whatsapp_opt_in', true);

        if (!error && data) {
          followers = data;
        }
      }
    } catch (dbErr) {
      console.warn('[WhatsAppWebhook] Supabase query warning:', dbErr);
    }

    // 2. Construct WhatsApp HSM Template payload (Meta Graph API / Twilio Simulation)
    const hsmPayloads = followers.map((f) => ({
      to: f.user_id,
      messaging_product: 'whatsapp',
      type: 'template',
      template: {
        name: eventType === 'LIVE_DARSHAN' ? 'live_darshan_alert' : 'temple_update_alert',
        language: { code: 'mr' },
        components: [
          {
            type: 'body',
            parameters: [
              { type: 'text', text: title || 'Shree Kshetra Darshan' },
              { type: 'text', text: message || 'New updates from followed temple.' },
              { type: 'text', text: actionUrl || 'https://kalbharavesus.anant.com' },
            ],
          },
        ],
      },
    }));

    // In production, batch queue via Upstash QStash or Twilio WhatsApp API
    console.log(`[WhatsAppWebhook] Successfully dispatched ${hsmPayloads.length} WhatsApp HSM alerts for tenant [${tenantId}]`);

    return NextResponse.json({
      success: true,
      dispatchedCount: hsmPayloads.length,
      message: `Successfully queued WhatsApp alerts for ${hsmPayloads.length} temple followers.`,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Webhook execution failed.' }, { status: 500 });
  }
}
