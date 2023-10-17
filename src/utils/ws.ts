import type { Release } from '@tunnel/release';
import { getMkcertCerts } from '@tunnel/mkcert';
import { getMonorepoDirpath } from 'get-monorepo-root';
import { WebSocket } from 'ws';
import which from 'which';

export async function getNodeWebSocketConstructor({
	release
}: {
	release: Release;
}) {
	let ws: any;

	if (release === 'development') {
		const monorepoDirpath = getMonorepoDirpath();
		if (monorepoDirpath === undefined) {
			throw new Error('Could not find monorepo dirpath');
		}

		const { ca, cert, key } = await getMkcertCerts({
			mkcertBin: await which('mkcert'),
			monorepoDirpath
		});

		ws = class CustomWebSocket extends WebSocket {
			constructor(url: string) {
				super(url, { ca, cert, key });
			}
		};
	} else {
		ws = WebSocket;
	}

	return ws;
}
