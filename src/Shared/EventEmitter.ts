/*
 * metaweb-schema-ts
 *
 * META Schema parser, analyzer, compiler and runtime.
 *
 * @package metaweb-schema-ts
 * @copyright 2020 Jiri Hybek <jiri@hybek.cz> and META Web contributors.
 * @license Apache-2.0
 *
 * See LICENSE file distributed with this source code for more information.
 */

/**
 * Event Emitter
 */
export class EventEmitter<TEventName = string, TEventData = any> {

	/** List of listeners */
	private _listeners: any = {};

	private _listenerCount: number = 0;

	/**
	 * Add event listener
	 *
	 * @param eventName Event name
	 * @param handler Event handler
	 */
	public on(eventName: TEventName, handler: (event: TEventData) => void) {

		if (!this._listeners[eventName])
			this._listeners[eventName] = [];

		this._listeners[eventName].push(handler);
		this._listenerCount++;

	}

	/**
	 * Add event listener and listen once
	 *
	 * @param eventName Event name
	 * @param handler Event handler
	 */
	public once(eventName: TEventName, handler: (event: TEventData) => void) {

		if (!this._listeners[eventName])
			this._listeners[eventName] = [];

		this._listeners[eventName].push((ev) => {

			this.off(eventName, handler);
			handler.call(null, ev);

		});

		this._listenerCount++;

	}

	/**
	 * Removes event listener
	 *
	 * @param eventName Event name
	 * @param handler Event handler
	 */
	public off(eventName: TEventName, handler: (event: TEventData) => void) {

		if (!this._listeners[eventName]) return;

		const i = this._listeners[eventName].indexOf(handler);

		if (i >= 0) {
			this._listeners[eventName].splice(i, 1);
			this._listenerCount--;
		}

		if (this._listeners[eventName].length === 0)
			delete this._listeners[eventName];

	}

	/**
	 * Removes all listeners
	 */
	public removeAllListeners() {

		this._listeners = {};
		this._listenerCount = 0;

	}

	/**
	 * Emit event
	 * @param eventName Event name
	 * @param eventData Event data
	 */
	protected emit(eventName: TEventName, eventData: TEventData = null) {

		if (!this._listeners[eventName]) return;

		for (let i = 0; i < this._listeners[eventName].length; i++)
			this._listeners[eventName][i].call(null, eventData, eventName);

	}

	/**
	 * Returns count of listeners
	 */
	public getListenerCount() {

		return this._listenerCount;

	}

}
