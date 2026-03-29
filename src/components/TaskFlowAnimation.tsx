'use client'

import * as React from 'react'
import {
  Bell,
  CalendarCheck,
  CheckCircle2,
  Clock,
  DatabaseZap,
  Flame,
  Lock,
  RefreshCw,
  ServerCog,
  TrendingDown,
  TrendingUp,
  X,
  XCircle,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase =
  | 'formVisible'
  | 'taskCreating'
  // Task visible centre, server sliding in left
  | 'taskAndServer'
  // User must click "Mark complete" — animation paused
  | 'waitingComplete'
  // User clicked — final server steps run
  | 'completing'
  // Task fades out, server slides centre
  | 'taskFadeOut'
  | 'serverSlideCenter'
  | 'notifShow'
  | 'serverFadeOut'
  | 'analysisShow'
  | 'done'

type NavItem = 'Dashboard' | 'Tasks' | 'Insights' | 'Calendar'

interface ServerStep {
  id: number
  label: string
  sub: string
  Icon: React.FC<{ size?: number }>
}

// ─── Server steps ─────────────────────────────────────────────────────────────
// Steps 0-2 run automatically, step 3 shows pre-notif, then we pause.
// After user clicks complete, step 4 runs → completion notif.
const SERVER_STEPS: Array<ServerStep> = [
  {
    id: 0,
    label: 'Persisting task',
    sub: 'Writing to database',
    Icon: DatabaseZap,
  },
  {
    id: 1,
    label: 'Background processing',
    sub: 'Queueing async jobs',
    Icon: ServerCog,
  },
  {
    id: 2,
    label: 'Checking schedule',
    sub: 'Resolving conflicts & slots',
    Icon: CalendarCheck,
  },
  {
    id: 3,
    label: 'Pre-task reminder',
    sub: 'Scheduling 5 min alert',
    Icon: Bell,
  },
  {
    id: 4,
    label: 'Syncing UI state',
    sub: 'Invalidating task cache',
    Icon: RefreshCw,
  },
]

// ─── Task status labels ───────────────────────────────────────────────────────
type TaskStatus = 'Scheduled' | 'Processing' | 'Reminder sent' | 'Completed'

const STATUS_COLOR: Record<TaskStatus, string> = {
  Scheduled: 'var(--primary)',
  Processing: 'var(--chart-2)',
  'Reminder sent': 'var(--chart-5)',
  Completed: 'var(--chart-3)',
}

// ─── Nav map ──────────────────────────────────────────────────────────────────
const NAV_ACTIVE: Record<Phase, NavItem | null> = {
  formVisible: null,
  taskCreating: 'Tasks',
  taskAndServer: 'Tasks',
  waitingComplete: 'Tasks',
  completing: 'Dashboard',
  taskFadeOut: 'Dashboard',
  serverSlideCenter: 'Dashboard',
  notifShow: 'Dashboard',
  serverFadeOut: 'Insights',
  analysisShow: 'Insights',
  done: 'Insights',
}

// ─── Analysis data ────────────────────────────────────────────────────────────
const METRIC_CARDS = [
  {
    label: 'Completion rate',
    value: '87%',
    trend: 'up' as const,
    Icon: CheckCircle2,
    colorVar: 'var(--chart-3)',
    bgVar: 'color-mix(in oklch, var(--chart-3) 12%, transparent)',
  },
  {
    label: 'Total tracked',
    value: '24h',
    trend: null,
    Icon: Clock,
    colorVar: 'var(--chart-5)',
    bgVar: 'color-mix(in oklch, var(--chart-5) 12%, transparent)',
  },
  {
    label: 'Avg duration',
    value: '38m',
    trend: 'up' as const,
    Icon: Flame,
    colorVar: 'var(--chart-2)',
    bgVar: 'color-mix(in oklch, var(--chart-2) 12%, transparent)',
  },
  {
    label: 'Miss rate',
    value: '13%',
    trend: 'down' as const,
    Icon: XCircle,
    colorVar: 'var(--destructive)',
    bgVar: 'color-mix(in oklch, var(--destructive) 12%, transparent)',
  },
]

const HEATMAP: Array<Array<number>> = [
  [0, 1, 2, 3, 2, 1, 3, 2],
  [1, 2, 1, 0, 3, 2, 1, 3],
  [2, 3, 3, 2, 1, 3, 2, 1],
  [0, 0, 1, 2, 3, 1, 0, 2],
  [1, 2, 0, 1, 2, 3, 1, 0],
]
const PEAK_HOURS = [0, 0, 1, 2, 4, 6, 8, 10, 7, 5, 4, 3, 2, 2, 1, 1, 0]
const WEEKLY = [
  { week: 'W1', scheduled: 4, completed: 3, missed: 1 },
  { week: 'W2', scheduled: 5, completed: 4, missed: 1 },
  { week: 'W3', scheduled: 3, completed: 3, missed: 0 },
  { week: 'W4', scheduled: 6, completed: 5, missed: 1 },
  { week: 'W5', scheduled: 4, completed: 2, missed: 2 },
  { week: 'W6', scheduled: 5, completed: 5, missed: 0 },
]

const NAV_ITEMS: Array<NavItem> = ['Dashboard', 'Tasks', 'Insights', 'Calendar']

function wait(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms))
}

// ─── Notification toast ───────────────────────────────────────────────────────
interface ToastProps {
  visible: boolean
  title: string
  body: string
  timestamp: string
  onDismiss: () => void
}
function Toast({ visible, title, body, timestamp, onDismiss }: ToastProps) {
  const [out, setOut] = useState(false)

  useEffect(() => {
    if (visible) setOut(false)
  }, [visible])

  function dismiss() {
    setOut(true)
    setTimeout(onDismiss, 380)
  }

  if (!visible && !out) return null

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 16,
        right: 16,
        width: 300,
        zIndex: 40,
        opacity: out ? 0 : 1,
        transform: out ? 'translateX(320px)' : 'translateX(0)',
        transition: out
          ? 'transform 0.36s cubic-bezier(0.4,0,1,1), opacity 0.3s ease'
          : 'transform 0.42s cubic-bezier(0.34,1.56,0.64,1), opacity 0.42s ease',
        animation:
          visible && !out
            ? 'tfNotifIn 0.42s cubic-bezier(0.34,1.56,0.64,1) forwards'
            : 'none',
      }}
    >
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '11px 11px 11px 13px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: 11,
          boxShadow: 'var(--shadow-lg)',
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 9,
            flexShrink: 0,
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <CheckCircle2 size={16} color="var(--primary-foreground)" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: 2,
            }}
          >
            <p
              style={{
                fontSize: 10,
                color: 'var(--muted-foreground)',
                fontWeight: 600,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Task Scheduler
            </p>
            <p style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
              {timestamp}
            </p>
          </div>
          <p
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: 'var(--card-foreground)',
              marginBottom: 2,
              lineHeight: 1.3,
            }}
          >
            {title}
          </p>
          <p
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {body}
          </p>
        </div>
        <button
          onClick={dismiss}
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--muted-foreground)',
            padding: 2,
            marginTop: -1,
            display: 'flex',
            alignItems: 'center',
            borderRadius: 5,
            flexShrink: 0,
          }}
        >
          <X size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TaskFlowAnimation() {
  const [phase, setPhase] = useState<Phase>('formVisible')
  const [taskTitle, setTaskTitle] = useState('')
  const [focusSession, setFocusSession] = useState(false)
  const [taskStatus, setTaskStatus] = useState<TaskStatus>('Scheduled')
  const [activeStep, setActiveStep] = useState(-1)
  const [doneSteps, setDoneSteps] = useState<Array<number>>([])
  const [taskDate, setTaskDate] = useState('')
  const [taskTime, setTaskTime] = useState('')
  const [pathname, setPathname] = useState('/')

  // Two separate toasts: pre-reminder and completion
  const [preNotif, setPreNotif] = useState(false)
  const [completeNotif, setCompleteNotif] = useState(false)

  // Resolve handle — resolves when user clicks "Mark complete"
  const completeResolve = useRef<(() => void) | null>(null)
  const aborted = useRef(false)

  const activeNav = NAV_ACTIVE[phase]

  // Set pathname on client mount for SSR compatibility
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname)
    }
  }, [])

  // Promise that waits for user to click "Mark complete"
  function waitForComplete(): Promise<void> {
    return new Promise((resolve) => {
      completeResolve.current = resolve
    })
  }

  function handleMarkComplete() {
    if (completeResolve.current) {
      completeResolve.current()
      completeResolve.current = null
    }
  }

  async function runAnimation() {
    if (!taskTitle.trim()) return
    aborted.current = false
    const go = (p: Phase) => {
      setPhase(p)
    }

    // Capture real date + time at submission moment
    const now = new Date()
    setTaskDate(
      now.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    )
    setTaskTime(
      now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    )

    // 1. Form fades out
    go('taskCreating')
    await wait(600)

    // 2. Task appears centre, server slides in from left simultaneously
    go('taskAndServer')
    setTaskStatus('Scheduled')

    // Step 0: persist
    await wait(800)
    setActiveStep(0)
    await wait(900)
    setDoneSteps([0])

    // Step 1: background processing — task status flips to Processing
    await wait(600)
    setActiveStep(1)
    setTaskStatus('Processing')
    await wait(1100)
    setDoneSteps([0, 1])

    // Step 2: check schedule
    await wait(600)
    setActiveStep(2)
    await wait(1100)
    setDoneSteps([0, 1, 2])

    // Step 3: pre-task reminder → show pre-notif, status = "Reminder sent"
    await wait(600)
    setActiveStep(3)
    setTaskStatus('Reminder sent')
    await wait(700)
    setPreNotif(true)
    await wait(900)
    setDoneSteps([0, 1, 2, 3])

    // Pause — wait for user to click "Mark complete"
    go('waitingComplete')
    await waitForComplete()
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (aborted.current) return

    // Step 4: syncing UI state
    go('completing')
    setTaskStatus('Completed')
    setPreNotif(false)
    await wait(400)
    setActiveStep(4)
    await wait(1000)
    setDoneSteps([0, 1, 2, 3, 4])
    await wait(600)

    // Show completion notif
    setCompleteNotif(true)
    await wait(800)

    // Task fades out
    go('taskFadeOut')
    await wait(700)

    // Server slides to centre
    go('serverSlideCenter')
    await wait(1000)

    // Notif stays visible a bit, then we show insights
    await wait(1200)
    go('serverFadeOut')
    await wait(800)
    go('analysisShow')
    await wait(400)
    go('done')
  }

  function reset() {
    aborted.current = true
    completeResolve.current = null
    setPhase('formVisible')
    setTaskTitle('')
    setFocusSession(false)
    setTaskStatus('Scheduled')
    setActiveStep(-1)
    setDoneSteps([])
    setTaskDate('')
    setTaskTime('')
    setPreNotif(false)
    setCompleteNotif(false)
  }

  // ── Derived ──────────────────────────────────────────────────────────────────
  const showForm = phase === 'formVisible' || phase === 'taskCreating'
  const formOpacity = phase === 'taskCreating' ? 0 : 1

  const taskPhases: Array<Phase> = [
    'taskAndServer',
    'waitingComplete',
    'completing',
    'taskFadeOut',
  ]
  const showTask = taskPhases.includes(phase)
  const taskOpacity = phase === 'taskFadeOut' ? 0 : 1
  // Task stays centre throughout (server is independently positioned left)
  const taskX = 0

  const serverPhases: Array<Phase> = [
    'taskAndServer',
    'waitingComplete',
    'completing',
    'taskFadeOut',
    'serverSlideCenter',
    'notifShow',
    'serverFadeOut',
  ]
  const showServer = serverPhases.includes(phase)
  const serverCentered = (
    ['serverSlideCenter', 'notifShow', 'serverFadeOut'] as Array<Phase>
  ).includes(phase)
  const serverOpacity = phase === 'serverFadeOut' ? 0 : showServer ? 1 : 0

  const showAnalysis = phase === 'analysisShow' || phase === 'done'

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: 480,
        background: 'var(--background)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* ── Browser chrome ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '7px 14px',
          background: 'var(--card)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          gap: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            flexShrink: 0,
          }}
        >
          {(['#ff5f56', '#ffbd2e', '#27c93f'] as const).map((c) => (
            <span
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: c,
                display: 'inline-block',
              }}
            />
          ))}
        </div>
        <div
          style={{
            flex: 1,
            maxWidth: 320,
            margin: '0 auto',
            background: 'var(--muted)',
            border: '1px solid var(--border)',
            borderRadius: 6,
            padding: '3px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: 5,
          }}
        >
          <Lock size={9} color="var(--muted-foreground)" />
          <span
            style={{
              fontSize: 11,
              color: 'var(--muted-foreground)',
              letterSpacing: '0.01em',
            }}
          >
            {pathname}
          </span>
        </div>
        <div style={{ width: 62, flexShrink: 0 }} />
      </div>

      {/* ── App navbar ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          height: 52,
          background: 'var(--background)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: 'var(--foreground)',
            letterSpacing: '-0.02em',
            flexShrink: 0,
          }}
        >
          Task Scheduler
        </div>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeNav === item
            return (
              <span
                key={item}
                style={{
                  fontSize: 13,
                  padding: '5px 12px',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? 'var(--foreground)'
                    : 'var(--muted-foreground)',
                  background: isActive ? 'var(--accent)' : 'transparent',
                  transition: 'all 0.35s ease',
                  cursor: 'default',
                  letterSpacing: '-0.01em',
                  userSelect: 'none',
                  whiteSpace: 'nowrap',
                }}
              >
                {item}
              </span>
            )
          })}
        </nav>
        <div style={{ width: 120, flexShrink: 0 }} />
      </div>

      {/* ── Stage ── */}
      <div
        style={{
          flex: 1,
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
        }}
      >
        {/* Form */}
        {showForm && (
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% - 140px)',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: formOpacity,
              transition: 'opacity 0.5s ease',
            }}
          >
            <div
              style={{
                width: 280,
                background: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'var(--card-foreground)',
                  letterSpacing: '-0.01em',
                }}
              >
                New task
              </p>
              <input
                style={{
                  background: 'var(--input)',
                  border: '1px solid var(--border)',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  padding: '8px 11px',
                  fontSize: 13,
                  color: 'var(--foreground)',
                  outline: 'none',
                  fontFamily: 'var(--font-sans)',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
                type="text"
                placeholder="e.g. Morning meeting with team…"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && runAnimation()}
              />

              {/* Focus session toggle */}
              <div
                onClick={() => setFocusSession((v) => !v)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  border: `1px solid ${focusSession ? 'var(--primary)' : 'var(--border)'}`,
                  background: focusSession
                    ? 'color-mix(in oklch, var(--primary) 8%, transparent)'
                    : 'var(--input)',
                  cursor: 'pointer',
                  transition: 'border-color 0.25s ease, background 0.25s ease',
                  userSelect: 'none',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Flame
                    size={14}
                    color={
                      focusSession
                        ? 'var(--primary)'
                        : 'var(--muted-foreground)'
                    }
                    style={{ transition: 'color 0.25s ease', flexShrink: 0 }}
                  />
                  <div>
                    <p
                      style={{
                        fontSize: 12,
                        fontWeight: 500,
                        color: focusSession
                          ? 'var(--foreground)'
                          : 'var(--muted-foreground)',
                        margin: 0,
                        transition: 'color 0.25s ease',
                      }}
                    >
                      Focus session
                    </p>
                    <p
                      style={{
                        fontSize: 10,
                        color: 'var(--muted-foreground)',
                        margin: 0,
                      }}
                    >
                      Block distractions while working
                    </p>
                  </div>
                </div>
                {/* Toggle pill */}
                <div
                  style={{
                    width: 32,
                    height: 18,
                    borderRadius: 99,
                    background: focusSession
                      ? 'var(--primary)'
                      : 'var(--border)',
                    position: 'relative',
                    flexShrink: 0,
                    transition: 'background 0.25s ease',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: focusSession ? 'calc(100% - 15px)' : 3,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: 'white',
                      transition: 'left 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                    }}
                  />
                </div>
              </div>

              <button
                style={{
                  background: 'var(--primary)',
                  color: 'var(--primary-foreground)',
                  border: 'none',
                  borderRadius: 'calc(var(--radius) - 4px)',
                  padding: '9px 0',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'var(--font-sans)',
                  width: '100%',
                  opacity: taskTitle.trim() ? 1 : 0.4,
                  cursor: taskTitle.trim() ? 'pointer' : 'not-allowed',
                  transition: 'opacity 0.2s',
                }}
                onClick={runAnimation}
                disabled={!taskTitle.trim()}
              >
                + Add Task
              </button>
            </div>
          </div>
        )}

        {/* Analysis */}
        {showAnalysis && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              opacity: 1,
              transform: 'translateY(0)',
              transition: 'opacity 0.75s ease, transform 0.75s ease',
              overflowY: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none' as React.CSSProperties['msOverflowStyle'],
              padding: '14px 18px',
            }}
          >
            <AnalysisPanel />
          </div>
        )}

        {/* Task panel */}
        {showTask && (
          <div
            style={{
              position: 'absolute',
              left: 'calc(50% + 20px)',
              top: '50%',
              opacity: taskOpacity,
              transform: `translateY(-50%) translateX(${taskX}px)`,
              transition:
                'opacity 0.6s ease, transform 0.85s cubic-bezier(0.4,0,0.2,1)',
              willChange: 'transform, opacity',
              width: 230,
            }}
          >
            <div
              style={{
                border: focusSession
                  ? '1.5px solid var(--primary)'
                  : '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                padding: '16px 18px',
                background: focusSession
                  ? 'color-mix(in oklch, var(--primary) 5%, var(--card))'
                  : 'var(--card)',
                boxShadow: focusSession
                  ? '0 0 0 3px color-mix(in oklch, var(--primary) 15%, transparent)'
                  : 'var(--shadow-sm)',
                transition:
                  'border-color 0.4s ease, box-shadow 0.4s ease, background 0.4s ease',
              }}
            >
              {/* Focus session indicator */}
              {focusSession && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 5,
                    marginBottom: 8,
                  }}
                >
                  <Flame size={11} color="oklch(0.6056 0.2189 292.7172)" />
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 600,
                      color: 'oklch(0.6056 0.2189 292.7172)',
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Focus session
                  </span>
                </div>
              )}

              {/* Status badge */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  marginBottom: 10,
                }}
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    flexShrink: 0,
                    background: STATUS_COLOR[taskStatus],
                    display: 'inline-block',
                    transition: 'background 0.4s ease',
                  }}
                />
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 500,
                    letterSpacing: '0.03em',
                    color: STATUS_COLOR[taskStatus],
                    transition: 'color 0.4s ease',
                  }}
                >
                  {taskStatus}
                </span>
              </div>

              {/* Title */}
              <p
                style={{
                  fontSize: 15,
                  fontWeight: 700,
                  color: 'var(--card-foreground)',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  marginBottom: 12,
                }}
              >
                {taskTitle}
              </p>

              {/* Meta — real captured date + time */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  marginBottom: 14,
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <CalendarCheck size={11} /> {taskDate}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 11,
                    color: 'var(--muted-foreground)',
                  }}
                >
                  <Clock size={11} /> {taskTime}
                </span>
              </div>

              {/* Mark complete button — only shown when waiting */}
              <div
                style={{
                  overflow: 'hidden',
                  maxHeight: phase === 'waitingComplete' ? 48 : 0,
                  opacity: phase === 'waitingComplete' ? 1 : 0,
                  transition: 'max-height 0.4s ease, opacity 0.4s ease',
                }}
              >
                <button
                  onClick={handleMarkComplete}
                  style={{
                    width: '100%',
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    border: 'none',
                    borderRadius: 'calc(var(--radius) - 4px)',
                    padding: '8px 0',
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: 'var(--font-sans)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <CheckCircle2 size={13} /> Mark as complete
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Server — animated DB stack */}
        {showServer && (
          <div
            style={{
              position: 'absolute',
              left: serverCentered ? 'calc(50% - 125px)' : 'calc(50% - 370px)',
              top: '50%',
              transform: 'translateY(-50%)',
              opacity: serverOpacity,
              transition:
                'opacity 0.7s ease, left 0.9s cubic-bezier(0.4,0,0.2,1)',
              willChange: 'left, opacity',
              width: 250,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
            }}
          >
            {/* DB stack SVG */}
            <DBStack
              doneSteps={doneSteps}
              activeStep={activeStep}
              totalSteps={SERVER_STEPS.length}
            />

            {/* Current step label — shows active step, or last done step */}
            {activeStep >= 0 &&
              (() => {
                const displayIdx = activeStep
                const step = SERVER_STEPS[displayIdx]
                const isDone = doneSteps.includes(displayIdx)
                return (
                  <div style={{ textAlign: 'center', minHeight: 38 }}>
                    <p
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        marginBottom: 2,
                        letterSpacing: '-0.01em',
                        color: isDone
                          ? 'var(--muted-foreground)'
                          : 'var(--foreground)',
                        transition: 'color 0.35s ease',
                      }}
                    >
                      {step.label}
                    </p>
                    <p
                      style={{ fontSize: 11, color: 'var(--muted-foreground)' }}
                    >
                      {step.sub}
                    </p>
                  </div>
                )
              })()}

            {/* Progress dots */}
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {SERVER_STEPS.map((_, i) => {
                const isDone = doneSteps.includes(i)
                const isActive = activeStep === i && !isDone
                return (
                  <div
                    key={i}
                    style={{
                      width: isActive ? 18 : 6,
                      height: 6,
                      borderRadius: 99,
                      background: isDone
                        ? '#22c55e'
                        : isActive
                          ? 'var(--primary)'
                          : 'var(--border)',
                      transition:
                        'width 0.35s cubic-bezier(0.34,1.56,0.64,1), background 0.35s ease',
                    }}
                  />
                )
              })}
            </div>
          </div>
        )}

        {/* Pre-task reminder toast */}
        <Toast
          visible={preNotif}
          title="Reminder: task starting soon"
          body={taskTitle}
          timestamp={taskTime}
          onDismiss={() => setPreNotif(false)}
        />

        {/* Completion toast */}
        <Toast
          visible={completeNotif}
          title="Task completed"
          body={taskTitle}
          timestamp={taskTime}
          onDismiss={() => setCompleteNotif(false)}
        />

        {/* Reset */}
        {phase === 'done' && (
          <button
            onClick={reset}
            style={{
              position: 'absolute',
              bottom: 14,
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--background)',
              border: '1px solid var(--border)',
              borderRadius: 'calc(var(--radius) - 4px)',
              padding: '5px 16px',
              fontSize: 12,
              color: 'var(--muted-foreground)',
              cursor: 'pointer',
              fontFamily: 'var(--font-sans)',
              zIndex: 50,
            }}
          >
            ↺ Try again
          </button>
        )}
      </div>

      <style>{`
        @keyframes tfNotifIn { from{opacity:0;transform:translateX(24px)} to{opacity:1;transform:translateX(0)} }
        @keyframes tfBlink   { 0%,100%{opacity:1} 50%{opacity:0.25} }
      `}</style>
    </div>
  )
}

// ─── DB Stack animation ───────────────────────────────────────────────────────
interface DBStackProps {
  doneSteps: Array<number>
  activeStep: number
  totalSteps: number
}

function DBStack({ doneSteps, activeStep, totalSteps }: DBStackProps) {
  // SVG canvas
  const W = 160
  const H = 200

  // Cylinder geometry
  const cx = W / 2 // centre x
  const rx = 56 // ellipse x-radius (width of disc)
  const ry = 14 // ellipse y-radius (depth illusion)
  const layerH = 24 // height of each cylinder segment
  const baseY = H - 24 // bottom ellipse centre y

  // Per-layer colours (index = step index, bottom→top = 0→4)
  // Layers are drawn bottom-first so layer 0 is the base
  const LAYER_COLORS = [
    { fill: '#bfdbfe', stroke: '#3b82f6', glow: '#3b82f6' }, // blue-200 / blue-500
    { fill: '#bbf7d0', stroke: '#22c55e', glow: '#22c55e' }, // green-200 / green-500
    { fill: '#fde68a', stroke: '#f59e0b', glow: '#f59e0b' }, // amber-200 / amber-500
    { fill: '#e9d5ff', stroke: '#a855f7', glow: '#a855f7' }, // purple-200 / purple-500
    { fill: '#fecaca', stroke: '#ef4444', glow: '#ef4444' }, // red-200 / red-500
  ]

  // Build visible layers — layers appear bottom-up as steps complete/activate
  // Layer i is visible when activeStep >= i
  const layers: Array<React.JSX.Element> = []

  for (let i = 0; i < totalSteps; i++) {
    const isDone = doneSteps.includes(i)
    const isActive = activeStep === i && !isDone
    const isVis = activeStep >= i

    if (!isVis) continue

    // This layer sits at position i from the bottom
    // bottom of this segment: baseY - i * layerH
    const segBottom = baseY - i * layerH
    const segTop = segBottom - layerH
    const col = LAYER_COLORS[i % LAYER_COLORS.length]

    const fillColor = isDone ? col.fill : '#e2e8f0'
    const strokeColor = isDone ? col.stroke : '#94a3b8'

    layers.push(
      <g
        key={i}
        style={{
          animation: `dbLayerIn${i} 0.55s cubic-bezier(0.34,1.56,0.64,1) forwards`,
          opacity: 0,
        }}
      >
        {/* Side rectangle of cylinder segment */}
        <rect
          x={cx - rx}
          y={segTop}
          width={rx * 2}
          height={layerH}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isActive ? 1.5 : 1}
          style={{ transition: 'fill 0.4s ease, stroke 0.4s ease' }}
        />
        {/* Top ellipse of this segment */}
        <ellipse
          cx={cx}
          cy={segTop}
          rx={rx}
          ry={ry}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={isActive ? 1.5 : 1}
          style={{ transition: 'fill 0.4s ease, stroke 0.4s ease' }}
        />
        {/* Active glow ring */}
        {isActive && (
          <ellipse
            cx={cx}
            cy={segTop}
            rx={rx + 4}
            ry={ry + 2}
            fill="none"
            stroke={col.glow}
            strokeWidth={2}
            strokeOpacity={0.4}
            style={{ animation: 'dbGlow 1s ease-in-out infinite alternate' }}
          />
        )}
        {/* Done checkmark on the side face */}
        {isDone && (
          <text
            x={cx}
            y={segBottom - layerH / 2 + 4}
            textAnchor="middle"
            fontSize={10}
            fill={strokeColor}
            fontWeight="700"
            style={{ userSelect: 'none' }}
          >
            ✓
          </text>
        )}
        {/* Active spinner dot */}
        {isActive && (
          <circle
            cx={cx}
            cy={segBottom - layerH / 2}
            r={3}
            fill={strokeColor}
            style={{ animation: 'dbPulse 0.9s ease-in-out infinite alternate' }}
          />
        )}
      </g>,
    )
  }

  // Bottom base ellipse — always visible as the "ground"
  const baseEllipse = (
    <ellipse
      key="base"
      cx={cx}
      cy={baseY}
      rx={rx}
      ry={ry}
      fill="var(--muted)"
      stroke="var(--border)"
      strokeWidth={1}
    />
  )

  // Build per-layer keyframe CSS
  const keyframes = Array.from({ length: totalSteps }, (_, i) => {
    const segBottom = baseY - i * layerH
    const segTop = segBottom - layerH
    // Drop in from above (start 20px higher, scale from 0.8)
    return `
      @keyframes dbLayerIn${i} {
        from { opacity: 0; transform: translateY(-20px) scaleY(0.7); transform-origin: ${cx}px ${segTop}px; }
        to   { opacity: 1; transform: translateY(0)    scaleY(1);   transform-origin: ${cx}px ${segTop}px; }
      }
    `
  }).join('\n')

  const extraKeyframes = `
    @keyframes dbGlow   { from { stroke-opacity: 0.2; } to { stroke-opacity: 0.7; } }
    @keyframes dbPulse  { from { r: 2; opacity: 0.5; } to { r: 4; opacity: 1; } }
  `

  return (
    <div
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: 'visible' }}
      >
        {/* Shadow beneath base */}
        <ellipse
          cx={cx}
          cy={baseY + ry}
          rx={rx - 4}
          ry={5}
          fill="rgba(0,0,0,0.07)"
        />
        {baseEllipse}
        {layers}
      </svg>
      <style>{keyframes + extraKeyframes}</style>
    </div>
  )
}

// ─── Analysis Panel ───────────────────────────────────────────────────────────
function AnalysisPanel() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        fontFamily: 'var(--font-sans)',
      }}
    >
      <div>
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            marginBottom: 3,
          }}
        >
          Behavior Intelligence
        </p>
        <p
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: 'var(--foreground)',
            letterSpacing: '-0.03em',
            marginBottom: 1,
          }}
        >
          Insights
        </p>
        <p style={{ fontSize: 11, color: 'var(--muted-foreground)' }}>
          Based on 12 total tasks this week
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: 8,
        }}
      >
        {METRIC_CARDS.map(({ label, value, trend, Icon, colorVar, bgVar }) => (
          <div
            key={label}
            style={{
              background: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: 'calc(var(--radius) - 2px)',
              padding: '10px 12px',
              boxShadow: 'var(--shadow-xs)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 8,
                  background: bgVar,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={14} color={colorVar} />
              </div>
              {trend === 'up' && (
                <TrendingUp size={12} color="var(--chart-3)" />
              )}
              {trend === 'down' && (
                <TrendingDown size={12} color="var(--destructive)" />
              )}
            </div>
            <p
              style={{
                fontSize: 20,
                fontWeight: 700,
                color: 'var(--card-foreground)',
                letterSpacing: '-0.04em',
                marginBottom: 2,
              }}
            >
              {value}
            </p>
            <p style={{ fontSize: 10, color: 'var(--muted-foreground)' }}>
              {label}
            </p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'calc(var(--radius) - 2px)',
            padding: '12px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              marginBottom: 2,
            }}
          >
            Completion Consistency
          </p>
          <p
            style={{
              fontSize: 10,
              color: 'var(--muted-foreground)',
              marginBottom: 10,
            }}
          >
            Completed tasks per day — last 6 weeks
          </p>
          <HeatmapGrid />
        </div>
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 'calc(var(--radius) - 2px)',
            padding: '12px',
            boxShadow: 'var(--shadow-xs)',
          }}
        >
          <p
            style={{
              fontSize: 9,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--muted-foreground)',
              marginBottom: 2,
            }}
          >
            Peak Productivity Hours
          </p>
          <p
            style={{
              fontSize: 10,
              color: 'var(--muted-foreground)',
              marginBottom: 10,
            }}
          >
            Task activity by hour of day
          </p>
          <PeakChart data={PEAK_HOURS} />
        </div>
      </div>
      <div
        style={{
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 'calc(var(--radius) - 2px)',
          padding: '12px',
          boxShadow: 'var(--shadow-xs)',
        }}
      >
        <p
          style={{
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: 'var(--muted-foreground)',
            marginBottom: 2,
          }}
        >
          Weekly Breakdown
        </p>
        <p
          style={{
            fontSize: 10,
            color: 'var(--muted-foreground)',
            marginBottom: 10,
          }}
        >
          Scheduled · Completed · Missed per week
        </p>
        <WeeklyBars data={WEEKLY} />
      </div>
    </div>
  )
}

function HeatmapGrid() {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-start' }}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          marginRight: 4,
          paddingTop: 16,
        }}
      >
        {['M', 'T', 'W', 'T', 'F'].map((d, i) => (
          <span
            key={i}
            style={{
              fontSize: 9,
              color: 'var(--muted-foreground)',
              lineHeight: 1,
              height: 12,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {d}
          </span>
        ))}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
          {Array.from({ length: 8 }).map((_, wi) => (
            <span
              key={wi}
              style={{
                flex: 1,
                fontSize: 8,
                color: 'var(--muted-foreground)',
                textAlign: 'center',
              }}
            >
              {wi % 2 === 0 ? `W${wi + 1}` : ''}
            </span>
          ))}
        </div>
        {HEATMAP.map((row, ri) => (
          <div key={ri} style={{ display: 'flex', gap: 3, marginBottom: 3 }}>
            {row.map((v, ci) => (
              <div
                key={ci}
                style={{
                  flex: 1,
                  height: 12,
                  borderRadius: 3,
                  background:
                    v === 0
                      ? 'var(--muted)'
                      : v === 1
                        ? 'color-mix(in oklch, var(--primary) 25%, transparent)'
                        : v === 2
                          ? 'color-mix(in oklch, var(--primary) 55%, transparent)'
                          : 'var(--primary)',
                }}
              />
            ))}
          </div>
        ))}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: 4,
          }}
        >
          <span style={{ fontSize: 9, color: 'var(--muted-foreground)' }}>
            Less
          </span>
          <span style={{ fontSize: 9, color: 'var(--muted-foreground)' }}>
            More
          </span>
        </div>
      </div>
    </div>
  )
}

function PeakChart({ data }: { data: Array<number> }) {
  const W = 220,
    H = 52
  const max = Math.max(...data)
  const pts = data.map(
    (v, i) =>
      `${((i / (data.length - 1)) * W).toFixed(1)},${(H - (v / max) * H).toFixed(1)}`,
  )
  const line = `M${pts.join('L')}`
  const area = `${line} L${W},${H} L0,${H} Z`
  const shown = ['5:00', '09:00', '12:00', '15:00', '18:00', '21:00']
  return (
    <div>
      <svg
        width="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{ overflow: 'visible', display: 'block' }}
      >
        <defs>
          <linearGradient id="tfPeakGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#tfPeakGrad)" />
        <path
          d={line}
          fill="none"
          stroke="oklch(0.6056 0.2189 292.7172)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M0,${H} L${W},${H}`}
          stroke="var(--border)"
          strokeWidth="0.5"
        />
      </svg>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        {shown.map((h) => (
          <span
            key={h}
            style={{ fontSize: 9, color: 'var(--muted-foreground)' }}
          >
            {h}
          </span>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 6 }}>
        {[
          { color: 'oklch(0.6056 0.2189 292.7172)', label: 'Scheduled' },
          { color: 'oklch(0.7137 0.1434 254.624)', label: 'Completed' },
        ].map(({ color, label }) => (
          <span
            key={label}
            style={{
              fontSize: 9,
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 14,
                height: 2,
                background: color,
                display: 'inline-block',
                borderRadius: 1,
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}

function WeeklyBars({ data }: { data: typeof WEEKLY }) {
  const max = Math.max(...data.map((d) => d.scheduled))
  return (
    <div>
      <div
        style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 72 }}
      >
        {data.map((d, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              height: '100%',
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                gap: 2,
                alignItems: 'flex-end',
              }}
            >
              <div
                style={{
                  flex: 1,
                  height: `${(d.scheduled / max) * 56}px`,
                  background:
                    'color-mix(in oklch, var(--primary) 30%, transparent)',
                  borderRadius: '3px 3px 0 0',
                  minHeight: 2,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: `${(d.completed / max) * 56}px`,
                  background: 'var(--primary)',
                  borderRadius: '3px 3px 0 0',
                  minHeight: 2,
                }}
              />
              <div
                style={{
                  flex: 1,
                  height: `${(d.missed / max) * 56}px`,
                  background: 'var(--destructive)',
                  borderRadius: '3px 3px 0 0',
                  minHeight: d.missed ? 2 : 0,
                }}
              />
            </div>
            <span style={{ fontSize: 9, color: 'var(--muted-foreground)' }}>
              {d.week}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
        {[
          {
            label: 'Scheduled',
            color: 'color-mix(in oklch, var(--primary) 30%, transparent)',
          },
          { label: 'Completed', color: 'var(--primary)' },
          { label: 'Missed', color: 'var(--destructive)' },
        ].map(({ label, color }) => (
          <span
            key={label}
            style={{
              fontSize: 9,
              color: 'var(--muted-foreground)',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 2,
                background: color,
                display: 'inline-block',
              }}
            />
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
