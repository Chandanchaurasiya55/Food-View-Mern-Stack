import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// Reusable feed for vertical reels
// Props:
// - items: Array of video items { _id, video, description, likeCount, savesCount, commentsCount, comments, foodPartner }
// - onLike: (item) => void | Promise<void>
// - onSave: (item) => void | Promise<void>
// - emptyMessage: string
const ReelFeed = ({ items = [], onLike, onSave, emptyMessage = 'No videos yet.' }) => {
  const videoRefs = useRef(new Map())
  const [unmuteFailedIds, setUnmuteFailedIds] = useState(new Set())

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target
          if (!(video instanceof HTMLVideoElement)) return
          const isPartner = video.dataset.foodpartner === '1'
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            // Attempt to auto-unmute partner videos so visitors hear partner uploads automatically.
            if (isPartner) {
              video.muted = false
              video.play().catch(() => {
                // If the browser blocks unmuted autoplay, fall back to muted autoplay and remember the failure.
                try { video.muted = true } catch { /* ignore */ }
                setUnmuteFailedIds((prev) => new Set(prev).add(video.dataset.id))
                video.play().catch(() => { /* ignore second play error */ })
              })
            } else {
              video.play().catch(() => { /* ignore autoplay errors */ })
            }
          } else {
            video.pause()
          }
        })
      },
      { threshold: [0, 0.25, 0.6, 0.9, 1] }
    )

    videoRefs.current.forEach((vid) => observer.observe(vid))
    return () => observer.disconnect()
  }, [items])

  const setVideoRef = (id) => (el) => {
    if (!el) { videoRefs.current.delete(id); return }
    // store reference and set metadata attrs used by observer logic
    el.dataset.id = id
    // if item-level foodPartner flag exists we set it when rendering; keep it here if not
    videoRefs.current.set(id, el)
  }

  const toggleMute = (id) => {
    const vid = videoRefs.current.get(id)
    if (!vid) return
    const willUnmute = vid.muted === true
    try {
      vid.muted = !vid.muted
  } catch { /* ignore */ }

    if (willUnmute) {
      // try to play with audio; browsers may block this
      vid.play().then(() => {
        // success - clear any failure marker
        setUnmuteFailedIds((prev) => {
          const copy = new Set(prev)
          copy.delete(id)
          return copy
        })
  try { localStorage.setItem('reels_audio_enabled', '1') } catch { /* ignore */ }
      }).catch(() => {
        // failed to unmute-autoplay: revert to muted and mark failed so UI can indicate
  try { vid.muted = true } catch { /* ignore */ }
        setUnmuteFailedIds((prev) => new Set(prev).add(id))
      })
    } else {
      // muted now
  try { localStorage.removeItem('reels_audio_enabled') } catch { /* ignore */ }
    }
  }

  return (
    <div className="reels-page">
      <div className="reels-feed" role="list">
        {items.length === 0 && (
          <div className="empty-state">
            <p>{emptyMessage}</p>
          </div>
        )}

        {items.map((item) => (
          <section key={item._id} className="reel" role="listitem">
            <video
              ref={setVideoRef(item._id)}
              className="reel-video"
              src={item.video}
              muted={!(item.foodPartner)}
              data-foodpartner={item.foodPartner ? '1' : '0'}
              playsInline
              loop
              preload="metadata"
            />

            <div className="reel-overlay">
              <div className="reel-overlay-gradient" aria-hidden="true" />
              <div className="reel-actions">
                <div className="reel-action-group">
                  <button
                    onClick={onLike ? () => onLike(item) : undefined}
                    className="reel-action"
                    aria-label="Like"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.likeCount ?? item.likesCount ?? item.likes ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button
                    className="reel-action"
                    onClick={onSave ? () => onSave(item) : undefined}
                    aria-label="Bookmark"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.savesCount ?? item.bookmarks ?? item.saves ?? 0}</div>
                </div>

                <div className="reel-action-group">
                  <button className="reel-action" aria-label="Comments">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    </svg>
                  </button>
                  <div className="reel-action__count">{item.commentsCount ?? (Array.isArray(item.comments) ? item.comments.length : 0)}</div>
                </div>

                {/* Audio toggle - allow users to enable sound for the current reel */}
                <div className="reel-action-group">
                  <button
                    className="reel-action reel-audio-toggle"
                    onClick={() => toggleMute(item._id)}
                    aria-label="Toggle audio"
                    title={unmuteFailedIds.has(item._id) ? 'Tap to enable audio (requires interaction)' : 'Toggle audio'}
                  >
                    {/* Simple speaker icon - filled when unmuted */}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11 5L6 9H2v6h4l5 4V5z" />
                      <path d="M19 8a4 4 0 0 1 0 8" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="reel-content">
                <p className="reel-description" title={item.description}>{item.description}</p>
                {item.foodPartner && (
                  <Link className="reel-btn" to={"/food-partner/" + item.foodPartner} aria-label="Visit store">Visit store</Link>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}

export default ReelFeed
