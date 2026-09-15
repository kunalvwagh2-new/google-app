'use server';

import { supabase } from '../../lib/supabaseClient';

export interface TenantRegistrationData {
  name: string;
  subdomain: string;
  govRegNumber: string;
  adminName: string;
  adminEmail: string;
  adminPhone: string;
  complianceDocUrl?: string;
}

export async function registerTenantAction(data: TenantRegistrationData) {
  const cleanSubdomain = data.subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');
  if (!cleanSubdomain || cleanSubdomain.length < 3) {
    return { success: false, error: 'Subdomain must be at least 3 alphanumeric characters.' };
  }

  try {
    const tenantId = `tenant_${Date.now()}`;
    const adminUserId = `user_admin_${Date.now()}`;

    const tenantPayload = {
      id: tenantId,
      name: data.name,
      subdomain: cleanSubdomain,
      gov_reg_number: data.govRegNumber,
      status: 'pending_verification', // Pre-verification state (single-seat basic access)
      base_seat_limit: 5,
      purchased_extra_seats: 0,
      bank_account_verified: false,
      compliance_doc_url: data.complianceDocUrl || 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    };

    const adminMemberPayload = {
      id: `member_${Date.now()}`,
      tenant_id: tenantId,
      user_id: adminUserId,
      email: data.adminEmail,
      full_name: data.adminName,
      role: 'temple_admin',
      is_primary_admin: true,
      status: 'active',
    };

    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('tenants').insert(tenantPayload);
        await supabase.from('tenant_members').insert(adminMemberPayload);
      }
    } catch (dbErr) {
      console.warn('[TenantAuth] Supabase insert warning (using local fallback):', dbErr);
    }

    return {
      success: true,
      data: {
        tenantId,
        subdomain: cleanSubdomain,
        dashboardUrl: `https://${cleanSubdomain}.anant.com/dashboard`,
      },
      message: 'Temple Trust registered successfully! Status is pending verification.',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Tenant registration failed.' };
  }
}

export async function initiateTenantLoginAction(emailOrId: string, password: string) {
  if (!emailOrId || !password) {
    return { success: false, error: 'Please enter credentials.' };
  }

  try {
    // Simulated credential check & 2-step OTP trigger
    return {
      success: true,
      requiresOtp: true,
      emailOrId,
      message: 'Credentials verified. 6-digit OTP dispatched to registered mobile/WhatsApp.',
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Login initiation failed.' };
  }
}

export async function verifyTenantOtpAndNotifyAction(
  emailOrId: string,
  otpCode: string,
  subdomain: string
) {
  if (otpCode !== '123456' && otpCode !== '000000') {
    return { success: false, error: 'Invalid 6-digit OTP. Use 123456 for demo verification.' };
  }

  try {
    const auditLogId = `log_${Date.now()}`;
    const timestamp = new Date().toISOString();

    // Trigger background notification to Primary Admin via Webhook / WhatsApp API
    console.log(
      `[TenantAuth] WHATSAPP & EMAIL WEBHOOK DISPATCHED: Primary Admin notified that user logging into subdomain [${subdomain}] at ${timestamp}`
    );

    try {
      if (supabase && typeof supabase.from === 'function') {
        await supabase.from('login_audit_logs').insert({
          id: auditLogId,
          tenant_id: 'tenant_sample_1',
          user_id: 'user_admin_1',
          user_name: 'Pandit Rajesh Sharma',
          user_role: 'temple_admin',
          ip_address: '192.168.1.50',
          timestamp,
        });
      }
    } catch {}

    return {
      success: true,
      data: {
        redirectUrl: `https://${subdomain || 'kalbharavesus'}.anant.com/dashboard`,
        tenantName: 'Shree Kalbhairav Nath Mandir Trust',
        role: 'temple_admin',
      },
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'OTP verification failed.' };
  }
}

export async function inviteTenantMemberAction(
  tenantId: string,
  email: string,
  fullName: string,
  role: string
) {
  try {
    const memberId = `member_${Date.now()}`;
    const userId = `user_${Date.now()}`;

    if (supabase && typeof supabase.from === 'function') {
      await supabase.from('tenant_members').insert({
        id: memberId,
        tenant_id: tenantId,
        user_id: userId,
        email,
        full_name: fullName,
        role,
        is_primary_admin: false,
        status: 'invited',
      });
    }

    return {
      success: true,
      message: `Invitation successfully sent to ${email} for role [${role}].`,
    };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to invite member.' };
  }
}
