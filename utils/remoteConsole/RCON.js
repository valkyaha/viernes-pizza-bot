const { Socket } = require('net');
const dgram = require('dgram');
const { EventEmitter } = require('events');

const PacketType = {
	COMMAND: 0x02, AUTH: 0x03, RESPONSE_VALUE: 0x00, RESPONSE_AUTH: 0x02,
};

class RemoteConsole extends EventEmitter {
	constructor(host, port, password, options = {}) {
		super();
		this.host = host;
		this.port = port;
		this.password = password;
		this.rconId = options.id || 0x0012D4A6;
		this.hasAuthed = false;
		this.outstandingData = null;
		this.tcp = options.tcp ?? true;
		this.challenge = options.challenge ?? true;
	}

	send(data, cmd, id) {
		let sendBuf;
		if (this.tcp) {
			cmd = cmd ?? PacketType.COMMAND;
			id = id ?? this.rconId;

			const length = Buffer.byteLength(data);
			sendBuf = Buffer.alloc(length + 14);
			sendBuf.writeInt32LE(length + 10, 0);
			sendBuf.writeInt32LE(id, 4);
			sendBuf.writeInt32LE(cmd, 8);
			sendBuf.write(data, 12);
			sendBuf.writeInt16LE(0, length + 12);
		}
		else {
			if (this.challenge && !this._challengeToken) {
				this.emit('error', new Error('Not authenticated'));
				return;
			}
			let str = 'rcon ';
			if (this._challengeToken) str += this._challengeToken + ' ';
			if (this.password) str += this.password + ' ';
			str += data + '\n';
			sendBuf = Buffer.alloc(4 + Buffer.byteLength(str));
			sendBuf.writeInt32LE(-1, 0);
			sendBuf.write(str, 4);
		}
		this._sendSocket(sendBuf);
	}

	_sendSocket(buf) {
		if (this._tcpSocket) {
			this._tcpSocket.write(buf);
		}
		else if (this._udpSocket) {
			this._udpSocket.send(buf, 0, buf.length, this.port, this.host);
		}
	}

	connect() {
		if (this.tcp) {
			this._tcpSocket = new Socket();
			this._tcpSocket.connect(this.port, this.host);
			this._tcpSocket.on('data', data => this._tcpSocketOnData(data))
				.on('connect', () => this.socketOnConnect())
				.on('error', err => this.emit('error', err))
				.on('end', () => this.socketOnEnd());
		}
		else {
			this._udpSocket = dgram.createSocket('udp4');
			this._udpSocket.on('message', data => this._udpSocketOnData(data))
				.on('listening', () => this.socketOnConnect())
				.on('error', err => this.emit('error', err))
				.on('close', () => this.socketOnEnd());
			this._udpSocket.bind(0);
		}
	}

	disconnect() {
		if (this._tcpSocket) this._tcpSocket.end();
		if (this._udpSocket) this._udpSocket.close();
	}

	setTimeout(timeout, callback) {
		if (!this._tcpSocket) return;

		this._tcpSocket.setTimeout(timeout, function() {
			this._tcpSocket.end();
			if (callback) callback();
		});
	}
}

RemoteConsole.prototype._udpSocketOnData = function(data) {
	let a = data.readUInt32LE(0);
	if (a === 0xffffffff) {
		let str = data.toString('utf-8', 4);
		let tokens = str.split(' ');
		if (tokens.length === 3 && tokens[0] === 'challenge' && tokens[1] === 'rcon') {
			this._challengeToken = tokens[2].substring(0, tokens[2].length - 1).trim();
			this.hasAuthed = true;
			this.emit('auth');
		}
		else {
			this.emit('response', str.substring(1, str.length - 1));
		}
	}
	else {
		this.emit('error', new Error('Received malformed packet'));
	}
};

RemoteConsole.prototype._tcpSocketOnData = function(data) {
	if (this.outstandingData != null) {
		data = Buffer.concat([this.outstandingData, data], this.outstandingData.length + data.length);
		this.outstandingData = null;
	}

	let packet = this._parsePacket(data);

	while (packet != null) {
		if (packet.id === this.rconId) {
			this._handleRemoteConsolePacket(packet);
		}
		else if (packet.id === -1) {
			this.emit('error', new Error('Authentication failed'));
		}
		else {
			this.emit('server', packet.body);
		}

		packet = this._parsePacket(packet.remainingData);
	}

	this.outstandingData = packet != null ? packet.remainingData : data;
};

RemoteConsole.prototype._parsePacket = function(data) {
	if (data.length < 12) {
		return null;
	}

	const len = data.readInt32LE(0);

	if (!len) {
		return null;
	}

	const packetLen = len + 4;

	if (data.length < packetLen) {
		return null;
	}

	const id = data.readInt32LE(4);
	const type = data.readInt32LE(8);
	const bodyLen = len - 10;

	if (bodyLen < 0) {
		return {
			remainingData: data.slice(packetLen),
		};
	}

	const body = data.toString('utf8', 12, 12 + bodyLen).replace(/\n$/, '');

	return {
		id,
		type,
		body,
		remainingData: data.slice(packetLen),
	};
};

RemoteConsole.prototype._handleRemoteConsolePacket = function(packet) {
	if (!this.hasAuthed && packet.type === PacketType.RESPONSE_AUTH) {
		this.hasAuthed = true;
		this.emit('auth');
	}
	else if (packet.type === PacketType.RESPONSE_VALUE) {
		this.emit('response', packet.body);
	}
};


RemoteConsole.prototype.socketOnConnect = function() {
	let sendBuf;
	this.emit('connect');

	if (this.tcp) {
		this.send(this.password, PacketType.AUTH);
	}
	else if (this.challenge) {
		let str = 'challenge rcon\n';
		sendBuf = Buffer.alloc(str.length + 4);
		sendBuf.writeInt32LE(-1, 0);
		sendBuf.write(str, 4);
		this._sendSocket(sendBuf);
	}
	else {
		sendBuf = Buffer.alloc(5);
		sendBuf.writeInt32LE(-1, 0);
		sendBuf.writeUInt8(0, 4);
		this._sendSocket(sendBuf);

		this.hasAuthed = true;
		this.emit('auth');
	}
};

RemoteConsole.prototype.socketOnEnd = function() {
	this.emit('end');
	this.hasAuthed = false;
};

module.exports = RemoteConsole;