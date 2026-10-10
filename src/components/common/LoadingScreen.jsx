import { Landmark } from "lucide-react";
import "../../css/LoadingScreen.css";

const notes = [
    { id: 1, side: "left", delay: "0s", lane: "lane-one", gold: false },
    { id: 2, side: "left", delay: "0.9s", lane: "lane-two", gold: true },
    { id: 3, side: "left", delay: "1.8s", lane: "lane-three", gold: false },
    { id: 4, side: "right", delay: "0.45s", lane: "lane-two", gold: true },
    { id: 5, side: "right", delay: "1.35s", lane: "lane-one", gold: false },
    { id: 6, side: "right", delay: "2.25s", lane: "lane-three", gold: false },
];

function CurrencyNote({ side, lane, delay, gold }) {
    return (
        <span
            className={[
                "lux-note",
                `lux-note-${side}`,
                lane,
                gold ? "lux-note-gold" : "",
            ].filter(Boolean).join(" ")}
            style={{ "--delay": delay }}
        >
            <span className="lux-note-border">
                <span className="lux-note-corner">✦</span>
                <span className="lux-note-symbol">₹</span>
                <span className="lux-note-seal">V</span>
                <span className="lux-note-corner lux-note-corner-end">✦</span>
            </span>
        </span>
    );
}

function LoadingScreen({
    message = "Loading your banking experience...",
}) {
    return (
        <main
            className="lux-loading-screen"
            role="status"
            aria-live="polite"
            aria-label={message}
        >
            <div className="lux-loading-content">

                <div className="lux-scene" aria-hidden="true">
                    {/* Flowing paths behind the notes */}
                    <svg
                        className="lux-flow-lines"
                        viewBox="0 0 600 240"
                        preserveAspectRatio="none"
                    >
                        <defs>
                            <linearGradient id="lux-flow-green">
                                <stop offset="0%" stopColor="#B7CDBD" stopOpacity="0" />
                                <stop offset="55%" stopColor="#739A83" stopOpacity=".8" />
                                <stop offset="100%" stopColor="#A88B4A" stopOpacity=".15" />
                            </linearGradient>
                            <linearGradient id="lux-flow-gold">
                                <stop offset="0%" stopColor="#E3CFA0" stopOpacity="0" />
                                <stop offset="60%" stopColor="#A88B4A" stopOpacity=".75" />
                                <stop offset="100%" stopColor="#E3CFA0" stopOpacity=".1" />
                            </linearGradient>
                        </defs>

                        <path
                            d="M 0 60 C 105 8, 145 208, 300 120"
                            stroke="url(#lux-flow-green)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M 0 115 C 105 45, 175 195, 300 120"
                            stroke="url(#lux-flow-gold)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                        <path
                            d="M 600 60 C 495 8, 455 208, 300 120"
                            stroke="url(#lux-flow-green)"
                            strokeWidth="2"
                            fill="none"
                        />
                        <path
                            d="M 600 115 C 495 45, 425 195, 300 120"
                            stroke="url(#lux-flow-gold)"
                            strokeWidth="1.5"
                            fill="none"
                        />
                    </svg>

                    {/* Notes travel toward the central bank */}
                    <div className="lux-notes-layer">
                        {notes.map((note) => (
                            <CurrencyNote
                                key={note.id}
                                side={note.side}
                                lane={note.lane}
                                delay={note.delay}
                                gold={note.gold}
                            />
                        ))}
                    </div>

                    {/* Refined central bank emblem */}
                    <div className="lux-bank-halo">
                        <div className="lux-bank-emblem">
                            <div className="lux-bank-roof">
                                <span>V</span>
                            </div>

                            <div className="lux-bank-entablature" />

                            <div className="lux-bank-columns">
                                <span />
                                <span />
                                <span />
                                <span />
                            </div>

                            <div className="lux-bank-foundation" />
                        </div>
                    </div>

                    <span className="lux-scene-spark lux-spark-one" />
                    <span className="lux-scene-spark lux-spark-two" />
                    <span className="lux-scene-spark lux-spark-three" />
                    <span className="lux-scene-spark lux-spark-four" />
                </div>

                <section className="lux-brand">
                    <p className="lux-brand-overline">PRIVATE • TRUSTED • SECURE</p>
                    <h1>VISHNU <span>BANK</span></h1>
                    <div className="lux-brand-divider">
                        <span />
                        <span className="lux-divider-diamond" />
                        <span />
                    </div>
                    <p className="lux-tagline">
                        YOUR FINANCES. YOUR FUTURE.
                    </p>
                </section>

                <div className="lux-loading-status">
                    <div className="lux-progress-track" aria-hidden="true">
                        <span className="lux-progress-shimmer" />
                    </div>

                    <p className="lux-loading-message">{message}</p>

                    <div className="lux-loading-dots" aria-hidden="true">
                        <span />
                        <span />
                        <span />
                    </div>
                </div>

                <p className="lux-security-label">
                    <Landmark size={13} strokeWidth={1.5} />
                    <span>SECURE BANKING EXPERIENCE</span>
                </p>
            </div>
        </main>
    );
}

export default LoadingScreen;