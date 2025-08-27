import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Prefer explicitly provided public env var if available
const envUrl = (Constants && Constants.expoConfig && Constants.expoConfig.extra && Constants.expoConfig.extra.EXPO_PUBLIC_API_URL)
  || process.env?.EXPO_PUBLIC_API_URL;

let derivedHost;
try {
  // SDK 49+: Constants.expoConfig.hostUri  e.g., "192.168.1.10:19000"
  // Older SDK: Constants.manifest.debuggerHost
  const hostUri = (Constants && Constants.expoConfig && Constants.expoConfig.hostUri)
    || (Constants && Constants.manifest && Constants.manifest.debuggerHost)
    || '';
  if (hostUri) derivedHost = hostUri.split(':')[0];
} catch (e) {
  // ignore
}

const fallbackHost = Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
export const API_URL = envUrl || (derivedHost ? `http://${derivedHost}:4000` : `http://${fallbackHost}:4000`);

async function request(path, options = {}) {
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...(options.headers || {})
		}
	});
	const text = await res.text();
	let data;
	try { data = text ? JSON.parse(text) : null; } catch { data = text; }
	if (!res.ok) {
		const message = (data && data.error) ? data.error : `HTTP ${res.status}`;
		const err = new Error(message);
		// @ts-ignore
		err.status = res.status;
		throw err;
	}
	return data;
}

export async function health() {
	return request('/health');
}

export async function signup(email, password, name) {
	return request('/auth/signup', {
		method: 'POST',
		body: JSON.stringify({ email, password, name })
	});
}

export async function login(email, password) {
	return request('/auth/login', {
		method: 'POST',
		body: JSON.stringify({ email, password })
	});
}

export async function me(token) {
	return request('/users/me', {
		headers: { Authorization: `Bearer ${token}` }
	});
}

export async function requestCode(email) {
	return request('/auth/request-code', {
		method: 'POST',
		body: JSON.stringify({ email })
	});
}

export async function verifyCode(email, code) {
	return request('/auth/verify-code', {
		method: 'POST',
		body: JSON.stringify({ email, code })
	});
}

// Events
export async function createEvent(token, payload) {
	return request('/events', {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` },
		body: JSON.stringify(payload)
	});
}

export async function listNearby(token, query) {
	const q = new URLSearchParams(query).toString();
	return request(`/events/nearby?${q}`, {
		headers: token ? { Authorization: `Bearer ${token}` } : undefined
	});
}

export async function toggleRsvp(token, eventId) {
	return request(`/events/${eventId}/rsvp`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${token}` }
	});
}



