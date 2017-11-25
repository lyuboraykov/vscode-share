import {database} from 'firebase';

const VALUE_CHANGED_EVENT = 'value';

// TODO: rename it gradually
const FIREBASE_SESSIONS_PATH = 'rooms/';

/**
 * Represents a session which is shared
 *
 * @export
 * @class Session
 */
export default class Session {
    private sessionName: string;
    private sessionPath: string;
    private isConnected: boolean;
    private onContentChangeCb: (content: string, editByUUID: string) => void;

    /**
     * Creates an instance of Session.
     *
     * @param {string} sessionName - the name of the Session to create
     * @param {(content: string) => void} onContentChange - this will be called every
     * time content changes
     *
     * @memberOf Session
     */
    constructor(sessionName: string, onContentChange: (content: string, editByUUID: string) => void) {
        this.sessionName = sessionName;
        this.sessionPath = `${FIREBASE_SESSIONS_PATH}${this.sessionName}`;
        this.isConnected = false;
        this.onContentChangeCb = onContentChange;
    }

    /**
     * Start listening for changes in a Session
     *
     * Every time there's a change call onContentChange
     *
     * @returns {void}
     *
     * @memberOf Session
     */
    public connect(): void {
        if (this.isConnected) {
            return;
        }
        database().ref(this.sessionPath).on(VALUE_CHANGED_EVENT, (snapshot) => {
            let value = snapshot.val()
            this.onContentChangeCb(value.content, value.lastEditBy);
        });
        this.isConnected = true;
    }

    /**
     * Create a new shared Session and connect to it
     *
     * @memberOf Session
     */
    public create(editorGuid: string): void {
        database().ref(this.sessionPath).set({
            content: '',
            lastEditBy: editorGuid
        });
    }

    /**
     * Stop listening for changes in a Session
     *
     * @returns {void}
     *
     * @memberOf Session
     */
    public disconnect(): void {
        if (!this.isConnected) {
            return;
        }
        this.isConnected = false;
        database().ref(this.sessionPath).off(VALUE_CHANGED_EVENT);
    }

    /**
     * Set the content of a Session, useful to be applied as a callback somewhere
     *
     * @param {any} content
     * @returns {void}
     *
     * @memberOf Session
     */
    public setContent(content: string, editBy: string): void {
        if (!this.isConnected) {
            return;
        }
        database().ref(this.sessionPath).set({
            content: content,
            lastEditBy: editBy
        });
    }

    /**
     * Get a list of all Sessions available.
     *
     * @static
     * @returns {Thenable<string[]>}
     *
     * @memberOf Session
     */
    public static getSessionNames(): Thenable<string[]> {
        return database().ref(FIREBASE_SESSIONS_PATH).once(VALUE_CHANGED_EVENT).then(snapshot => {
            return Object.keys(snapshot.val());
        })
    }
}
